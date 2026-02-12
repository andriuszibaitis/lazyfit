import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const additionalExercises = [
  // Daugiau krūtinės pratimų
  {
    name: "Hantelių skrydžiai",
    description: "Izoliuotas krūtinės pratimas su hantelėmis ant horizontalaus suolelio.",
    muscleGroup: "chest",
    secondaryMuscleGroups: ["shoulders"],
    equipment: "dumbbells",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Atsigulkite ant suolelio su hantelėmis virš krūtinės",
      "Rankos beveik tiesios, alkūnės šiek tiek sulenktos",
      "Nuleiskite hanteles į šonus lanku",
      "Grąžinkite hanteles į pradinę padėtį"
    ],
    tips: ["Nejudinkite alkūnių kampo", "Kontroliuokite svorį"]
  },
  {
    name: "Spaudimas ant nuožulnaus suolelio žemyn",
    description: "Apatinės krūtinės dalies pratimas ant suolelio, nukreipto žemyn.",
    muscleGroup: "chest",
    secondaryMuscleGroups: ["triceps", "shoulders"],
    equipment: "barbell",
    difficulty: "Vidutinis",
    instructions: [
      "Atsigulkite ant suolelio, nukreipto žemyn (15-30 laipsnių)",
      "Kojos užfiksuotos po atrama",
      "Spauskite štangą nuo apatinės krūtinės dalies"
    ],
    tips: ["Nekelkite galvos", "Prašykite draugo padėti paduoti štangą"]
  },

  // Daugiau nugaros pratimų
  {
    name: "T-bar irklavimas",
    description: "Efektyvus nugaros storio pratimas su T-bar aparatu.",
    muscleGroup: "back",
    secondaryMuscleGroups: ["biceps", "rear_delts"],
    equipment: "machine",
    difficulty: "Vidutinis",
    instructions: [
      "Stovėkite virš T-bar su kojomis abipus",
      "Pasilenkite į priekį, nugara tiesi",
      "Traukite svorį prie krūtinės",
      "Kontroliuojamai nuleiskite"
    ],
    tips: ["Laikykite nugarą neutralioje padėtyje", "Susikoncentruokite į mentės suvedimą"]
  },
  {
    name: "Apatinio bloko traukimai prie pilvo",
    description: "Aparatinis nugaros pratimas sėdint.",
    muscleGroup: "back",
    secondaryMuscleGroups: ["biceps"],
    equipment: "cable",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Sėskite į aparatą, kojos ant atramos",
      "Suimkite V formos rankeną",
      "Traukite rankeną prie pilvo",
      "Kontroliuojamai grąžinkite"
    ],
    tips: ["Laikykite nugarą tiesią", "Nesiūbuokite kūnu"]
  },
  {
    name: "Hiperextension (nugaros tiesimas)",
    description: "Apatinės nugaros ir sėdmenų stiprinimo pratimas.",
    muscleGroup: "back",
    secondaryMuscleGroups: ["glutes", "hamstrings"],
    equipment: "machine",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Užimkite padėtį hiperextension suole",
      "Klubai ant atramos, kojos užfiksuotos",
      "Nusileiskite kontroliuojamai žemyn",
      "Kilkite iki kūnas sudaro tiesią liniją"
    ],
    tips: ["Nekelkite per aukštai", "Galite laikyti svorį prie krūtinės"]
  },

  // Daugiau kojų pratimų
  {
    name: "Hack pritūpimai",
    description: "Kojų pratimas su hack squat aparatu.",
    muscleGroup: "legs",
    secondaryMuscleGroups: ["glutes"],
    equipment: "machine",
    difficulty: "Vidutinis",
    instructions: [
      "Atsistokite į hack squat aparatą",
      "Nugara priremta prie atramos",
      "Pritūpkite iki šlaunys lygiagrečios grindims",
      "Atsistokite spausdami per kulnus"
    ],
    tips: ["Neužrakinkite kelių viršuje", "Kontroliuokite judėjimą"]
  },
  {
    name: "Kojų tiesimas aparatu",
    description: "Izoliuotas keturgalvių pratimas.",
    muscleGroup: "legs",
    secondaryMuscleGroups: [],
    equipment: "machine",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Atsisėskite į aparatą, kojos po atrama",
      "Tieskite kojas iki pilno išsitiesimo",
      "Laikykite trumpai viršuje",
      "Kontroliuojamai nuleiskite"
    ],
    tips: ["Nejudinkite klubų", "Netrenkite svorio apačioje"]
  },
  {
    name: "Kojų lenkimas gulint",
    description: "Izoliuotas šlaunų užpakalinių pratimas.",
    muscleGroup: "hamstrings",
    secondaryMuscleGroups: [],
    equipment: "machine",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Atsigulkite ant aparato veidu žemyn",
      "Kojos po atrama, virš kulnų",
      "Lenkite kojas link sėdmenų",
      "Kontroliuojamai nuleiskite"
    ],
    tips: ["Nelenkite nugaros", "Pilna judesio amplitudė"]
  },
  {
    name: "Sumo mirties trauka",
    description: "Mirties traukos variacija su plačiu kojų pastatymu.",
    muscleGroup: "legs",
    secondaryMuscleGroups: ["back", "glutes", "hamstrings"],
    equipment: "barbell",
    difficulty: "Vidutinis",
    instructions: [
      "Stovėkite plačiai, pėdos 45 laipsnių kampu",
      "Suimkite štangą siauriu gripu tarp kojų",
      "Kelkite štangą, tiesdami kojas ir nugarą",
      "Viršuje spauskite sėdmenis"
    ],
    tips: ["Keliai eina pirštų kryptimi", "Laikykite krūtinę aukštai"]
  },
  {
    name: "Goblet pritūpimai",
    description: "Pritūpimų variacija su hantele prie krūtinės.",
    muscleGroup: "legs",
    secondaryMuscleGroups: ["glutes", "core"],
    equipment: "dumbbells",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Laikykite hantelę prie krūtinės už galvutės",
      "Kojos pečių pločiu arba šiek tiek plačiau",
      "Pritūpkite giliai, alkūnės tarp kelių",
      "Atsistokite spausdami per kulnus"
    ],
    tips: ["Puikus pradedantiesiems", "Padeda išlaikyti tiesią nugarą"]
  },

  // Daugiau pečių pratimų
  {
    name: "Stovintis pečių spaudimas su štanga",
    description: "Klasikinis pečių jėgos pratimas stovint.",
    muscleGroup: "shoulders",
    secondaryMuscleGroups: ["triceps", "core"],
    equipment: "barbell",
    difficulty: "Vidutinis",
    instructions: [
      "Stovėkite su štanga ant priekinių pečių",
      "Kojos klubų plotyje",
      "Spauskite štangą virš galvos",
      "Nuleiskite kontroliuojamai atgal"
    ],
    tips: ["Įtempkite šerdį", "Nelinkite nugaros"]
  },
  {
    name: "Pečių traukimai (Shrugs)",
    description: "Trapecijų stiprinimo pratimas.",
    muscleGroup: "shoulders",
    secondaryMuscleGroups: ["traps"],
    equipment: "dumbbells",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Stovėkite su hantelėmis šonuose",
      "Kelkite pečius link ausų",
      "Laikykite trumpai viršuje",
      "Kontroliuojamai nuleiskite"
    ],
    tips: ["Nesukite pečių", "Laikykite rankas tiesiai"]
  },
  {
    name: "Face pulls",
    description: "Užpakalinių deltų ir rotatorių pratimas su lynu.",
    muscleGroup: "shoulders",
    secondaryMuscleGroups: ["back", "rear_delts"],
    equipment: "cable",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Stovėkite prie viršutinio bloko su virvės rankena",
      "Traukite virvę link veido",
      "Atskirkite rankas ties veidu",
      "Kontroliuojamai grąžinkite"
    ],
    tips: ["Alkūnės aukštai", "Puikus pečių sveikatai"]
  },

  // Daugiau rankų pratimų
  {
    name: "Preacher curl (Scott curl)",
    description: "Bicepso pratimas ant specialaus suolelio.",
    muscleGroup: "biceps",
    secondaryMuscleGroups: [],
    equipment: "barbell",
    difficulty: "Vidutinis",
    instructions: [
      "Atsisėskite prie preacher suolelio",
      "Rankos ant atramos, štanga rankose",
      "Lenkite štangą aukštyn",
      "Kontroliuojamai nuleiskite"
    ],
    tips: ["Pilnas ištiesimas apačioje", "Neskubėkite"]
  },
  {
    name: "Tricepso atkėlimas už galvos su lynu",
    description: "Tricepso pratimas su lynu, stovint nugara į aparatą.",
    muscleGroup: "triceps",
    secondaryMuscleGroups: [],
    equipment: "cable",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Stovėkite nugara į viršutinį bloką",
      "Suimkite virvę už galvos",
      "Tieskite rankas į priekį ir aukštyn",
      "Kontroliuojamai grąžinkite"
    ],
    tips: ["Alkūnės lieka vietoje", "Jauskite tricepso tempimą"]
  },
  {
    name: "Close-grip spaudimas",
    description: "Štangos spaudimas siauru gripu tricepsams.",
    muscleGroup: "triceps",
    secondaryMuscleGroups: ["chest", "shoulders"],
    equipment: "barbell",
    difficulty: "Vidutinis",
    instructions: [
      "Atsigulkite ant suolelio, gripas siauresnis nei pečiai",
      "Nuleiskite štangą prie apatinės krūtinės dalies",
      "Alkūnės eina arti kūno",
      "Išspauskite aukštyn"
    ],
    tips: ["Rankos arčiau nei pečių plotis", "Puikus tricepsams"]
  },
  {
    name: "Riešo lenkimai",
    description: "Dilbių priekinės dalies pratimas.",
    muscleGroup: "forearms",
    secondaryMuscleGroups: [],
    equipment: "barbell",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Sėdėkite, dilbiai ant šlaunų, riešai už kelių",
      "Laikykite štangą, delnai į viršų",
      "Lenkite riešus aukštyn",
      "Nuleiskite kontroliuojamai"
    ],
    tips: ["Tik riešai juda", "Lengvas svoris, daug pakartojimų"]
  },

  // Daugiau pilvo pratimų
  {
    name: "Ab wheel rollout",
    description: "Pažangus pilvo pratimas su rateliu.",
    muscleGroup: "core",
    secondaryMuscleGroups: ["shoulders", "back"],
    equipment: "other",
    difficulty: "Pažengusiems",
    instructions: [
      "Klūpėkite ant grindų, rankos ant ratelio",
      "Riedėkite į priekį, tiesdami kūną",
      "Išlaikykite įtemptą pilvo sriti",
      "Grįžkite į pradinę padėtį"
    ],
    tips: ["Pradėkite nuo trumpos amplitudės", "Nelinkite nugaros"]
  },
  {
    name: "Dead bug",
    description: "Pilvo ir koordinacijos pratimas gulint ant nugaros.",
    muscleGroup: "core",
    secondaryMuscleGroups: [],
    equipment: "bodyweight",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Atsigulkite ant nugaros, rankos ištiestos aukštyn",
      "Kojos sulenktos 90 laipsnių",
      "Tieskite priešingą ranką ir koją",
      "Grįžkite ir kartokite su kita puse"
    ],
    tips: ["Nugara visą laiką priglausta prie grindų", "Lėtas, kontroliuotas judesys"]
  },
  {
    name: "Šoninė planka",
    description: "Įstrižų pilvo raumenų statinis pratimas.",
    muscleGroup: "core",
    secondaryMuscleGroups: ["obliques"],
    equipment: "bodyweight",
    difficulty: "Vidutinis",
    instructions: [
      "Gulėkite ant šono, atremti į dilbį",
      "Kelkite klubus nuo grindų",
      "Kūnas sudaro tiesią liniją",
      "Laikykite nurodytą laiką"
    ],
    tips: ["Nekelkite ir nenuleiskite klubų", "Kvėpuokite tolygiai"]
  },
  {
    name: "Alpinistas (Mountain climbers)",
    description: "Dinamiškas pilvo ir kardio pratimas.",
    muscleGroup: "core",
    secondaryMuscleGroups: ["shoulders", "hip_flexors"],
    equipment: "bodyweight",
    difficulty: "Vidutinis",
    instructions: [
      "Užimkite plankos poziciją",
      "Traukite vieną kelį prie krūtinės",
      "Greitai keiskite kojas",
      "Laikykite klubus žemai"
    ],
    tips: ["Rankos po pečiais", "Galite reguliuoti greitį"]
  },

  // Funkcionalūs pratimai
  {
    name: "Farmer's walk",
    description: "Funkcionalus jėgos pratimas nešant sunkius svorius.",
    muscleGroup: "core",
    secondaryMuscleGroups: ["forearms", "traps", "legs"],
    equipment: "dumbbells",
    difficulty: "Vidutinis",
    instructions: [
      "Paimkite sunkias hanteles į abi rankas",
      "Stovėkite tiesiai, pečiai atgal",
      "Eikite kontroliuotai nurodytą atstumą",
      "Laikykite šerdį įtemptą"
    ],
    tips: ["Žvelkite į priekį", "Trumpi, greiti žingsniai"]
  },
  {
    name: "Kettlebell swing",
    description: "Dinamiškas visą kūną apkraunantis pratimas su girele.",
    muscleGroup: "glutes",
    secondaryMuscleGroups: ["hamstrings", "core", "shoulders"],
    equipment: "kettlebell",
    difficulty: "Vidutinis",
    instructions: [
      "Stovėkite su girele tarp kojų",
      "Palinkite į priekį, stumdami klubus atgal",
      "Tiesinkite klubus, siūbuodami girelę aukštyn",
      "Leiskite girelei grįžti tarp kojų"
    ],
    tips: ["Jėga iš klubų, ne iš rankų", "Nelinkite nugaros"]
  },
  {
    name: "Box jump",
    description: "Pliometrinis sprogstamosios jėgos pratimas.",
    muscleGroup: "legs",
    secondaryMuscleGroups: ["glutes", "core"],
    equipment: "other",
    difficulty: "Vidutinis",
    instructions: [
      "Stovėkite prieš stabilią dėžę",
      "Pritūpkite ir šokite ant dėžės",
      "Nušokite kontroliuojamai žemyn",
      "Iškart kartokite arba pilnai atsistokite"
    ],
    tips: ["Pradėkite nuo žemesnės dėžės", "Minkštas nusileidimas"]
  },
  {
    name: "Burpees",
    description: "Intensyvus visą kūną apkraunantis kardio pratimas.",
    muscleGroup: "core",
    secondaryMuscleGroups: ["chest", "legs", "shoulders"],
    equipment: "bodyweight",
    difficulty: "Pažengusiems",
    instructions: [
      "Iš stovimos padėties nusileiskite į pritūpimą",
      "Iššokite kojas atgal į plankos poziciją",
      "Atlikite atsispaudimą",
      "Grįžkite į pritūpimą ir iššokite aukštyn"
    ],
    tips: ["Modifikuokite pagal savo lygį", "Kontroliuokite tempą"]
  },
];

async function main() {
  console.log("💪 Pridedami papildomi pratimai...\n");

  let created = 0;
  let skipped = 0;

  for (const exercise of additionalExercises) {
    const existing = await prisma.exercise.findFirst({
      where: { name: exercise.name },
    });

    if (existing) {
      console.log(`⏭️  Jau egzistuoja: ${exercise.name}`);
      skipped++;
      continue;
    }

    await prisma.exercise.create({
      data: {
        name: exercise.name,
        description: exercise.description,
        muscleGroup: exercise.muscleGroup,
        secondaryMuscleGroups: exercise.secondaryMuscleGroups,
        equipment: exercise.equipment,
        difficulty: exercise.difficulty,
        instructions: exercise.instructions,
        tips: exercise.tips,
        isPublished: true,
      },
    });

    console.log(`✅ Sukurtas: ${exercise.name}`);
    created++;
  }

  const totalExercises = await prisma.exercise.count();

  console.log(`\n🎉 Baigta!`);
  console.log(`   Nauji pratimai: ${created}`);
  console.log(`   Praleisti: ${skipped}`);
  console.log(`   Viso pratimų DB: ${totalExercises}`);
}

main()
  .catch((e) => {
    console.error("❌ Klaida:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
