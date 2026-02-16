import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const memberships = [
  {
    name: "Mėnesinė narystė",
    planId: "monthly",
    price: 19.99,
    discountPercentage: 0,
    duration: 30,
    description: "Pilna prieiga prie visų LazyFit funkcijų vienam mėnesiui.",
    features: [
      "Visos treniruočių programos",
      "Mitybos planai ir receptai",
      "Kalorijų skaičiuoklė",
      "Edukaciniai kursai",
      "Progreso sekimas",
      "El. pašto palaikymas",
    ],
    isActive: true,
    showOnHomepage: true,
  },
  {
    name: "3 mėnesių narystė",
    planId: "quarterly",
    price: 49.99,
    discountPercentage: 17,
    duration: 90,
    description: "Pilna prieiga 3 mėnesiams su nuolaida. Sutaupykite 17%!",
    features: [
      "Visos treniruočių programos",
      "Mitybos planai ir receptai",
      "Kalorijų skaičiuoklė",
      "Edukaciniai kursai",
      "Progreso sekimas",
      "Prioritetinis el. pašto palaikymas",
      "Asmeniniai patarimai",
    ],
    isActive: true,
    showOnHomepage: true,
  },
  {
    name: "Metinė narystė",
    planId: "yearly",
    price: 149.99,
    discountPercentage: 38,
    duration: 365,
    description: "Geriausia vertė! Pilna prieiga visiems metams su 38% nuolaida.",
    features: [
      "Visos treniruočių programos",
      "Mitybos planai ir receptai",
      "Kalorijų skaičiuoklė",
      "Edukaciniai kursai",
      "Progreso sekimas",
      "Prioritetinis palaikymas",
      "Asmeniniai patarimai",
      "Ekskluzyvūs iššūkiai",
      "Ankstyvoji prieiga prie naujų funkcijų",
    ],
    isActive: true,
    showOnHomepage: true,
  },
];

async function main() {
  console.log("🌱 Seeding memberships...");

  for (const membership of memberships) {
    const existing = await prisma.membership.findUnique({
      where: { planId: membership.planId },
    });

    if (existing) {
      await prisma.membership.update({
        where: { planId: membership.planId },
        data: {
          name: membership.name,
          price: membership.price,
          discountPercentage: membership.discountPercentage,
          duration: membership.duration,
          description: membership.description,
          features: membership.features,
          isActive: membership.isActive,
          showOnHomepage: membership.showOnHomepage,
        },
      });
      console.log(`✅ Updated membership: ${membership.name}`);
    } else {
      await prisma.membership.create({
        data: {
          name: membership.name,
          planId: membership.planId,
          price: membership.price,
          discountPercentage: membership.discountPercentage,
          duration: membership.duration,
          description: membership.description,
          features: membership.features,
          isActive: membership.isActive,
          showOnHomepage: membership.showOnHomepage,
        },
      });
      console.log(`✅ Created membership: ${membership.name}`);
    }
  }

  console.log("🎉 Memberships seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding memberships:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
