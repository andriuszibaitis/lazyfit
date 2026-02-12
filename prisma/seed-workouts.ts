import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const exercises = [
  // Krūtinė (Chest)
  {
    name: "Štangos spaudimas gulint",
    description: "Klasikinis krūtinės pratimas su štanga ant horizontalaus suolelio.",
    muscleGroup: "chest",
    secondaryMuscleGroups: ["triceps", "shoulders"],
    equipment: "barbell",
    difficulty: "Vidutinis",
    instructions: [
      "Atsigulkite ant suolelio, pėdos ant grindų",
      "Suimkite štangą plačiau nei pečių plotis",
      "Nuleiskite štangą prie krūtinės kontroliuojamai",
      "Išspauskite štangą aukštyn iki pilno rankų ištiesimo"
    ],
    tips: ["Laikykite mentės suvesta", "Neatitraukite sėdmenų nuo suolelio"]
  },
  {
    name: "Hantelių spaudimas gulint",
    description: "Krūtinės pratimas su hantelėmis, leidžiantis didesnę judesio amplitudę.",
    muscleGroup: "chest",
    secondaryMuscleGroups: ["triceps", "shoulders"],
    equipment: "dumbbells",
    difficulty: "Vidutinis",
    instructions: [
      "Atsigulkite ant suolelio su hantelėmis rankose",
      "Nuleiskite hanteles prie krūtinės šonų",
      "Išspauskite hanteles aukštyn, suartindami jas viršuje"
    ],
    tips: ["Kontroliuokite judėjimą visą laiką", "Neužrakinkite alkūnių viršuje"]
  },
  {
    name: "Atsispaudimai",
    description: "Bazinis kūno svorio pratimas krūtinei, tricepsams ir pečiams.",
    muscleGroup: "chest",
    secondaryMuscleGroups: ["triceps", "shoulders", "core"],
    equipment: "bodyweight",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Užimkite plankos poziciją, rankos pečių plotyje",
      "Nusileiskite žemyn, kol krūtinė beveik liečia grindis",
      "Atsispauskite atgal į pradinę poziciją"
    ],
    tips: ["Laikykite kūną tiesiai", "Nekelkite sėdmenų"]
  },
  {
    name: "Kryžminiai traukimai su lynais",
    description: "Izoliuotas krūtinės pratimas su lynų aparatu.",
    muscleGroup: "chest",
    secondaryMuscleGroups: ["shoulders"],
    equipment: "cable",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Stovėkite tarp lynų aparatų",
      "Suimkite rankenas ir žingtelėkite į priekį",
      "Traukite rankenas viena link kitos prieš save",
      "Kontroliuojamai grįžkite atgal"
    ],
    tips: ["Išlaikykite lengvą alkūnių sulenkimą", "Susikoncentruokite į krūtinės susitraukimą"]
  },
  {
    name: "Spaudimas nuožulniame suole",
    description: "Viršutinės krūtinės dalies pratimas nuožulniame suole.",
    muscleGroup: "chest",
    secondaryMuscleGroups: ["triceps", "shoulders"],
    equipment: "barbell",
    difficulty: "Vidutinis",
    instructions: [
      "Atsigulkite ant nuožulnaus suolelio (30-45 laipsnių)",
      "Suimkite štangą pečių pločiu",
      "Nuleiskite štangą prie viršutinės krūtinės dalies",
      "Išspauskite aukštyn"
    ],
    tips: ["Kampas neturi būti per status", "Laikykite pėdas tvirtai ant grindų"]
  },

  // Nugara (Back)
  {
    name: "Prisitraukimai prie skersinio",
    description: "Vienas efektyviausių nugaros pratimų su kūno svoriu.",
    muscleGroup: "back",
    secondaryMuscleGroups: ["biceps", "forearms"],
    equipment: "bodyweight",
    difficulty: "Pažengusiems",
    instructions: [
      "Kabėkite ant skersinio, rankos plačiau nei pečiai",
      "Traukitės aukštyn, kol smakras viršija skersinio lygį",
      "Kontroliuojamai nusileiskite žemyn"
    ],
    tips: ["Venkite siūbavimo", "Susikoncentruokite į nugaros raumenis"]
  },
  {
    name: "Štangos irklavimas palinkus",
    description: "Sudėtinis nugaros pratimas, ugdantis storį ir jėgą.",
    muscleGroup: "back",
    secondaryMuscleGroups: ["biceps", "rear_delts"],
    equipment: "barbell",
    difficulty: "Vidutinis",
    instructions: [
      "Palinkite į priekį, nugara tiesi, keliai lengvai sulenkti",
      "Suimkite štangą pečių pločiu",
      "Traukite štangą prie pilvo apačios",
      "Nuleiskite kontroliuojamai"
    ],
    tips: ["Laikykite nugarą tiesią", "Nesinaudokite inercija"]
  },
  {
    name: "Vienos rankos irklavimas su hantele",
    description: "Vienašalis nugaros pratimas, leidžiantis susitelkti į kiekvieną pusę atskirai.",
    muscleGroup: "back",
    secondaryMuscleGroups: ["biceps", "rear_delts"],
    equipment: "dumbbells",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Atremkite vieną ranką ir kelį į suolelį",
      "Kita ranka laikykite hantelę",
      "Traukite hantelę prie šono",
      "Kontroliuojamai nuleiskite"
    ],
    tips: ["Laikykite nugarą lygiagrečiai grindims", "Nesukinėkite liemens"]
  },
  {
    name: "Nugaros traukimai viršutiniu bloku",
    description: "Aparatinis nugaros pratimas, imituojantis prisitraukimus.",
    muscleGroup: "back",
    secondaryMuscleGroups: ["biceps"],
    equipment: "cable",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Sėskite į aparatą, kojos po atrama",
      "Suimkite plačią rankeną",
      "Traukite prie viršutinės krūtinės dalies",
      "Kontroliuojamai grąžinkite atgal"
    ],
    tips: ["Pasilenkite šiek tiek atgal", "Susikoncentruokite į mentės suvedimą"]
  },
  {
    name: "Mirties trauka",
    description: "Fundamentalus jėgos pratimas, apkraunantis visą kūną.",
    muscleGroup: "back",
    secondaryMuscleGroups: ["glutes", "hamstrings", "core", "forearms"],
    equipment: "barbell",
    difficulty: "Pažengusiems",
    instructions: [
      "Stovėkite prie štangos, pėdos klubų plotyje",
      "Palinkite ir suimkite štangą",
      "Kelkite štangą, tiesindami kojas ir nugarą vienu metu",
      "Viršuje spauskite sėdmenis",
      "Kontroliuojamai nuleiskite"
    ],
    tips: ["Nugara visada turi būti tiesi", "Štanga turi likti arti kūno"]
  },

  // Kojos (Legs)
  {
    name: "Pritūpimai su štanga",
    description: "Karalius tarp kojų pratimų - apkrauna keturgalvius, sėdmenis ir šlaunų užpakalines.",
    muscleGroup: "legs",
    secondaryMuscleGroups: ["glutes", "core"],
    equipment: "barbell",
    difficulty: "Vidutinis",
    instructions: [
      "Padėkite štangą ant viršutinės nugaros",
      "Kojos pečių plotyje arba šiek tiek plačiau",
      "Pritūpkite, kol šlaunys bus lygiagrečios grindims",
      "Atsistokite, spausdami per kulnus"
    ],
    tips: ["Keliai eina pirštų kryptimi", "Laikykite krūtinę pakeltą"]
  },
  {
    name: "Kojų spaudimas aparatu",
    description: "Saugus kojų pratimas, leidžiantis naudoti didelius svorius.",
    muscleGroup: "legs",
    secondaryMuscleGroups: ["glutes"],
    equipment: "machine",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Atsisėskite į aparatą, pėdos ant platformos",
      "Atlaisvinkite saugiklius",
      "Nuleiskite platformą, kol keliai bus 90 laipsnių",
      "Išspauskite platformą atgal"
    ],
    tips: ["Neužrakinkite kelių viršuje", "Laikykite apatinę nugarą prispaudę"]
  },
  {
    name: "Rumunų mirties trauka",
    description: "Šlaunų užpakalinių ir sėdmenų pratimas su štanga.",
    muscleGroup: "hamstrings",
    secondaryMuscleGroups: ["glutes", "back"],
    equipment: "barbell",
    difficulty: "Vidutinis",
    instructions: [
      "Laikykite štangą prieš save, rankos tiesios",
      "Palinkite į priekį, stumdami klubus atgal",
      "Nuleiskite štangą iki blauzdų vidurio",
      "Grįžkite į pradinę padėtį"
    ],
    tips: ["Keliai lieka šiek tiek sulenkti", "Jauskite tempimą šlaunų užpakalinėse"]
  },
  {
    name: "Išpuoliai su hantelėmis",
    description: "Funkcionalus kojų pratimas, lavinantis pusiausvyrą.",
    muscleGroup: "legs",
    secondaryMuscleGroups: ["glutes", "core"],
    equipment: "dumbbells",
    difficulty: "Vidutinis",
    instructions: [
      "Laikykite hanteles šonuose",
      "Ženkite plačiai į priekį",
      "Nusileiskite, kol užpakalinės kojos kelis beveik liečia grindis",
      "Atsispauskite atgal į pradinę padėtį"
    ],
    tips: ["Liemuo lieka vertikalus", "Priekinis kelis neturi peržengti pirštų"]
  },
  {
    name: "Blauzdų kilnojimas stovint",
    description: "Blauzdų raumenų pratimas.",
    muscleGroup: "calves",
    secondaryMuscleGroups: [],
    equipment: "machine",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Stovėkite ant platformos krašto, kulnai nuleisti",
      "Kilstelėkite ant pirštų galiukų",
      "Laikykite viršuje 1-2 sekundes",
      "Kontroliuojamai nusileiskite"
    ],
    tips: ["Pilna judesio amplitudė", "Neskubėkite"]
  },
  {
    name: "Bulgarų pritūpimai",
    description: "Vienašalis kojų pratimas su užpakaline koja ant suolelio.",
    muscleGroup: "legs",
    secondaryMuscleGroups: ["glutes", "core"],
    equipment: "dumbbells",
    difficulty: "Pažengusiems",
    instructions: [
      "Padėkite užpakalinės kojos padą ant suolelio",
      "Laikykite hanteles šonuose",
      "Pritūpkite ant priekinės kojos",
      "Atsistokite, spausdami per kulną"
    ],
    tips: ["Liemuo vertikalus", "Kontroliuokite pusiausvyrą"]
  },

  // Pečiai (Shoulders)
  {
    name: "Štangos spaudimas sėdint",
    description: "Pagrindinis pečių jėgos pratimas.",
    muscleGroup: "shoulders",
    secondaryMuscleGroups: ["triceps"],
    equipment: "barbell",
    difficulty: "Vidutinis",
    instructions: [
      "Sėdėkite su atrama nugarai",
      "Suimkite štangą pečių pločiu",
      "Išspauskite štangą virš galvos",
      "Kontroliuojamai nuleiskite iki smakro lygio"
    ],
    tips: ["Nelinkite nugaros", "Laikykite šerdį įtemptą"]
  },
  {
    name: "Hantelių kėlimas į šonus",
    description: "Izoliuotas pratimas šoniniams deltams.",
    muscleGroup: "shoulders",
    secondaryMuscleGroups: [],
    equipment: "dumbbells",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Stovėkite su hantelėmis šonuose",
      "Kelkite hanteles į šonus iki pečių lygio",
      "Trumpai palaikykite viršuje",
      "Kontroliuojamai nuleiskite"
    ],
    tips: ["Alkūnės šiek tiek sulenktos", "Nesinaudokite inercija"]
  },
  {
    name: "Hantelių kėlimas į priekį",
    description: "Priekinių deltų pratimas.",
    muscleGroup: "shoulders",
    secondaryMuscleGroups: ["chest"],
    equipment: "dumbbells",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Laikykite hanteles prieš šlaunis",
      "Kelkite vieną hantelę į priekį iki pečių lygio",
      "Nuleiskite ir pakartokite su kita ranka"
    ],
    tips: ["Kontroliuokite judėjimą", "Nekelkite per aukštai"]
  },
  {
    name: "Užpakalinių deltų skrydžiai",
    description: "Užpakalinių pečių dalių pratimas.",
    muscleGroup: "shoulders",
    secondaryMuscleGroups: ["back"],
    equipment: "dumbbells",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Palinkite į priekį, nugara tiesi",
      "Laikykite hanteles po savimi",
      "Kelkite hanteles į šonus, spauskite mentės",
      "Kontroliuojamai nuleiskite"
    ],
    tips: ["Dėmesys užpakaliniams deltams", "Nekelkite liemens"]
  },
  {
    name: "Arnoldo spaudimas",
    description: "Pečių pratimas su rotacija, pavadintas Arnold Schwarzenegger garbei.",
    muscleGroup: "shoulders",
    secondaryMuscleGroups: ["triceps"],
    equipment: "dumbbells",
    difficulty: "Vidutinis",
    instructions: [
      "Sėdėkite su hantelėmis prie pečių, delnai į save",
      "Spauskite hanteles aukštyn, sukdami delnus nuo savęs",
      "Viršuje delnai žiūri į priekį",
      "Grįžkite atgal su atvirkštine rotacija"
    ],
    tips: ["Sklandus, kontroliuojamas judėjimas", "Pilna rotacijos amplitudė"]
  },

  // Rankos - Bicepsai (Arms - Biceps)
  {
    name: "Štangos lenkimas bicepsui",
    description: "Klasikinis bicepso masės pratimas.",
    muscleGroup: "biceps",
    secondaryMuscleGroups: ["forearms"],
    equipment: "barbell",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Stovėkite su štanga, rankos pečių plotyje",
      "Lenkite štangą aukštyn, laikydami alkūnes vietoje",
      "Spauskite bicepsą viršuje",
      "Kontroliuojamai nuleiskite"
    ],
    tips: ["Nesiūbuokite kūnu", "Alkūnės lieka prie šonų"]
  },
  {
    name: "Hantelių lenkimas sėdint",
    description: "Bicepso pratimas su hantelėmis ant nuožulnaus suolelio.",
    muscleGroup: "biceps",
    secondaryMuscleGroups: ["forearms"],
    equipment: "dumbbells",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Sėdėkite ant nuožulnaus suolelio, rankos nuleistos",
      "Lenkite hanteles aukštyn pakaitomis",
      "Spauskite bicepsą kiekvieno pakartojimo viršuje"
    ],
    tips: ["Pilnas ištiesimas apačioje", "Kontroliuotas tempas"]
  },
  {
    name: "Kūjo lenkimai",
    description: "Bicepso ir dilbio pratimas su neutraliu gripu.",
    muscleGroup: "biceps",
    secondaryMuscleGroups: ["forearms"],
    equipment: "dumbbells",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Laikykite hanteles šonuose, delnai į kūną",
      "Lenkite hanteles, išlaikydami neutralų gripą",
      "Nuleiskite kontroliuojamai"
    ],
    tips: ["Delnai lieka nukreipti į kūną", "Puikus dilbiams"]
  },
  {
    name: "Koncentruoti lenkimai",
    description: "Izoliuotas bicepso pratimas maksimaliam susitraukimui.",
    muscleGroup: "biceps",
    secondaryMuscleGroups: [],
    equipment: "dumbbells",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Sėdėkite, alkūnė remiasi į vidinę šlaunies pusę",
      "Lenkite hantelę aukštyn",
      "Stipriai suspauskite bicepsą viršuje",
      "Lėtai nuleiskite"
    ],
    tips: ["Susikoncentruokite į raumenį", "Neskubėkite"]
  },

  // Rankos - Tricepsai (Arms - Triceps)
  {
    name: "Prancūziška štanga gulint",
    description: "Efektyvus tricepso pratimas su štanga.",
    muscleGroup: "triceps",
    secondaryMuscleGroups: [],
    equipment: "barbell",
    difficulty: "Vidutinis",
    instructions: [
      "Atsigulkite ant suolelio, laikykite štangą virš krūtinės",
      "Lenkite alkūnes, nuleisdami štangą link kaktos",
      "Ištieskite rankas atgal į pradinę padėtį"
    ],
    tips: ["Alkūnės lieka vietoje", "Kontroliuokite svorį"]
  },
  {
    name: "Tricepso spaudimai su lynu",
    description: "Aparatinis tricepso izoliavimo pratimas.",
    muscleGroup: "triceps",
    secondaryMuscleGroups: [],
    equipment: "cable",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Stovėkite prie viršutinio bloko",
      "Suimkite V formos rankeną",
      "Spauskite žemyn, tiesdami alkūnes",
      "Kontroliuojamai grįžkite"
    ],
    tips: ["Alkūnės priglautos prie šonų", "Susikoncentruokite į susitraukimą"]
  },
  {
    name: "Atsispaudimai ant suolelio",
    description: "Tricepso pratimas su kūno svoriu.",
    muscleGroup: "triceps",
    secondaryMuscleGroups: ["chest", "shoulders"],
    equipment: "bodyweight",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Atremkite rankas į suolelį už savęs",
      "Kojos ištiestos arba sulenktos",
      "Nusileiskite, lenkdami alkūnes",
      "Atsispauskite atgal aukštyn"
    ],
    tips: ["Nesileidžkite per žemai", "Alkūnės eina atgal, ne į šonus"]
  },
  {
    name: "Vienos rankos tricepso pratęsimas",
    description: "Vienašalis tricepso izoliavimo pratimas.",
    muscleGroup: "triceps",
    secondaryMuscleGroups: [],
    equipment: "dumbbells",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Laikykite hantelę virš galvos, ranka tiesi",
      "Lenkite alkūnę, nuleisdami hantelę už galvos",
      "Ištieskite ranką atgal aukštyn"
    ],
    tips: ["Laikykite alkūnę vietoje", "Kontroliuokite judėjimą"]
  },

  // Pilvas (Core/Abs)
  {
    name: "Pilno amplitudės sėdimai",
    description: "Klasikinis pilvo pratimas.",
    muscleGroup: "core",
    secondaryMuscleGroups: [],
    equipment: "bodyweight",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Atsigulkite ant nugaros, keliai sulenkti",
      "Rankos už galvos arba ant krūtinės",
      "Kelkite liemenį nuo grindų",
      "Kontroliuojamai nusileiskite"
    ],
    tips: ["Netraukite galvos rankomis", "Kvėpuokite tolygiai"]
  },
  {
    name: "Planka",
    description: "Statinis šerdies stiprinimo pratimas.",
    muscleGroup: "core",
    secondaryMuscleGroups: ["shoulders"],
    equipment: "bodyweight",
    difficulty: "Pradedantiesiems",
    instructions: [
      "Užimkite poziciją ant dilbių ir kojų pirštų",
      "Kūnas turi būti tiesi linija",
      "Laikykite padėtį nurodytą laiką"
    ],
    tips: ["Nekelkite ir nenuleiskite klubų", "Kvėpuokite normaliai"]
  },
  {
    name: "Kabančio kėlimas kojų",
    description: "Pažangus apatinių pilvo raumenų pratimas.",
    muscleGroup: "core",
    secondaryMuscleGroups: ["hip_flexors"],
    equipment: "bodyweight",
    difficulty: "Pažengusiems",
    instructions: [
      "Kabėkite ant skersinio",
      "Kelkite tiesiai kojas iki horizontalios padėties",
      "Kontroliuojamai nuleiskite"
    ],
    tips: ["Venkite siūbavimo", "Gali sulenkti kelius pradžioje"]
  },
  {
    name: "Rusų sukimai",
    description: "Įstrižų pilvo raumenų pratimas su sukimusi.",
    muscleGroup: "core",
    secondaryMuscleGroups: [],
    equipment: "bodyweight",
    difficulty: "Vidutinis",
    instructions: [
      "Sėdėkite ant grindų, keliai sulenkti, pėdos pakelta",
      "Pasviręs atgal, liemuo 45 laipsnių kampu",
      "Sukite liemenį iš šono į šoną",
      "Galite laikyti svorį papildomam pasipriešinimui"
    ],
    tips: ["Kontroliuotas sukimasis", "Laikykite nugarą tiesią"]
  },
  {
    name: "Dviračio pilvukai",
    description: "Dinamiškas pilvo pratimas su kojų judėjimu.",
    muscleGroup: "core",
    secondaryMuscleGroups: [],
    equipment: "bodyweight",
    difficulty: "Vidutinis",
    instructions: [
      "Atsigulkite ant nugaros, rankos už galvos",
      "Kelkite vieną kelį ir priešingą alkūnę vienas link kito",
      "Keiskite puses nuolatiniu judesiu"
    ],
    tips: ["Netraukite kaklo", "Kontroliuokite tempą"]
  }
];

