import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const achievements = [
  {
    code: "first_steps",
    title: "Pirmi žingsniai",
    description: "Užsiregistravote LazyFit platformoje ir pradėjote savo kelionę!",
    trigger: "registration",
    triggerValue: 1,
    order: 1,
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  },
  {
    code: "first_measurement",
    title: "Kūno žemėlapis",
    description: "Pirmą kartą užfiksavote savo kūno matmenis. Puikus pradžios taškas!",
    trigger: "first_measurement",
    triggerValue: 1,
    order: 2,
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>',
  },
  {
    code: "first_photo",
    title: "Veidrodžio herojus",
    description: "Įkėlėte pirmą progreso nuotrauką. Nuotraukos – geriausias progreso įrodymas!",
    trigger: "first_photo",
    triggerValue: 1,
    order: 3,
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  },
  {
    code: "nutrition_starter",
    title: "Mitybos pradininkas",
    description: "Sukūrėte savo pirmą asmeninį mitybos planą. Sveikas maistas – sveika ateitis!",
    trigger: "first_nutrition_plan",
    triggerValue: 1,
    order: 4,
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
  },
  {
    code: "meal_tracker_7",
    title: "Savaitės sekėjas",
    description: "Sekėte savo mitybą 7 dienas iš eilės. Nuoseklumas yra raktas!",
    trigger: "meal_tracking_streak",
    triggerValue: 7,
    order: 5,
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  },
  {
    code: "meal_tracker_30",
    title: "Mėnesio disciplina",
    description: "30 dienų mitybos sekimas! Jūs tikras disciplinos meistras!",
    trigger: "meal_tracking_streak",
    triggerValue: 30,
    order: 6,
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
  },
  {
    code: "weight_goal",
    title: "Svorio tikslas",
    description: "Pasiekėte savo svorio tikslą! Didžiulis pasiekimas!",
    trigger: "weight_goal_reached",
    triggerValue: 1,
    order: 7,
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C5.33 4 6 4.67 6 5.5V9z"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C18.67 4 18 4.67 18 5.5V9z"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>',
  },
  {
    code: "course_completer",
    title: "Žinių troškimas",
    description: "Baigėte pirmą edukacinį kursą. Žinios – jėga!",
    trigger: "first_course_completed",
    triggerValue: 1,
    order: 8,
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  },
];

async function main() {
  console.log("🌱 Seeding achievements...");

  for (const achievement of achievements) {
    const existing = await prisma.achievement.findUnique({
      where: { code: achievement.code },
    });

    if (existing) {
      await prisma.achievement.update({
        where: { code: achievement.code },
        data: achievement,
      });
      console.log(`✅ Updated achievement: ${achievement.title}`);
    } else {
      await prisma.achievement.create({
        data: achievement,
      });
      console.log(`✅ Created achievement: ${achievement.title}`);
    }
  }

  console.log("🎉 Achievements seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding achievements:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
