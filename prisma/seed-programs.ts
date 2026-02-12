import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const trainingPrograms = [
  {
    name: "Pradedančiųjų programa - 8 savaitės",
    description: "Ideali programa tiems, kurie tik pradeda savo sporto kelionę. Per 8 savaites išmoksite pagrindinius pratimus, sustiprėsite ir paruošite kūną intensyvesnėms treniruotėms.",
    difficulty: "Pradedantiesiems",
    duration: 8, // savaitės
    gender: "all",
    goal: "Pradėti sportuoti",
    periods: [
      {
        name: "Adaptacijos fazė",
        description: "Kūno paruošimas fiziniams krūviams, technikos mokymasis",
        startWeek: 1,
        endWeek: 4,
        workoutPattern: ["Full Body A", "Full Body B"], // pakaitomis
        daysPerWeek: 3,
      },
      {
        name: "Progreso fazė",
        description: "Intensyvumo didinimas, naujų pratimų įvedimas",
        startWeek: 5,
        endWeek: 8,
        workoutPattern: ["Full Body A", "Full Body B", "Core ir pilvas"],
        daysPerWeek: 3,
      },
    ],
  },
  {
    name: "Push/Pull/Legs programa - 12 savaičių",
    description: "Klasikinė PPL programa raumenų masei auginti. Treniruotės 6 kartus per savaitę su optimaliu poilsiu kiekvienai raumenų grupei.",
    difficulty: "Vidutinis",
    duration: 12,
    gender: "all",
    goal: "Raumenų masė",
    periods: [
      {
        name: "1 fazė - Pagrindų kūrimas",
        description: "Technikos tobulinimas ir jėgos bazės kūrimas",
        startWeek: 1,
        endWeek: 4,
        workoutPattern: [
          "Push diena - Krūtinė, Pečiai, Tricepsai",
          "Pull diena - Nugara, Bicepsai",
          "Legs diena - Kojos",
        ],
        daysPerWeek: 6, // du ratai per savaitę
      },
      {
        name: "2 fazė - Intensyvumo didinimas",
        description: "Svorių didinimas, apimties augimas",
        startWeek: 5,
        endWeek: 8,
        workoutPattern: [
          "Push diena - Krūtinė, Pečiai, Tricepsai",
          "Pull diena - Nugara, Bicepsai",
          "Legs diena - Kojos",
        ],
        daysPerWeek: 6,
      },
      {
        name: "3 fazė - Peakas",
        description: "Maksimalus intensyvumas prieš deload savaitę",
        startWeek: 9,
        endWeek: 12,
        workoutPattern: [
          "Push diena - Krūtinė, Pečiai, Tricepsai",
          "Pull diena - Nugara, Bicepsai",
          "Legs diena - Kojos",
        ],
        daysPerWeek: 6,
      },
    ],
  },
  {
    name: "Upper/Lower Split - 8 savaitės",
    description: "Efektyvi programa tiems, kas gali sportuoti 4 kartus per savaitę. Puikus balansas tarp apimties ir atsigavimo.",
    difficulty: "Vidutinis",
    duration: 8,
    gender: "all",
    goal: "Jėga ir masė",
    periods: [
      {
        name: "Jėgos fazė",
        description: "Fokusuojamės į pagrindinius kėlimus ir jėgos augimą",
        startWeek: 1,
        endWeek: 4,
        workoutPattern: [
          "Upper Body - Viršutinė kūno dalis",
          "Lower Body - Apatinė kūno dalis",
        ],
        daysPerWeek: 4,
      },
      {
        name: "Hipertrofijos fazė",
        description: "Didesnis pakartojimų skaičius raumenų augimui",
        startWeek: 5,
        endWeek: 8,
        workoutPattern: [
          "Upper Body - Viršutinė kūno dalis",
          "Lower Body - Apatinė kūno dalis",
          "Krūtinės hipertrofija",
          "Nugaros hipertrofija",
        ],
        daysPerWeek: 4,
      },
    ],
  },
  {
    name: "Namų treniruočių programa - 6 savaitės",
    description: "Programa tiems, kurie neturi galimybės lankyti sporto salės. Visos treniruotės atliekamos namuose be specialios įrangos.",
    difficulty: "Pradedantiesiems",
    duration: 6,
    gender: "all",
    goal: "Forma namuose",
    periods: [
      {
        name: "Pradžia",
        description: "Įpratimas prie reguliarių treniruočių",
        startWeek: 1,
        endWeek: 3,
        workoutPattern: ["Namuose be įrangos", "Core ir pilvas"],
        daysPerWeek: 3,
      },
      {
        name: "Progresas",
        description: "Intensyvumo didinimas",
        startWeek: 4,
        endWeek: 6,
        workoutPattern: ["Namuose be įrangos", "Core ir pilvas"],
        daysPerWeek: 4,
      },
    ],
  },
  {
    name: "Jėgos programa - 12 savaičių",
    description: "Programa skirta maksimalios jėgos ugdymui. Fokusuojamasi į pagrindinius kėlimus: pritūpimus, spaudimą ir mirties trauką.",
    difficulty: "Pažengusiems",
    duration: 12,
    gender: "all",
    goal: "Maksimali jėga",
    periods: [
      {
        name: "Akumuliacijos fazė",
        description: "Apimties kaupimas, technikos tobulinimas",
        startWeek: 1,
        endWeek: 4,
        workoutPattern: ["Jėgos pagrindai", "Full Body A"],
        daysPerWeek: 4,
      },
      {
        name: "Transmutacijos fazė",
        description: "Perėjimas prie didesnių svorių",
        startWeek: 5,
        endWeek: 8,
        workoutPattern: ["Jėgos pagrindai"],
        daysPerWeek: 4,
      },
      {
        name: "Realizacijos fazė",
        description: "Maksimalių rezultatų siekimas",
        startWeek: 9,
        endWeek: 12,
        workoutPattern: ["Jėgos pagrindai"],
        daysPerWeek: 3,
      },
    ],
  },
  {
    name: "Moterų programa - Formos kūrimas",
    description: "8 savaičių programa moterims, skirta kūno formos gerinimui, sėdmenų ir kojų stiprinimui bei bendram tonusui.",
    difficulty: "Vidutinis",
    duration: 8,
    gender: "female",
    goal: "Kūno forma",
    periods: [
      {
        name: "Bazės kūrimas",
        description: "Technikos mokymasis ir kūno paruošimas",
        startWeek: 1,
        endWeek: 4,
        workoutPattern: [
          "Lower Body - Apatinė kūno dalis",
          "Upper Body - Viršutinė kūno dalis",
          "Core ir pilvas",
        ],
        daysPerWeek: 4,
      },
      {
        name: "Intensyvi fazė",
        description: "Fokusuotas darbas su problemų zonomis",
        startWeek: 5,
        endWeek: 8,
        workoutPattern: [
          "Legs diena - Kojos",
          "Upper Body - Viršutinė kūno dalis",
          "Lower Body - Apatinė kūno dalis",
          "Core ir pilvas",
        ],
        daysPerWeek: 4,
      },
    ],
  },
  {
    name: "Vyrų masės programa",
    description: "10 savaičių programa vyrams, skirta raumenų masės auginimui ir jėgos didinimui.",
    difficulty: "Vidutinis",
    duration: 10,
    gender: "male",
    goal: "Raumenų masė",
    periods: [
      {
        name: "Paruošiamoji fazė",
        description: "Kūno paruošimas intensyviam darbui",
        startWeek: 1,
        endWeek: 2,
        workoutPattern: ["Full Body A", "Full Body B"],
        daysPerWeek: 4,
      },
      {
        name: "Masės fazė",
        description: "Intensyvus darbas raumenų augimui",
        startWeek: 3,
        endWeek: 8,
        workoutPattern: [
          "Push diena - Krūtinė, Pečiai, Tricepsai",
          "Pull diena - Nugara, Bicepsai",
          "Legs diena - Kojos",
          "Rankų diena - Bicepsai ir Tricepsai",
          "Pečių specialistė",
        ],
        daysPerWeek: 5,
      },
      {
        name: "Finišo fazė",
        description: "Rezultatų įtvirtinimas",
        startWeek: 9,
        endWeek: 10,
        workoutPattern: [
          "Krūtinės hipertrofija",
          "Nugaros hipertrofija",
          "Legs diena - Kojos",
        ],
        daysPerWeek: 5,
      },
    ],
  },
];