const workouts = [
  // Pjaustymo treniruotės (Push/Pull/Legs)
  {
    name: "Push diena - Krūtinė, Pečiai, Tricepsai",
    description: "Stumimo raumenų treniruotė: krūtinė, pečiai ir tricepsai. Tinka PPL programai.",
    duration: 60,
    difficulty: "Vidutinis",
    targetMuscleGroups: ["chest", "shoulders", "triceps"],
    equipment: ["barbell", "dumbbells", "cable"],
    exercises: [
      { name: "Štangos spaudimas gulint", sets: 4, reps: "8-10", restTime: 120 },
      { name: "Spaudimas nuožulniame suole", sets: 3, reps: "10-12", restTime: 90 },
      { name: "Hantelių kėlimas į šonus", sets: 3, reps: "12-15", restTime: 60 },
      { name: "Štangos spaudimas sėdint", sets: 3, reps: "8-10", restTime: 90 },
      { name: "Kryžminiai traukimai su lynais", sets: 3, reps: "12-15", restTime: 60 },
      { name: "Tricepso spaudimai su lynu", sets: 3, reps: "12-15", restTime: 60 },
      { name: "Vienos rankos tricepso pratęsimas", sets: 2, reps: "12-15", restTime: 60 }
    ]
  },
  {
    name: "Pull diena - Nugara, Bicepsai",
    description: "Traukimo raumenų treniruotė: nugara ir bicepsai. Tinka PPL programai.",
    duration: 60,
    difficulty: "Vidutinis",
    targetMuscleGroups: ["back", "biceps"],
    equipment: ["barbell", "dumbbells", "cable", "bodyweight"],
    exercises: [
      { name: "Mirties trauka", sets: 4, reps: "6-8", restTime: 180 },
      { name: "Prisitraukimai prie skersinio", sets: 3, reps: "max", restTime: 120 },
      { name: "Štangos irklavimas palinkus", sets: 3, reps: "8-10", restTime: 90 },
      { name: "Nugaros traukimai viršutiniu bloku", sets: 3, reps: "10-12", restTime: 90 },
      { name: "Vienos rankos irklavimas su hantele", sets: 3, reps: "10-12", restTime: 60 },
      { name: "Štangos lenkimas bicepsui", sets: 3, reps: "10-12", restTime: 60 },
      { name: "Kūjo lenkimai", sets: 3, reps: "12-15", restTime: 60 }
    ]
  },
  {
    name: "Legs diena - Kojos",
    description: "Pilna kojų treniruotė: keturgalviai, šlaunų užpakaliniai, sėdmenys ir blauzdos.",
    duration: 70,
    difficulty: "Pažengusiems",
    targetMuscleGroups: ["legs", "glutes", "hamstrings", "calves"],
    equipment: ["barbell", "dumbbells", "machine"],
    exercises: [
      { name: "Pritūpimai su štanga", sets: 4, reps: "8-10", restTime: 180 },
      { name: "Rumunų mirties trauka", sets: 4, reps: "10-12", restTime: 120 },
      { name: "Kojų spaudimas aparatu", sets: 3, reps: "12-15", restTime: 90 },
      { name: "Bulgarų pritūpimai", sets: 3, reps: "10-12", restTime: 90 },
      { name: "Išpuoliai su hantelėmis", sets: 3, reps: "12", restTime: 60 },
      { name: "Blauzdų kilnojimas stovint", sets: 4, reps: "15-20", restTime: 60 }
    ]
  },

  // Full Body treniruotės
  {
    name: "Full Body A",
    description: "Pilno kūno treniruotė su akcentu ant stambiųjų raumenų grupių. Tinka pradedantiesiems.",
    duration: 50,
    difficulty: "Pradedantiesiems",
    targetMuscleGroups: ["chest", "back", "legs", "shoulders", "core"],
    equipment: ["barbell", "dumbbells", "bodyweight"],
    exercises: [
      { name: "Pritūpimai su štanga", sets: 3, reps: "10-12", restTime: 120 },
      { name: "Štangos spaudimas gulint", sets: 3, reps: "10-12", restTime: 90 },
      { name: "Štangos irklavimas palinkus", sets: 3, reps: "10-12", restTime: 90 },
      { name: "Hantelių kėlimas į šonus", sets: 3, reps: "12-15", restTime: 60 },
      { name: "Planka", sets: 3, reps: "45 sek", restTime: 60 }
    ]
  },
  {
    name: "Full Body B",
    description: "Pilno kūno treniruotė su skirtingais pratimais nei Full Body A.",
    duration: 50,
    difficulty: "Pradedantiesiems",
    targetMuscleGroups: ["chest", "back", "legs", "shoulders", "arms"],
    equipment: ["barbell", "dumbbells", "bodyweight"],
    exercises: [
      { name: "Mirties trauka", sets: 3, reps: "8-10", restTime: 120 },
      { name: "Hantelių spaudimas gulint", sets: 3, reps: "10-12", restTime: 90 },
      { name: "Išpuoliai su hantelėmis", sets: 3, reps: "10", restTime: 90 },
      { name: "Hantelių kėlimas į priekį", sets: 3, reps: "12-15", restTime: 60 },
      { name: "Štangos lenkimas bicepsui", sets: 3, reps: "12-15", restTime: 60 },
      { name: "Tricepso spaudimai su lynu", sets: 3, reps: "12-15", restTime: 60 }
    ]
  },

  // Upper/Lower Split
  {
    name: "Upper Body - Viršutinė kūno dalis",
    description: "Visa viršutinė kūno dalis: krūtinė, nugara, pečiai, rankos.",
    duration: 60,
    difficulty: "Vidutinis",
    targetMuscleGroups: ["chest", "back", "shoulders", "biceps", "triceps"],
    equipment: ["barbell", "dumbbells", "cable", "bodyweight"],
    exercises: [
      { name: "Štangos spaudimas gulint", sets: 4, reps: "8-10", restTime: 120 },
      { name: "Prisitraukimai prie skersinio", sets: 3, reps: "max", restTime: 120 },
      { name: "Štangos spaudimas sėdint", sets: 3, reps: "10-12", restTime: 90 },
      { name: "Vienos rankos irklavimas su hantele", sets: 3, reps: "10-12", restTime: 60 },
      { name: "Hantelių kėlimas į šonus", sets: 3, reps: "12-15", restTime: 60 },
      { name: "Štangos lenkimas bicepsui", sets: 2, reps: "12-15", restTime: 60 },
      { name: "Prancūziška štanga gulint", sets: 2, reps: "12-15", restTime: 60 }
    ]
  },
  {
    name: "Lower Body - Apatinė kūno dalis",
    description: "Pilna kojų treniruotė su šerdies pratimu.",
    duration: 55,
    difficulty: "Vidutinis",
    targetMuscleGroups: ["legs", "glutes", "hamstrings", "calves", "core"],
    equipment: ["barbell", "dumbbells", "machine", "bodyweight"],
    exercises: [
      { name: "Pritūpimai su štanga", sets: 4, reps: "8-10", restTime: 150 },
      { name: "Rumunų mirties trauka", sets: 3, reps: "10-12", restTime: 120 },
      { name: "Kojų spaudimas aparatu", sets: 3, reps: "12-15", restTime: 90 },
      { name: "Išpuoliai su hantelėmis", sets: 3, reps: "10", restTime: 60 },
      { name: "Blauzdų kilnojimas stovint", sets: 4, reps: "15-20", restTime: 45 },
      { name: "Kabančio kėlimas kojų", sets: 3, reps: "12-15", restTime: 60 }
    ]
  },

  // Specialios treniruotės
  {
    name: "Rankų diena - Bicepsai ir Tricepsai",
    description: "Koncentruota rankų treniruotė didesnei apimčiai.",
    duration: 45,
    difficulty: "Pradedantiesiems",
    targetMuscleGroups: ["biceps", "triceps", "forearms"],
    equipment: ["barbell", "dumbbells", "cable", "bodyweight"],
    exercises: [
      { name: "Štangos lenkimas bicepsui", sets: 4, reps: "10-12", restTime: 90 },
      { name: "Prancūziška štanga gulint", sets: 4, reps: "10-12", restTime: 90 },
      { name: "Hantelių lenkimas sėdint", sets: 3, reps: "12-15", restTime: 60 },
      { name: "Tricepso spaudimai su lynu", sets: 3, reps: "12-15", restTime: 60 },
      { name: "Kūjo lenkimai", sets: 3, reps: "12-15", restTime: 60 },
      { name: "Atsispaudimai ant suolelio", sets: 3, reps: "max", restTime: 60 },
      { name: "Koncentruoti lenkimai", sets: 2, reps: "15", restTime: 45 }
    ]
  },
  {
    name: "Pečių specialistė",
    description: "Detalus pečių treniravimas iš visų kampų.",
    duration: 40,
    difficulty: "Vidutinis",
    targetMuscleGroups: ["shoulders"],
    equipment: ["barbell", "dumbbells", "cable"],
    exercises: [
      { name: "Štangos spaudimas sėdint", sets: 4, reps: "8-10", restTime: 120 },
      { name: "Arnoldo spaudimas", sets: 3, reps: "10-12", restTime: 90 },
      { name: "Hantelių kėlimas į šonus", sets: 4, reps: "12-15", restTime: 60 },
      { name: "Hantelių kėlimas į priekį", sets: 3, reps: "12-15", restTime: 60 },
      { name: "Užpakalinių deltų skrydžiai", sets: 4, reps: "15-20", restTime: 60 }
    ]
  },
  {
    name: "Core ir pilvas",
    description: "Stiprus pilvas ir šerdis - pagrindas visam kūnui.",
    duration: 30,
    difficulty: "Vidutinis",
    targetMuscleGroups: ["core"],
    equipment: ["bodyweight"],
    exercises: [
      { name: "Planka", sets: 3, reps: "60 sek", restTime: 60 },
      { name: "Pilno amplitudės sėdimai", sets: 3, reps: "20", restTime: 45 },
      { name: "Dviračio pilvukai", sets: 3, reps: "30", restTime: 45 },
      { name: "Rusų sukimai", sets: 3, reps: "20", restTime: 45 },
      { name: "Kabančio kėlimas kojų", sets: 3, reps: "12-15", restTime: 60 }
    ]
  },
  {
    name: "Namuose be įrangos",
    description: "Efektyvi treniruotė namuose naudojant tik kūno svorį.",
    duration: 35,
    difficulty: "Pradedantiesiems",
    targetMuscleGroups: ["chest", "back", "legs", "core"],
    equipment: ["bodyweight"],
    exercises: [
      { name: "Atsispaudimai", sets: 4, reps: "15-20", restTime: 60 },
      { name: "Prisitraukimai prie skersinio", sets: 3, reps: "max", restTime: 90 },
      { name: "Bulgarų pritūpimai", sets: 3, reps: "12", restTime: 60 },
      { name: "Atsispaudimai ant suolelio", sets: 3, reps: "15-20", restTime: 60 },
      { name: "Planka", sets: 3, reps: "45 sek", restTime: 45 },
      { name: "Dviračio pilvukai", sets: 3, reps: "20", restTime: 45 }
    ]
  },
  {
    name: "Jėgos pagrindai",
    description: "Treniruotė fokusuota į didžiuosius kėlimus jėgos augimui.",
    duration: 75,
    difficulty: "Pažengusiems",
    targetMuscleGroups: ["back", "legs", "chest"],
    equipment: ["barbell"],
    exercises: [
      { name: "Pritūpimai su štanga", sets: 5, reps: "5", restTime: 180 },
      { name: "Štangos spaudimas gulint", sets: 5, reps: "5", restTime: 180 },
      { name: "Mirties trauka", sets: 5, reps: "5", restTime: 180 },
      { name: "Štangos irklavimas palinkus", sets: 3, reps: "8", restTime: 120 },
      { name: "Štangos spaudimas sėdint", sets: 3, reps: "8", restTime: 120 }
    ]
  },

  // Hipertrofijos treniruotės
  {
    name: "Krūtinės hipertrofija",
    description: "Aukštos apimties krūtinės treniruotė raumenų augimui.",
    duration: 50,
    difficulty: "Vidutinis",
    targetMuscleGroups: ["chest", "triceps"],
    equipment: ["barbell", "dumbbells", "cable", "bodyweight"],
    exercises: [
      { name: "Štangos spaudimas gulint", sets: 4, reps: "8-12", restTime: 90 },
      { name: "Spaudimas nuožulniame suole", sets: 4, reps: "10-12", restTime: 90 },
      { name: "Hantelių spaudimas gulint", sets: 3, reps: "12-15", restTime: 60 },
      { name: "Kryžminiai traukimai su lynais", sets: 3, reps: "15-20", restTime: 60 },
      { name: "Atsispaudimai", sets: 3, reps: "max", restTime: 60 }
    ]
  },
  {
    name: "Nugaros hipertrofija",
    description: "Detalus nugaros treniravimas storiui ir plotiui.",
    duration: 55,
    difficulty: "Vidutinis",
    targetMuscleGroups: ["back", "biceps"],
    equipment: ["barbell", "dumbbells", "cable", "bodyweight"],
    exercises: [
      { name: "Prisitraukimai prie skersinio", sets: 4, reps: "max", restTime: 120 },
      { name: "Štangos irklavimas palinkus", sets: 4, reps: "10-12", restTime: 90 },
      { name: "Nugaros traukimai viršutiniu bloku", sets: 4, reps: "12-15", restTime: 60 },
      { name: "Vienos rankos irklavimas su hantele", sets: 3, reps: "12-15", restTime: 60 },
      { name: "Užpakalinių deltų skrydžiai", sets: 3, reps: "15-20", restTime: 45 }
    ]
  }
];

