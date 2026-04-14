/**
 * Import food products from OpenFoodFacts API (Lithuanian market).
 *
 * Run with:
 *   npx tsx prisma/import-openfoodfacts.ts
 *
 * Behaviour:
 *  - ADDITIVE: does NOT delete existing products. Safe to re-run.
 *  - Dedupes against existing DB records (case-insensitive name match).
 *  - Retries OFF API on 5xx / network errors with exponential backoff.
 *  - Uses multiple search strategies to balance category coverage.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ---------- Config ----------

const USER_AGENT = "lazyfit.lt - import-script - https://lazyfit.lt";
const OFF_SEARCH_URL = "https://world.openfoodfacts.org/api/v2/search";
const PAGE_SIZE = 100;
const TARGET_PRODUCTS = 1000;
const MIN_UNIQUE_SCANS = 1; // very permissive — LT dataset is small
const MAX_RETRIES = 6;

// Search "strategies" — we iterate them in order and stop once TARGET_PRODUCTS reached.
// Each strategy is a set of query params + a max page count.
interface Strategy {
  label: string;
  params: Record<string, string>;
  maxPages: number;
}

const STRATEGIES: Strategy[] = [
  {
    label: "LT popular (all)",
    params: { countries_tags_en: "lithuania", sort_by: "unique_scans_n" },
    maxPages: 60,
  },
  {
    label: "LT meats",
    params: { countries_tags_en: "lithuania", categories_tags_en: "meats", sort_by: "unique_scans_n" },
    maxPages: 10,
  },
  {
    label: "LT fishes",
    params: { countries_tags_en: "lithuania", categories_tags_en: "fishes", sort_by: "unique_scans_n" },
    maxPages: 10,
  },
  {
    label: "LT cheeses",
    params: { countries_tags_en: "lithuania", categories_tags_en: "cheeses", sort_by: "unique_scans_n" },
    maxPages: 10,
  },
  {
    label: "LT breads",
    params: { countries_tags_en: "lithuania", categories_tags_en: "breads", sort_by: "unique_scans_n" },
    maxPages: 10,
  },
  {
    label: "LT fruits",
    params: { countries_tags_en: "lithuania", categories_tags_en: "fruits", sort_by: "unique_scans_n" },
    maxPages: 8,
  },
  {
    label: "LT vegetables",
    params: { countries_tags_en: "lithuania", categories_tags_en: "vegetables", sort_by: "unique_scans_n" },
    maxPages: 8,
  },
  {
    label: "LT legumes",
    params: { countries_tags_en: "lithuania", categories_tags_en: "legumes", sort_by: "unique_scans_n" },
    maxPages: 5,
  },
  {
    label: "LT cereals",
    params: { countries_tags_en: "lithuania", categories_tags_en: "cereals-and-potatoes", sort_by: "unique_scans_n" },
    maxPages: 10,
  },
];

// ---------- Category mapping (OFF tag keywords -> our LT category) ----------
const CATEGORY_RULES: Array<{ match: RegExp; category: string }> = [
  { match: /\b(meats?|poultry|beef|pork|lamb|chicken|turkey|sausages|hams?|bacons?|rabbits?|salami|pates?)\b/, category: "Mėsa" },
  { match: /\b(fishes?|seafoods?|salmons?|tunas?|shrimps?|prawns|herrings?|mackerels?|cods?|trouts?|sardines?|anchovies)\b/, category: "Žuvis" },
  { match: /\beggs?\b/, category: "Kiaušiniai" },
  { match: /\b(dairies|milks?|yogurts?|cheeses?|cottage-cheeses?|creams?|kefirs?|quarks?|curds?)\b/, category: "Pieno produktai" },
  { match: /\b(legumes?|beans?|lentils?|chickpeas?|soybeans?|tofus?|tempehs?|hummus|peas?)\b/, category: "Ankštiniai" },
  { match: /\b(nuts?|almonds?|walnuts?|peanuts?|cashews?|pistachios?|hazelnuts?|seeds?|chia|flaxseeds?)\b/, category: "Riešutai" },
  { match: /\b(olive-oils?|vegetable-oils?|sunflower-oils?|margarines?|cooking-fats?|oils?)\b/, category: "Aliejus ir riebalai" },
  { match: /\b(butters?)\b/, category: "Pieno produktai" },
  { match: /\b(breads?|cereals?|pastas?|noodles|rices?|flours?|oats?|buckwheats?|quinoas?|couscous|bulgur|breakfast-cereals?|porridges?|cereals-and-potatoes)\b/, category: "Grūdai" },
  { match: /\b(fruits?|berries|apples?|bananas?|oranges?|strawberries|blueberries|grapes?|melons?|peaches?|pears?|pineapples?|mangoes?)\b/, category: "Vaisiai" },
  { match: /\b(vegetables?|potatoes?|tomatoes?|cucumbers?|carrots?|onions?|peppers?|broccolis?|cabbages?|spinach|mushrooms?|salads?|zucchinis?)\b/, category: "Daržovės" },
  { match: /\b(sweets?|chocolates?|candies|honeys?|sugars?|jams?|desserts?|ice-creams?|confectioneries?|biscuits?|cookies?|cakes?|pastries)\b/, category: "Saldikliai" },
  { match: /\b(beverages?|drinks?|waters?|sodas?|juices?|teas?|coffees?|smoothies|plant-based-beverages?|plant-milks?)\b/, category: "Gėrimai" },
  { match: /\b(snacks?|chips?|crackers?|crisps?|popcorns?|pretzels?)\b/, category: "Užkandžiai" },
];

// ---------- Types ----------

interface OffNutriments {
  "energy-kcal_100g"?: number;
  energy_100g?: number;
  "energy-kj_100g"?: number;
  proteins_100g?: number;
  carbohydrates_100g?: number;
  fat_100g?: number;
  fiber_100g?: number;
  sugars_100g?: number;
}

interface OffProduct {
  code?: string;
  product_name?: string;
  product_name_lt?: string;
  generic_name?: string;
  generic_name_lt?: string;
  brands?: string;
  categories_tags?: string[];
  nutriments?: OffNutriments;
  unique_scans_n?: number;
}

interface OffSearchResponse {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: OffProduct[];
}

interface ParsedProduct {
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number | null;
  sugar: number | null;
}

// ---------- Helpers ----------

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function jitteredDelay(): number {
  return 300 + Math.floor(Math.random() * 400); // 300-700ms
}

function cleanText(input: string | undefined | null): string {
  if (!input) return "";
  return input.replace(/\s+/g, " ").replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
}

function pickName(p: OffProduct): string {
  const candidates = [p.product_name_lt, p.product_name, p.generic_name_lt, p.generic_name]
    .map(cleanText)
    .filter(Boolean);
  const base = candidates[0];
  if (!base) return "";
  const brand = cleanText(p.brands?.split(",")[0]);
  if (brand && !base.toLowerCase().includes(brand.toLowerCase())) {
    return `${brand} ${base}`.slice(0, 120);
  }
  return base.slice(0, 120);
}

function mapCategory(tags: string[] | undefined): string | null {
  if (!tags || tags.length === 0) return null;
  const reversed = [...tags].reverse();
  for (const tag of reversed) {
    const normalized = tag.replace(/^[a-z]{2}:/, "").toLowerCase();
    for (const rule of CATEGORY_RULES) {
      if (rule.match.test(normalized)) return rule.category;
    }
  }
  return null;
}

function extractKcal(n: OffNutriments): number | null {
  if (typeof n["energy-kcal_100g"] === "number") return n["energy-kcal_100g"];
  if (typeof n["energy-kj_100g"] === "number") return Math.round(n["energy-kj_100g"] / 4.184);
  if (typeof n.energy_100g === "number") return Math.round(n.energy_100g / 4.184);
  return null;
}

function parseProduct(p: OffProduct): ParsedProduct | null {
  const name = pickName(p);
  if (!name || name.length < 3) return null;

  const category = mapCategory(p.categories_tags);
  if (!category) return null;

  const n = p.nutriments;
  if (!n) return null;

  const calories = extractKcal(n);
  const protein = n.proteins_100g;
  const carbs = n.carbohydrates_100g;
  const fat = n.fat_100g;

  if (
    calories == null || calories <= 0 || calories > 1000 ||
    typeof protein !== "number" ||
    typeof carbs !== "number" ||
    typeof fat !== "number"
  ) return null;

  if (protein < 0 || carbs < 0 || fat < 0) return null;
  if (protein > 100 || carbs > 100 || fat > 100) return null;

  return {
    name,
    category,
    calories: Math.round(calories * 10) / 10,
    protein: Math.round(protein * 10) / 10,
    carbs: Math.round(carbs * 10) / 10,
    fat: Math.round(fat * 10) / 10,
    fiber: typeof n.fiber_100g === "number" ? Math.round(n.fiber_100g * 10) / 10 : null,
    sugar: typeof n.sugars_100g === "number" ? Math.round(n.sugars_100g * 10) / 10 : null,
  };
}

// Retry wrapper: exponential backoff for 5xx / network errors.
async function fetchWithRetry(url: string): Promise<OffSearchResponse> {
  let lastErr: unknown = null;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
      });
      if (res.ok) {
        return (await res.json()) as OffSearchResponse;
      }
      // Retry on 5xx and 429
      if (res.status >= 500 || res.status === 429) {
        lastErr = new Error(`HTTP ${res.status}`);
      } else {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      lastErr = err;
    }
    // Exponential backoff: 2s, 4s, 8s, 16s, 30s, 60s
    const wait = Math.min(60000, 2000 * 2 ** attempt);
    process.stdout.write(`   …retry in ${Math.round(wait / 1000)}s (attempt ${attempt + 1}/${MAX_RETRIES})\n`);
    await sleep(wait);
  }
  throw lastErr instanceof Error ? lastErr : new Error("fetch failed");
}

function buildUrl(params: Record<string, string>, page: number): string {
  const url = new URL(OFF_SEARCH_URL);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("page_size", String(PAGE_SIZE));
  url.searchParams.set("page", String(page));
  url.searchParams.set(
    "fields",
    [
      "code",
      "product_name",
      "product_name_lt",
      "generic_name",
      "generic_name_lt",
      "brands",
      "categories_tags",
      "nutriments",
      "unique_scans_n",
    ].join(","),
  );
  return url.toString();
}

// ---------- Main ----------

async function main() {
  console.log("📚 Loading existing product names for dedup...");
  const existing = await prisma.foodProduct.findMany({ select: { name: true } });
  const seen = new Set<string>(existing.map((p) => p.name.toLowerCase().trim()));
  console.log(`   ${seen.size} existing products will be preserved.\n`);

  const collected: ParsedProduct[] = [];
  let totalSeen = 0;
  let totalSkipped = 0;

  for (const strat of STRATEGIES) {
    if (collected.length >= TARGET_PRODUCTS) break;
    console.log(`🌐 Strategy: ${strat.label}`);

    for (let page = 1; page <= strat.maxPages; page++) {
      if (collected.length >= TARGET_PRODUCTS) break;

      let resp: OffSearchResponse;
      try {
        resp = await fetchWithRetry(buildUrl(strat.params, page));
      } catch (err) {
        console.warn(`   ⚠️  Gave up on page ${page}: ${(err as Error).message}`);
        continue;
      }

      if (!resp.products || resp.products.length === 0) {
        console.log(`   Page ${page}: empty, moving on.`);
        break;
      }

      let addedThisPage = 0;
      for (const raw of resp.products) {
        totalSeen++;
        if ((raw.unique_scans_n ?? 0) < MIN_UNIQUE_SCANS) {
          totalSkipped++;
          continue;
        }
        const product = parseProduct(raw);
        if (!product) {
          totalSkipped++;
          continue;
        }
        const key = product.name.toLowerCase().trim();
        if (seen.has(key)) {
          totalSkipped++;
          continue;
        }
        seen.add(key);
        collected.push(product);
        addedThisPage++;
      }

      console.log(
        `   Page ${page}/${resp.page_count}: +${addedThisPage} new (total kept ${collected.length}, seen ${totalSeen}, skipped ${totalSkipped})`,
      );

      if (page >= resp.page_count) {
        console.log(`   Reached last page for this strategy.`);
        break;
      }
      await sleep(jitteredDelay());
    }
    console.log("");
  }

  console.log(`📦 Collected ${collected.length} new products to insert.\n`);

  if (collected.length === 0) {
    console.log("Nothing to insert. Exiting.");
    return;
  }

  const byCategory = new Map<string, number>();
  for (const p of collected) byCategory.set(p.category, (byCategory.get(p.category) ?? 0) + 1);
  console.log("Category breakdown (new products only):");
  for (const [cat, n] of [...byCategory.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`   ${cat.padEnd(20)} ${n}`);
  }
  console.log("");

  console.log("💾 Inserting into database...");
  let inserted = 0;
  const BATCH = 200;
  for (let i = 0; i < collected.length; i += BATCH) {
    const chunk = collected.slice(i, i + BATCH);
    const result = await prisma.foodProduct.createMany({
      data: chunk.map((p) => ({
        name: p.name,
        category: p.category,
        calories: p.calories,
        protein: p.protein,
        carbs: p.carbs,
        fat: p.fat,
        fiber: p.fiber,
        sugar: p.sugar,
        serving: 100,
        servingUnit: "g",
        isActive: true,
        isUserCreated: false,
      })),
    });
    inserted += result.count;
    console.log(`   Inserted ${inserted}/${collected.length}`);
  }

  // Final totals
  const finalCount = await prisma.foodProduct.count({ where: { isUserCreated: false } });
  console.log(`\n✅ Import complete. Added ${inserted} new products.`);
  console.log(`   Total non-user-created products in DB: ${finalCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Import failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
