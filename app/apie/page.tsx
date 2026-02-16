import { Card } from "@/components/ui/card";
import { Heart, Target, Eye, Sparkles, Users, Award } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const team = [
  {
    name: "Airidas",
    role: "Įkūrėjas ir vadovas",
    description: "Sporto entuziastas su 10+ metų patirtimi fitnes industrijoje.",
  },
  {
    name: "Karolina",
    role: "Mitybos specialistė",
    description: "Sertifikuota dietologė, padedanti kurti subalansuotus mitybos planus.",
  },
  {
    name: "Tomas",
    role: "Treneris",
    description: "Profesionalus asmeninis treneris, kuris kuria efektyvias treniruočių programas.",
  },
  {
    name: "Ieva",
    role: "Bendruomenės vadovė",
    description: "Rūpinasi LazyFit bendruomene ir padeda nariams pasiekti savo tikslus.",
  },
];

const values = [
  {
    icon: Heart,
    title: "Sveikata pirmiausiai",
    description: "Tikime, kad sveikata yra svarbiausia vertybė. Visos mūsų programos kuriamos su dėmesiu saugumui ir tvarumui.",
  },
  {
    icon: Target,
    title: "Asmeninis požiūris",
    description: "Kiekvienas žmogus yra unikalus. Mūsų planai ir programos pritaikomi individualiems tikslams ir poreikiams.",
  },
  {
    icon: Users,
    title: "Bendruomenė",
    description: "Tikime bendruomenės galia. Kartu mes galime pasiekti daugiau nei vieni.",
  },
  {
    icon: Sparkles,
    title: "Paprastumas",
    description: "LazyFit reiškia, kad sveika gyvensena gali būti paprasta. Jokių sudėtingų dietų ar nepasiekiamų tikslų.",
  },
];

export default function ApiePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="bg-[#101827] text-white py-24 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Apie LazyFit</h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Mes tikime, kad sveika gyvensena turėtų būti prieinama visiems –
              nepriklausomai nuo patirties lygio ar laisvo laiko kiekio.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Mūsų misija</h2>
              <p className="text-gray-600 text-lg mb-4">
                LazyFit gimė iš paprastos idėjos: sveika gyvensena neturėtų būti
                sudėtinga. Per daugelį metų dirbdami fitnes srityje, pastebėjome,
                kad daugelis žmonių nustoja sportuoti ne dėl to, kad nenori, bet
                dėl to, kad viskas atrodo per sudėtinga.
              </p>
              <p className="text-gray-600 text-lg mb-4">
                Todėl sukūrėme platformą, kuri viską supaprastina – nuo treniruočių
                programų iki mitybos planų. Viskas vienoje vietoje, suprantama ir
                lengvai pasiekiama.
              </p>
              <p className="text-gray-600 text-lg">
                Mūsų tikslas – padėti jums pradėti ir nebepalikti. Nes geriausia
                treniruotė yra ta, kurią iš tikrųjų atliekate.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center bg-[#60988E]/5">
                <p className="text-4xl font-bold text-[#60988E] mb-2">1000+</p>
                <p className="text-sm text-gray-600">Aktyvių narių</p>
              </Card>
              <Card className="p-6 text-center bg-[#60988E]/5">
                <p className="text-4xl font-bold text-[#60988E] mb-2">50+</p>
                <p className="text-sm text-gray-600">Treniruočių programų</p>
              </Card>
              <Card className="p-6 text-center bg-[#60988E]/5">
                <p className="text-4xl font-bold text-[#60988E] mb-2">100+</p>
                <p className="text-sm text-gray-600">Receptų</p>
              </Card>
              <Card className="p-6 text-center bg-[#60988E]/5">
                <p className="text-4xl font-bold text-[#60988E] mb-2">95%</p>
                <p className="text-sm text-gray-600">Klientų pasitenkinimas</p>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Mūsų vertybės</h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Šios vertybės veda mus kiekvieną dieną ir padeda kurti geresnę
                platformą jums.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <Card key={value.title} className="p-6 text-center">
                    <div className="bg-[#60988E]/10 p-4 rounded-2xl w-fit mx-auto mb-4">
                      <Icon className="h-8 w-8 text-[#60988E]" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Mūsų komanda</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Profesionalų komanda, kuri rūpinasi jūsų sveikata ir rezultatais.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card key={member.name} className="p-6 text-center">
                <div className="w-20 h-20 bg-[#60988E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-10 w-10 text-[#60988E]" />
                </div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-[#60988E] text-sm mb-3">{member.role}</p>
                <p className="text-sm text-gray-600">{member.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-[#101827] py-20 px-4">
          <div className="container mx-auto text-center">
            <Eye className="h-12 w-12 text-[#60988E] mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Mūsų vizija</h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Tapti pirmaujančia fitnes platforma Lietuvoje, kuri padeda žmonėms
              atrasti džiaugsmą sveikoje gyvensenoje. Mes siekiame, kad kiekvienas
              LazyFit narys jaustųsi palaikomas ir motyvuotas kelyje link savo tikslų.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