async function main() {
  console.log("🏋️ Pradedamas treniruočių duomenų įkėlimas...\n");

  // Sukuriame pratimus
  console.log("📝 Kuriami pratimai...");
  const createdExercises: Map<string, string> = new Map();

  for (const exercise of exercises) {
    const existingExercise = await prisma.exercise.findFirst({
      where: { name: exercise.name }
    });

    if (existingExercise) {
      createdExercises.set(exercise.name, existingExercise.id);
      console.log(`  ⏭️  Pratimas jau egzistuoja: ${exercise.name}`);
    } else {
      const created = await prisma.exercise.create({
        data: {
          name: exercise.name,
          description: exercise.description,
          muscleGroup: exercise.muscleGroup,
          secondaryMuscleGroups: exercise.secondaryMuscleGroups,
          equipment: exercise.equipment,
          difficulty: exercise.difficulty,
          instructions: exercise.instructions,
          tips: exercise.tips,
          isPublished: true
        }
      });
      createdExercises.set(exercise.name, created.id);
      console.log(`  ✅ Sukurtas pratimas: ${exercise.name}`);
    }
  }

  console.log(`\n✅ Sukurta/rasta pratimų: ${createdExercises.size}\n`);

  // Sukuriame treniruotes
  console.log("🏋️ Kuriamos treniruotės...");
  let workoutsCreated = 0;

  for (const workout of workouts) {
    const existingWorkout = await prisma.workout.findFirst({
      where: { name: workout.name }
    });

    if (existingWorkout) {
      console.log(`  ⏭️  Treniruotė jau egzistuoja: ${workout.name}`);
      continue;
    }

    const createdWorkout = await prisma.workout.create({
      data: {
        name: workout.name,
        description: workout.description,
        duration: workout.duration,
        difficulty: workout.difficulty,
        targetMuscleGroups: workout.targetMuscleGroups,
        equipment: workout.equipment,
        isPublished: true
      }
    });

    // Pridedame pratimus prie treniruotės
    for (let i = 0; i < workout.exercises.length; i++) {
      const exerciseData = workout.exercises[i];
      const exerciseId = createdExercises.get(exerciseData.name);

      if (exerciseId) {
        await prisma.workoutExercise.create({
          data: {
            workoutId: createdWorkout.id,
            exerciseId: exerciseId,
            order: i + 1,
            sets: exerciseData.sets,
            reps: exerciseData.reps,
            restTime: exerciseData.restTime
          }
        });
      } else {
        console.log(`    ⚠️  Nerastas pratimas: ${exerciseData.name}`);
      }
    }

    workoutsCreated++;
    console.log(`  ✅ Sukurta treniruotė: ${workout.name} (${workout.exercises.length} pratimai)`);
  }

  console.log(`\n🎉 Baigta! Sukurta naujų treniruočių: ${workoutsCreated}`);
  console.log(`📊 Viso pratimų duomenų bazėje: ${createdExercises.size}`);
}

main()
  .catch((e) => {
    console.error("❌ Klaida:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
