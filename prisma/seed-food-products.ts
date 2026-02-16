import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// All values per 100g serving
const foodProducts = [
  // === MĖSA / MEAT ===
  { name: "Vištienos krūtinėlė", category: "Mėsa", calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0 },
  { name: "Vištienos šlaunelė", category: "Mėsa", calories: 209, protein: 26, carbs: 0, fat: 10.9, fiber: 0, sugar: 0 },
  { name: "Jautiena (liesa)", category: "Mėsa", calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, sugar: 0 },
  { name: "Jautienos nugarinė", category: "Mėsa", calories: 217, protein: 28, carbs: 0, fat: 11, fiber: 0, sugar: 0 },
  { name: "Kiaulienos nugarinė", category: "Mėsa", calories: 242, protein: 27, carbs: 0, fat: 14, fiber: 0, sugar: 0 },
  { name: "Kiauliena (liesa)", category: "Mėsa", calories: 196, protein: 27, carbs: 0, fat: 9, fiber: 0, sugar: 0 },
  { name: "Kalakutienos krūtinėlė", category: "Mėsa", calories: 135, protein: 30, carbs: 0, fat: 1, fiber: 0, sugar: 0 },
  { name: "Ėriena", category: "Mėsa", calories: 294, protein: 25, carbs: 0, fat: 21, fiber: 0, sugar: 0 },
  { name: "Triušiena", category: "Mėsa", calories: 173, protein: 33, carbs: 0, fat: 3.5, fiber: 0, sugar: 0 },

  // === ŽUVIS / FISH ===
  { name: "Lašiša", category: "Žuvis", calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sugar: 0 },
  { name: "Tuna", category: "Žuvis", calories: 130, protein: 29, carbs: 0, fat: 1, fiber: 0, sugar: 0 },
  { name: "Menkė", category: "Žuvis", calories: 82, protein: 18, carbs: 0, fat: 0.7, fiber: 0, sugar: 0 },
  { name: "Upėtakis", category: "Žuvis", calories: 141, protein: 20, carbs: 0, fat: 6.2, fiber: 0, sugar: 0 },
  { name: "Silkė", category: "Žuvis", calories: 203, protein: 18, carbs: 0, fat: 14, fiber: 0, sugar: 0 },
  { name: "Krevetės", category: "Žuvis", calories: 85, protein: 20, carbs: 0, fat: 0.5, fiber: 0, sugar: 0 },
  { name: "Skumbrė", category: "Žuvis", calories: 205, protein: 19, carbs: 0, fat: 14, fiber: 0, sugar: 0 },

  // === KIAUŠINIAI ===
  { name: "Kiaušinis (visas)", category: "Kiaušiniai", calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1 },
  { name: "Kiaušinio baltymas", category: "Kiaušiniai", calories: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0, sugar: 0.7 },
  { name: "Kiaušinio trynys", category: "Kiaušiniai", calories: 322, protein: 16, carbs: 3.6, fat: 27, fiber: 0, sugar: 0.6 },

  // === PIENO PRODUKTAI / DAIRY ===
  { name: "Pienas 2.5%", category: "Pieno produktai", calories: 52, protein: 3.4, carbs: 4.8, fat: 2.5, fiber: 0, sugar: 4.8 },
  { name: "Pienas 3.5%", category: "Pieno produktai", calories: 64, protein: 3.3, carbs: 4.7, fat: 3.5, fiber: 0, sugar: 4.7 },
  { name: "Varškė 9%", category: "Pieno produktai", calories: 159, protein: 16.7, carbs: 2, fat: 9, fiber: 0, sugar: 2 },
  { name: "Varškė 0.5% (liesa)", category: "Pieno produktai", calories: 72, protein: 12, carbs: 3.5, fat: 0.5, fiber: 0, sugar: 3.5 },
  { name: "Graikiškas jogurtas", category: "Pieno produktai", calories: 97, protein: 9, carbs: 3.6, fat: 5, fiber: 0, sugar: 3.6 },
  { name: "Natūralus jogurtas", category: "Pieno produktai", calories: 63, protein: 5, carbs: 7, fat: 1.5, fiber: 0, sugar: 7 },
  { name: "Kefyras", category: "Pieno produktai", calories: 56, protein: 3.3, carbs: 4.5, fat: 2.5, fiber: 0, sugar: 4.5 },
  { name: "Sūris Gouda", category: "Pieno produktai", calories: 356, protein: 25, carbs: 2.2, fat: 27, fiber: 0, sugar: 2.2 },
  { name: "Sūris Cheddar", category: "Pieno produktai", calories: 403, protein: 25, carbs: 1.3, fat: 33, fiber: 0, sugar: 0.5 },
  { name: "Mocarela", category: "Pieno produktai", calories: 280, protein: 28, carbs: 3.1, fat: 17, fiber: 0, sugar: 1 },
  { name: "Feta sūris", category: "Pieno produktai", calories: 264, protein: 14, carbs: 4.1, fat: 21, fiber: 0, sugar: 4.1 },
  { name: "Grietinė 20%", category: "Pieno produktai", calories: 206, protein: 2.8, carbs: 3.4, fat: 20, fiber: 0, sugar: 3.4 },
  { name: "Sviestas", category: "Pieno produktai", calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0, sugar: 0.1 },

  // === GRŪDAI / GRAINS ===
  { name: "Ryžiai (balti, virti)", category: "Grūdai", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0 },
  { name: "Ryžiai (rudi, virti)", category: "Grūdai", calories: 123, protein: 2.7, carbs: 26, fat: 1, fiber: 1.8, sugar: 0.4 },
  { name: "Avižos", category: "Grūdai", calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 11, sugar: 1 },
  { name: "Grikiai", category: "Grūdai", calories: 343, protein: 13, carbs: 72, fat: 3.4, fiber: 10, sugar: 0 },
  { name: "Makaronai (virti)", category: "Grūdai", calories: 158, protein: 6, carbs: 31, fat: 0.9, fiber: 1.8, sugar: 0.6 },
  { name: "Pilno grūdo makaronai (virti)", category: "Grūdai", calories: 148, protein: 6, carbs: 30, fat: 0.6, fiber: 4, sugar: 0.8 },
  { name: "Duona (balta)", category: "Grūdai", calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7, sugar: 5 },
  { name: "Duona (ruginė)", category: "Grūdai", calories: 259, protein: 8.5, carbs: 48, fat: 3.3, fiber: 5.8, sugar: 3.9 },
  { name: "Duona (pilno grūdo)", category: "Grūdai", calories: 247, protein: 13, carbs: 41, fat: 3.4, fiber: 7, sugar: 6 },
  { name: "Kuskusas (virtas)", category: "Grūdai", calories: 112, protein: 3.8, carbs: 23, fat: 0.2, fiber: 1.4, sugar: 0.1 },
  { name: "Bulguras (virtas)", category: "Grūdai", calories: 83, protein: 3.1, carbs: 19, fat: 0.2, fiber: 4.5, sugar: 0.1 },
  { name: "Kvietiniai miltai", category: "Grūdai", calories: 364, protein: 10, carbs: 76, fat: 1, fiber: 2.7, sugar: 0.3 },

  // === VAISIAI / FRUITS ===
  { name: "Obuolys", category: "Vaisiai", calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sugar: 10 },
  { name: "Bananas", category: "Vaisiai", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12 },
  { name: "Apelsinas", category: "Vaisiai", calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, sugar: 9.4 },
  { name: "Braškės", category: "Vaisiai", calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2, sugar: 4.9 },
  { name: "Mėlynės", category: "Vaisiai", calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4, sugar: 10 },
  { name: "Avokadas", category: "Vaisiai", calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, sugar: 0.7 },
  { name: "Mangas", category: "Vaisiai", calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, sugar: 14 },
  { name: "Vynuogės", category: "Vaisiai", calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9, sugar: 16 },
  { name: "Arbūzas", category: "Vaisiai", calories: 30, protein: 0.6, carbs: 8, fat: 0.2, fiber: 0.4, sugar: 6 },
  { name: "Ananasas", category: "Vaisiai", calories: 50, protein: 0.5, carbs: 13, fat: 0.1, fiber: 1.4, sugar: 10 },
  { name: "Kriaušė", category: "Vaisiai", calories: 57, protein: 0.4, carbs: 15, fat: 0.1, fiber: 3.1, sugar: 10 },
  { name: "Citrina", category: "Vaisiai", calories: 29, protein: 1.1, carbs: 9, fat: 0.3, fiber: 2.8, sugar: 2.5 },

  // === DARŽOVĖS / VEGETABLES ===
  { name: "Pomidorai", category: "Daržovės", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6 },
  { name: "Agurkai", category: "Daržovės", calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, sugar: 1.7 },
  { name: "Brokoliai", category: "Daržovės", calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, sugar: 1.7 },
  { name: "Morkos", category: "Daržovės", calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, sugar: 4.7 },
  { name: "Bulvės", category: "Daržovės", calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2, sugar: 0.8 },
  { name: "Saldžiosios bulvės (batatai)", category: "Daržovės", calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, sugar: 4.2 },
  { name: "Špinatai", category: "Daržovės", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4 },
  { name: "Kopūstai", category: "Daržovės", calories: 25, protein: 1.3, carbs: 6, fat: 0.1, fiber: 2.5, sugar: 3.2 },
  { name: "Žiediniai kopūstai", category: "Daržovės", calories: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2, sugar: 1.9 },
  { name: "Paprika (raudona)", category: "Daržovės", calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1, sugar: 4.2 },
  { name: "Svogūnai", category: "Daržovės", calories: 40, protein: 1.1, carbs: 9, fat: 0.1, fiber: 1.7, sugar: 4.2 },
  { name: "Česnakai", category: "Daržovės", calories: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1, sugar: 1 },
  { name: "Cukinija", category: "Daržovės", calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1, sugar: 2.5 },
  { name: "Baklažanai", category: "Daržovės", calories: 25, protein: 1, carbs: 6, fat: 0.2, fiber: 3, sugar: 3.5 },
  { name: "Žalieji žirneliai", category: "Daržovės", calories: 81, protein: 5, carbs: 14, fat: 0.4, fiber: 5, sugar: 6 },
  { name: "Kukurūzai", category: "Daržovės", calories: 86, protein: 3.3, carbs: 19, fat: 1.4, fiber: 2.7, sugar: 6.3 },
  { name: "Salotos", category: "Daržovės", calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.3, sugar: 0.8 },
  { name: "Burokėliai", category: "Daržovės", calories: 43, protein: 1.6, carbs: 10, fat: 0.2, fiber: 2.8, sugar: 7 },

  // === ANKŠTINIAI / LEGUMES ===
  { name: "Lęšiai (virti)", category: "Ankštiniai", calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8, sugar: 1.8 },
  { name: "Avinžirniai (virti)", category: "Ankštiniai", calories: 164, protein: 9, carbs: 27, fat: 2.6, fiber: 8, sugar: 4.8 },
  { name: "Raudonos pupelės (virtos)", category: "Ankštiniai", calories: 127, protein: 9, carbs: 23, fat: 0.5, fiber: 7, sugar: 0.3 },
  { name: "Soja (virta)", category: "Ankštiniai", calories: 173, protein: 17, carbs: 10, fat: 9, fiber: 6, sugar: 3 },
  { name: "Tofu", category: "Ankštiniai", calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, sugar: 0.6 },

  // === RIEŠUTAI / NUTS ===
  { name: "Migdolai", category: "Riešutai", calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 13, sugar: 4.4 },
  { name: "Graikiniai riešutai", category: "Riešutai", calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 7, sugar: 2.6 },
  { name: "Žemės riešutai", category: "Riešutai", calories: 567, protein: 26, carbs: 16, fat: 49, fiber: 9, sugar: 4 },
  { name: "Anakardžiai", category: "Riešutai", calories: 553, protein: 18, carbs: 30, fat: 44, fiber: 3, sugar: 6 },
  { name: "Pistacijos", category: "Riešutai", calories: 562, protein: 20, carbs: 28, fat: 45, fiber: 10, sugar: 8 },
  { name: "Lazdyno riešutai", category: "Riešutai", calories: 628, protein: 15, carbs: 17, fat: 61, fiber: 10, sugar: 4.3 },
  { name: "Sėmenys (linų)", category: "Riešutai", calories: 534, protein: 18, carbs: 29, fat: 42, fiber: 27, sugar: 1.6 },
  { name: "Moliūgų sėklos", category: "Riešutai", calories: 559, protein: 30, carbs: 11, fat: 49, fiber: 6, sugar: 1.4 },
  { name: "Saulėgrąžų sėklos", category: "Riešutai", calories: 584, protein: 21, carbs: 20, fat: 51, fiber: 9, sugar: 2.6 },
  { name: "Chia sėklos", category: "Riešutai", calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34, sugar: 0 },

  // === ALIEJUS / RIEBALAI ===
  { name: "Alyvuogių aliejus", category: "Aliejus ir riebalai", calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0 },
  { name: "Kokosų aliejus", category: "Aliejus ir riebalai", calories: 862, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0 },
  { name: "Saulėgrąžų aliejus", category: "Aliejus ir riebalai", calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0 },
  { name: "Žemės riešutų sviestas", category: "Aliejus ir riebalai", calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, sugar: 9 },
  { name: "Migdolų sviestas", category: "Aliejus ir riebalai", calories: 614, protein: 21, carbs: 19, fat: 56, fiber: 10, sugar: 4 },

  // === GĖRIMAI / BEVERAGES ===
  { name: "Medus", category: "Saldikliai", calories: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2, sugar: 82 },
  { name: "Cukrus (baltas)", category: "Saldikliai", calories: 387, protein: 0, carbs: 100, fat: 0, fiber: 0, sugar: 100 },
  { name: "Šokoladas (juodas 70%)", category: "Saldikliai", calories: 598, protein: 8, carbs: 46, fat: 43, fiber: 11, sugar: 24 },

  // === KITI ===
  { name: "Ryžių pyragėliai", category: "Užkandžiai", calories: 387, protein: 8, carbs: 81, fat: 2.8, fiber: 4.2, sugar: 0.3 },
  { name: "Hummusas", category: "Užkandžiai", calories: 166, protein: 8, carbs: 14, fat: 10, fiber: 6, sugar: 0.3 },
  { name: "Žemės riešutų sviestas (natūralus)", category: "Užkandžiai", calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, sugar: 9 },
];

async function main() {
  console.log("🌱 Seeding food products...");

  // Clear existing non-user-created food products
  const deleted = await prisma.foodProduct.deleteMany({
    where: { isUserCreated: false },
  });
  console.log(`✅ Cleared ${deleted.count} existing food products`);

  // Create food products
  let created = 0;
  for (const product of foodProducts) {
    await prisma.foodProduct.create({
      data: {
        name: product.name,
        category: product.category,
        calories: product.calories,
        protein: product.protein,
        carbs: product.carbs,
        fat: product.fat,
        fiber: product.fiber,
        sugar: product.sugar,
        serving: 100,
        servingUnit: "g",
        isActive: true,
        isUserCreated: false,
      },
    });
    created++;
  }

  console.log(`✅ Created ${created} food products`);
  console.log("🎉 Food products seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding food products:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