async function main() {
  console.log("🏃 Pradedamas treniruočių programų įkėlimas...\n");

  // Gauti visas esamas treniruotes
  const workouts = await prisma.workout.findMany({
    where: { isPublished: true },
    select: { id: true, name: true },
  });

  const workoutMap = new Map(workouts.map((w) => [w.name, w.id]));
  console.log(`📋 Rastos ${workouts.length} treniruotės\n`);

  let programsCreated = 0;

  for (const program of trainingPrograms) {
    // Tikrinti ar programa jau egzistuoja
    const existingProgram = await prisma.trainingProgram.findFirst({
      where: { name: program.name },
    });

    if (existingProgram) {
      console.log(`⏭️  Programa jau egzistuoja: ${program.name}`);
      continue;
    }

    // Sukurti programą
    const createdProgram = await prisma.trainingProgram.create({
      data: {
        name: program.name,
        description: program.description,
        difficulty: program.difficulty,
        duration: program.duration,
        gender: program.gender,
        goal: program.goal,
        isPublished: true,
      },
    });

    console.log(`✅ Sukurta programa: ${program.name}`);

    // Sukurti periodus
    for (let periodIndex = 0; periodIndex < program.periods.length; periodIndex++) {
      const periodData = program.periods[periodIndex];

      const createdPeriod = await prisma.programPeriod.create({
        data: {
          programId: createdProgram.id,
          name: periodData.name,
          description: periodData.description,
          startWeek: periodData.startWeek,
          endWeek: periodData.endWeek,
          order: periodIndex + 1,
        },
      });

      console.log(`   📅 Sukurtas periodas: ${periodData.name}`);

      // Sukurti savaites ir priskirti treniruotes
      for (let week = periodData.startWeek; week <= periodData.endWeek; week++) {
        const createdWeek = await prisma.periodWeek.create({
          data: {
            periodId: createdPeriod.id,
            weekNumber: week,
          },
        });

        // Priskirti treniruotes dienoms
        const workoutsPerWeek = periodData.workoutPattern;
        let dayNumber = 1;

        // Jei 6 dienos per savaitę (PPL), kartojame pattern du kartus
        const repetitions = periodData.daysPerWeek > workoutsPerWeek.length
          ? Math.ceil(periodData.daysPerWeek / workoutsPerWeek.length)
          : 1;

        for (let rep = 0; rep < repetitions && dayNumber <= periodData.daysPerWeek; rep++) {
          for (const workoutName of workoutsPerWeek) {
            if (dayNumber > periodData.daysPerWeek) break;

            const workoutId = workoutMap.get(workoutName);
            if (workoutId) {
              try {
                await prisma.programWorkout.create({
                  data: {
                    programId: createdProgram.id,
                    workoutId: workoutId,
                    periodId: createdPeriod.id,
                    weekId: createdWeek.id,
                    weekNumber: week,
                    dayNumber: dayNumber,
                    order: dayNumber,
                  },
                });
                dayNumber++;
              } catch (error) {
                // Jei jau egzistuoja, praleisti
                console.log(`      ⚠️  Treniruotė jau priskirta: ${workoutName} (savaitė ${week}, diena ${dayNumber})`);
                dayNumber++;
              }
            } else {
              console.log(`      ⚠️  Nerasta treniruotė: ${workoutName}`);
              dayNumber++;
            }
          }
        }
      }
    }

    programsCreated++;
  }

  console.log(`\n🎉 Baigta! Sukurta naujų programų: ${programsCreated}`);
}

main()
  .catch((e) => {
    console.error("❌ Klaida:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
