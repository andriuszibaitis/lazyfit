import { execSync } from "child_process";
import path from "path";

const seeds = [
  "seed-memberships.ts",
  "seed-food-products.ts",
  "seed-test-user.ts",
  "seed-courses.ts",
  "seed-achievements.ts",
  "seed-faq.ts",
  "seed-workouts.ts",
  "seed-exercises-extra.ts",
  "seed-programs.ts",
];

async function main() {
  console.log("🚀 Running all seed scripts...\n");

  for (const seed of seeds) {
    const seedPath = path.join(__dirname, seed);
    console.log(`\n📦 Running ${seed}...`);
    console.log("─".repeat(50));
    try {
      execSync(`npx tsx ${seedPath}`, {
        stdio: "inherit",
        cwd: path.join(__dirname, ".."),
      });
    } catch (error) {
      console.error(`❌ Failed to run ${seed}`);
    }
  }

  console.log("\n" + "═".repeat(50));
  console.log("✅ All seeds completed!");
}

main();
