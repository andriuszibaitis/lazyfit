import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const faqData = [
  {
    title: "Bendri klausimai",
    slug: "bendri-klausimai",
    order: 0,
    items: [
      {
        question: "Kas yra LazyFit?",
        answer: "LazyFit yra visapusė fitnes ir sveikatingumo platforma, sukurta padėti jums pasiekti savo sveikatos tikslus. Platforma apima mitybos planavimą, treniruočių programas, edukacinį turinį ir personalizuotus patarimus.",
      },
      {
        question: "Kaip pradėti naudotis LazyFit?",
        answer: "Užsiregistruokite platformoje, užpildykite savo profilį su asmenine informacija (amžius, svoris, ūgis, tikslai) ir pradėkite naudotis mitybos planais, treniruočių programomis ir kitomis funkcijomis.",
      },
      {
        question: "Ar LazyFit tinka pradedantiesiems?",
        answer: "Taip! LazyFit sukurta visiems – nuo pradedančiųjų iki pažengusių sportininkų. Mūsų programos pritaikytos skirtingiems lygiams ir tikslams.",
      },
      {
        question: "Kokios funkcijos įeina į narystę?",
        answer: "Priklausomai nuo pasirinkto plano, galite naudotis mitybos planais, receptais, treniruočių programomis, kalorijų skaičiuokle, edukaciniais kursais ir personalizuotais patarimais.",
      },
    ],
  },
  {
    title: "Sportas",
    slug: "sportas",
    order: 1,
    items: [
      {
        question: "Kokias treniruočių programas siūlote?",
        answer: "Siūlome įvairias programas: jėgos treniruotes, kardio, HIIT, jogą, tampymo pratimus ir specializuotas programas skirtingoms raumenų grupėms.",
      },
      {
        question: "Ar treniruotės tinka namams?",
        answer: "Taip! Turime daug treniruočių, kurias galite atlikti namuose su minimaliu inventoriumi arba visai be jo.",
      },
      {
        question: "Kaip sekti savo treniruočių progresą?",
        answer: "Kiekviena atlikta treniruotė išsaugoma jūsų istorijoje. Galite matyti statistiką, palyginti rezultatus ir stebėti savo tobulėjimą laikui bėgant.",
      },
      {
        question: "Ar galiu kurti savo treniruotes?",
        answer: "Šiuo metu galite naudoti mūsų paruoštas treniruočių programas. Personalizuotų treniruočių kūrimo funkcija planuojama ateityje.",
      },
    ],
  },
  {
    title: "Mityba",
    slug: "mityba",
    order: 2,
    items: [
      {
        question: "Kaip veikia kalorijų skaičiuoklė?",
        answer: "Kalorijų skaičiuoklė naudoja jūsų įvestus duomenis (amžių, lytį, ūgį, svorį ir fizinį aktyvumą), kad apskaičiuotų bazinę medžiagų apykaitą (BMR) ir rekomenduojamą dienos kalorijų normą pagal jūsų tikslą – numesti svorio, išlaikyti esamą ar priaugti.",
      },
      {
        question: "Ar galiu sukurti savo mitybos planą?",
        answer: "Taip! Galite kurti asmeninius mitybos planus, pridėti mėgstamus receptus, sekti suvartotus maisto produktus ir stebėti savo progresą.",
      },
      {
        question: "Kaip sekti suvartotus maisto produktus?",
        answer: "Naudokite kasdienį valgių sekiklį – tiesiog pridėkite produktus iš mūsų duomenų bazės arba sukurkite savo. Sistema automatiškai apskaičiuos kalorijas ir makroelementus.",
      },
      {
        question: "Ar receptai pritaikyti specialioms dietoms?",
        answer: "Taip, mūsų receptų bibliotekoje rasite receptų įvairioms dietoms – vegetarinė, veganiška, be glitimo, keto ir kt. Galite filtruoti pagal savo poreikius.",
      },
      {
        question: "Kaip apskaičiuojama dienos kalorijų norma?",
        answer: "Naudojame Mifflin-St Jeor formulę BMR apskaičiavimui ir atsižvelgiame į jūsų aktyvumo lygį bei tikslus (svorio metimas, palaikymas ar priaugimas).",
      },
    ],
  },
  {
    title: "Specialūs poreikiai",
    slug: "specialus-poreikiai",
    order: 3,
    items: [
      {
        question: "Ar turite programų nėščiosioms?",
        answer: "Taip, turime specialias programas nėščiosioms ir po gimdymo atsigaunantiems. Šios programos sukurtos atsižvelgiant į kūno pokyčius ir saugumą.",
      },
      {
        question: "Ar tinka žmonėms su sveikatos problemomis?",
        answer: "Prieš pradedant bet kokią programą, rekomenduojame pasikonsultuoti su gydytoju. Mūsų programas galima pritaikyti pagal individualius poreikius, tačiau specialių medicininių būklių atveju būtina specialisto konsultacija.",
      },
      {
        question: "Ar turite vegetariškų/veganiškų mitybos planų?",
        answer: "Taip! Mūsų mitybos planai apima vegetariškus ir veganiškus variantus. Galite filtruoti receptus pagal savo mitybos pasirinkimus.",
      },
      {
        question: "Ar galiu pritaikyti programas pagal savo traumą?",
        answer: "Rekomenduojame pasikonsultuoti su kineziterapeutu ar gydytoju dėl konkrečių pratimų. Mūsų platformoje galite pasirinkti treniruotes, kurios vengia tam tikrų raumenų grupių ar judesių.",
      },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding FAQ data...");

  // Clear existing FAQ data
  await prisma.fAQItem.deleteMany();
  await prisma.fAQCategory.deleteMany();
  console.log("✅ Cleared existing FAQ data");

  // Create categories and items
  for (const category of faqData) {
    const createdCategory = await prisma.fAQCategory.create({
      data: {
        title: category.title,
        slug: category.slug,
        order: category.order,
        isActive: true,
        items: {
          create: category.items.map((item, index) => ({
            question: item.question,
            answer: item.answer,
            order: index,
            isActive: true,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    console.log(
      `✅ Created category "${createdCategory.title}" with ${createdCategory.items.length} items`
    );
  }

  console.log("🎉 FAQ seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding FAQ:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
