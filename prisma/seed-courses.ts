// @ts-nocheck
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const courses = [
  {
    title: "Sporto pagrindai pradedantiesiems",
    description: "Išmokite taisyklingos pratimų technikos ir sukurkite tvirtą pagrindą savo treniruočių kelionei.",
    about: "Šis kursas skirtas tiems, kurie tik pradeda savo sporto kelionę. Sužinosite apie pagrindinius pratimų principus, taisyklingą techniką ir kaip išvengti traumų.",
    targetAudience: "Pradedantieji, kurie nori pradėti sportuoti saugiai ir efektyviai.",
    whatYouLearn: JSON.stringify(["Taisyklinga pratimų technika", "Apšilimo ir atšilimo svarba", "Treniruočių planavimas", "Progreso sekimas"]),
    whatIsIncluded: JSON.stringify(["5 video pamokos", "Treniruočių planas", "PDF vadovas"]),
    gender: "all",
    difficulty: "beginner",
    isPublished: true,
    order: 1,
    lessons: [
      { title: "Įvadas į sportą", type: "text", content: "<h2>Sveiki atvykę!</h2><p>Šioje pamokoje sužinosite, kodėl reguliarus fizinis aktyvumas yra svarbus jūsų sveikatai ir gerovei.</p><h3>Pagrindiniai sporto privalumai:</h3><ul><li>Gerina širdies ir kraujagyslių sveikatą</li><li>Stiprina raumenis ir kaulus</li><li>Mažina stresą ir gerina nuotaiką</li><li>Padeda kontroliuoti svorį</li><li>Gerina miego kokybę</li></ul><p>Pradėkite nuo mažų žingsnių ir palaipsniui didinkite krūvį.</p>", duration: 10 },
      { title: "Apšilimas ir atšilimas", type: "text", content: "<h2>Kodėl apšilimas svarbus?</h2><p>Apšilimas paruošia jūsų kūną fiziniam krūviui:</p><ul><li>Padidina raumenų temperatūrą</li><li>Pagerina sąnarių mobilumą</li><li>Sumažina traumų riziką</li><li>Paruošia širdies ir kraujagyslių sistemą</li></ul><h3>Apšilimo pavyzdys (5-10 min):</h3><ol><li>Lengvas bėgimas vietoje - 2 min</li><li>Rankų sukimai - 1 min</li><li>Kojų švytuoklė - 1 min</li><li>Liemens sukimai - 1 min</li><li>Dinaminiai tempimo pratimai - 2-3 min</li></ol>", duration: 15 },
      { title: "Pagrindiniai pratimai su savo svoriu", type: "text", content: "<h2>Pratimai be įrangos</h2><p>Šie pratimai puikiai tinka pradedantiesiems ir gali būti atliekami bet kur:</p><h3>1. Pritūpimai (Squats)</h3><p>Stovėkite kojomis pečių plotyje, pritūpkite lyg sėstumėte ant kėdės. Keliai neturi išlįsti už kojų pirštų.</p><h3>2. Atsispaudimai (Push-ups)</h3><p>Pradėkite nuo atsispaudimų nuo kelių, jei standartiniai per sunkūs.</p><h3>3. Planka</h3><p>Laikykite kūną tiesia linija, pradėkite nuo 15-30 sekundžių.</p><h3>4. Išpuoliai (Lunges)</h3><p>Ženkite į priekį ir pritūpkite, kol abu keliai sudarys 90 laipsnių kampą.</p>", duration: 20 },
      { title: "Treniruočių planavimas", type: "text", content: "<h2>Kaip planuoti treniruotes?</h2><h3>Pradedantiesiems rekomenduojama:</h3><ul><li>3 treniruotės per savaitę</li><li>Poilsio dienos tarp treniruočių</li><li>30-45 minučių trukmė</li><li>Mažas-vidutinis intensyvumas</li></ul><h3>Savaitės plano pavyzdys:</h3><table><tr><th>Pirmadienis</th><td>Viršutinė kūno dalis</td></tr><tr><th>Antradienis</th><td>Poilsis / lengvas pasivaikščiojimas</td></tr><tr><th>Trečiadienis</th><td>Apatinė kūno dalis</td></tr><tr><th>Ketvirtadienis</th><td>Poilsis</td></tr><tr><th>Penktadienis</th><td>Viso kūno treniruotė</td></tr><tr><th>Šeštadienis-Sekmadienis</th><td>Aktyvus poilsis</td></tr></table>", duration: 15 },
      { title: "Progreso sekimas ir motyvacija", type: "text", content: "<h2>Kaip sekti progresą?</h2><p>Progreso sekimas padeda išlaikyti motyvaciją ir matyti savo tobulėjimą.</p><h3>Ką sekti:</h3><ul><li><strong>Kūno matmenys</strong> - matuokite kas 2-4 savaites</li><li><strong>Svoris</strong> - sverktės tuo pačiu metu, tą pačią savaitės dieną</li><li><strong>Nuotraukos</strong> - darykite progreso nuotraukas kas mėnesį</li><li><strong>Treniruočių užrašai</strong> - fiksuokite svorius, pakartojimus, serijas</li></ul><h3>Motyvacijos patarimai:</h3><ol><li>Išsikelkite konkrečius, pasiekiamus tikslus</li><li>Raskite treniruočių partnerį</li><li>Apdovanokite save už pasiekimus</li><li>Nesulyginkite savęs su kitais</li></ol>", duration: 10 },
    ],
  },
  {
    title: "Meditacija ir atsipalaidavimas",
    description: "Išmokite meditacijos ir kvėpavimo technikos streso mažinimui bei geresniam miegui.",
    about: "Šis kursas padės jums atrasti vidinę ramybę ir išmokti valdyti stresą per meditacijos ir kvėpavimo praktikas.",
    targetAudience: "Visi, kurie nori sumažinti stresą ir pagerinti savo emocinę sveikatą.",
    whatYouLearn: JSON.stringify(["Meditacijos pagrindai", "Kvėpavimo technikos", "Streso valdymas", "Geresnis miegas"]),
    whatIsIncluded: JSON.stringify(["4 pamokos", "Meditacijos vadovas", "Kvėpavimo pratimai"]),
    gender: "all",
    difficulty: "beginner",
    isPublished: true,
    order: 2,
    lessons: [
      { title: "Meditacijos pagrindai", type: "text", content: "<h2>Kas yra meditacija?</h2><p>Meditacija – tai proto treniruotė, padedanti susikoncentruoti, sumažinti stresą ir padidinti savimonę.</p><h3>Kaip pradėti:</h3><ol><li>Raskite ramią vietą</li><li>Sėskite patogiai</li><li>Užmerkite akis</li><li>Sutelkite dėmesį į kvėpavimą</li><li>Pradėkite nuo 5 minučių</li></ol><p>Nesijaudinkite, jei mintys klaidžioja – tai normalu. Tiesiog grįžkite prie kvėpavimo.</p>", duration: 15 },
      { title: "Kvėpavimo technikos", type: "text", content: "<h2>Kvėpavimo pratimai streso mažinimui</h2><h3>1. 4-7-8 technika</h3><p>Įkvėpkite per nosį skaičiuodami iki 4, sulaikykite kvėpavimą skaičiuodami iki 7, iškvepiite per burną skaičiuodami iki 8.</p><h3>2. Dėžės kvėpavimas (Box Breathing)</h3><p>Įkvėpkite 4 sek → Sulaikykite 4 sek → Iškvepiite 4 sek → Sulaikykite 4 sek. Kartokite 4-6 kartus.</p><h3>3. Pilvo kvėpavimas</h3><p>Dėkite ranką ant pilvo. Įkvėpdami jauskite kaip pilvas kyla, iškvepdami – kaip leidžiasi.</p>", duration: 20 },
      { title: "Streso valdymo strategijos", type: "text", content: "<h2>Streso valdymas kasdienybėje</h2><h3>Fizinės technikos:</h3><ul><li>Reguliarus fizinis aktyvumas</li><li>Progresinė raumenų relaksacija</li><li>Joga ir tampymas</li></ul><h3>Psichologinės technikos:</h3><ul><li>Sąmoningumo praktika</li><li>Dienoraščio rašymas</li><li>Teigiami tvirtinimai</li><li>Laiko planavimas</li></ul>", duration: 15 },
      { title: "Geresnio miego praktikos", type: "text", content: "<h2>Miego higiena ir relaksacija</h2><h3>Vakaro rutina:</h3><ol><li>Atsisakykite ekranų 1 val. prieš miegą</li><li>Atlikite 10 min. meditaciją</li><li>Išgerkite žolelių arbatos</li><li>Parašykite rytojaus planą</li></ol><h3>Miego aplinka:</h3><ul><li>Tamsa – naudokite užuolaidas</li><li>Vėsa – 18-20°C</li><li>Tyla – arba baltas triukšmas</li><li>Patogumas – geras čiužinys ir pagalvė</li></ul>", duration: 15 },
    ],
  },
  {
    title: "Mitybos ABC",
    description: "Sužinokite viską apie subalansuotą mitybą, makroelementus ir kaip sudaryti tinkamą valgiaraštį.",
    about: "Praktinis kursas apie mitybos pagrindus – nuo makroelementų iki valgiaraščio sudarymo ir maisto produktų pasirinkimo.",
    targetAudience: "Visi, norintys geriau suprasti mitybą ir maitintis sveikiau.",
    whatYouLearn: JSON.stringify(["Makroelementai ir mikroelementai", "Kalorijų skaičiavimas", "Valgiaraščio sudarymas", "Maisto produktų pasirinkimas"]),
    whatIsIncluded: JSON.stringify(["5 pamokos", "Mitybos vadovas", "Valgiaraščio šablonai"]),
    gender: "all",
    difficulty: "beginner",
    isPublished: true,
    order: 3,
    lessons: [
      { title: "Makroelementai: baltymai, angliavandeniai, riebalai", type: "text", content: "<h2>Trys pagrindiniai makroelementai</h2><h3>Baltymai (4 kcal/g)</h3><p>Reikalingi raumenų augimui ir atstatymui. Šaltiniai: mėsa, žuvis, kiaušiniai, pieno produktai, ankštiniai.</p><h3>Angliavandeniai (4 kcal/g)</h3><p>Pagrindiniai energijos šaltiniai. Šaltiniai: grūdai, vaisiai, daržovės, duona, ryžiai.</p><h3>Riebalai (9 kcal/g)</h3><p>Svarbūs hormonų gamybai ir vitaminų pasisavinimui. Šaltiniai: alyvuogių aliejus, riešutai, avokadai, žuvis.</p><h3>Rekomenduojami santykiai:</h3><ul><li>Baltymai: 25-35% kalorijų</li><li>Angliavandeniai: 40-55% kalorijų</li><li>Riebalai: 20-35% kalorijų</li></ul>", duration: 20 },
      { title: "Kalorijų skaičiavimas ir energijos balansas", type: "text", content: "<h2>Energijos balansas</h2><p>Svorio pokyčiai priklauso nuo energijos balanso:</p><ul><li><strong>Kalorijos < TDEE</strong> = svorio metimas</li><li><strong>Kalorijos = TDEE</strong> = svorio palaikymas</li><li><strong>Kalorijos > TDEE</strong> = svorio augimas</li></ul><h3>BMR skaičiavimas (Mifflin-St Jeor):</h3><p><strong>Vyrams:</strong> 10 × svoris(kg) + 6.25 × ūgis(cm) - 5 × amžius - 5</p><p><strong>Moterims:</strong> 10 × svoris(kg) + 6.25 × ūgis(cm) - 5 × amžius - 161</p>", duration: 20 },
      { title: "Valgiaraščio sudarymas", type: "text", content: "<h2>Kaip sudaryti valgiaraštį?</h2><h3>5 žingsniai:</h3><ol><li><strong>Apskaičiuokite kalorijų poreikį</strong></li><li><strong>Paskirstykite makroelementus</strong></li><li><strong>Suplanuokite valgymo kartus</strong> (3-5 per dieną)</li><li><strong>Pasirinkite produktus</strong> kiekvienam valgiui</li><li><strong>Paruoškite iš anksto</strong> (meal prep)</li></ol><h3>Patarimai:</h3><ul><li>Valgykite įvairiai</li><li>Rinkitės neperdirbrtus produktus</li><li>Gerkite pakankamai vandens (2-3 litrai)</li><li>Planuokite savaitę į priekį</li></ul>", duration: 25 },
      { title: "Sveikas maisto produktų pasirinkimas", type: "text", content: "<h2>Ką valgyti?</h2><h3>Puikūs baltymų šaltiniai:</h3><ul><li>Vištienos krūtinėlė, kalakutiena</li><li>Lašiša, tuna, menkė</li><li>Kiaušiniai</li><li>Graikiškas jogurtas, varškė</li><li>Lęšiai, avinžirniai</li></ul><h3>Geriausi angliavandenių šaltiniai:</h3><ul><li>Avižos, grikiai</li><li>Rudi ryžiai, bulguras</li><li>Saldžiosios bulvės</li><li>Vaisiai ir daržovės</li></ul><h3>Sveikų riebalų šaltiniai:</h3><ul><li>Avokadai</li><li>Riešutai ir sėklos</li><li>Alyvuogių aliejus</li><li>Riebūs žuvis</li></ul>", duration: 15 },
      { title: "Dažniausios mitybos klaidos", type: "text", content: "<h2>Vengkite šių klaidų</h2><ol><li><strong>Per griežtos dietos</strong> – lėtina metabolizmą ir veda prie „jojo" efekto</li><li><strong>Valgymo kartų praleidimas</strong> – ypač pusryčių</li><li><strong>Per mažai vandens</strong> – dehidratacija mažina energiją</li><li><strong>Per daug perdirbto maisto</strong> – rinkitės natūralius produktus</li><li><strong>Nekreipti dėmesio į porcijų dydį</strong> – net sveiki produktai gali turėti daug kalorijų</li><li><strong>Maisto papildų perdozavimas</strong> – maistas visada pirmenybė prieš papildus</li></ol>", duration: 15 },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding courses...");

  for (const courseData of courses) {
    const { lessons, ...courseFields } = courseData;

    const existingCourse = await prisma.course.findFirst({
      where: { title: courseData.title },
    });

    if (existingCourse) {
      await prisma.courseLesson.deleteMany({
        where: { courseId: existingCourse.id },
      });
      await prisma.course.delete({
        where: { id: existingCourse.id },
      });
    }

    const course = await prisma.course.create({
      data: {
        ...courseFields,
        lessons: {
          create: lessons.map((lesson, index) => ({
            title: lesson.title,
            type: lesson.type,
            content: lesson.content,
            duration: lesson.duration,
            order: index + 1,
            isPublished: true,
          })),
        },
      },
      include: { lessons: true },
    });

    console.log(`✅ Created course "${course.title}" with ${course.lessons.length} lessons`);
  }

  console.log("🎉 Courses seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding courses:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
