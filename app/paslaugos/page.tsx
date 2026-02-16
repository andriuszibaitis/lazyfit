import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dumbbell,
  UtensilsCrossed,
  Monitor,
  Users,
  Target,
  Trophy,
  ArrowRight,
} from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Link from "next/link";

const services = [
  {
    icon: Dumbbell,
    title: "Asmeninės treniruočių programos",
    description:
      "Profesionaliai sudarytos treniruočių programos, pritaikytos jūsų tikslams ir lygiui. Nuo pradedančiųjų iki pažengusių.",
    features: [
      "Push/Pull/Legs, Full Body, Upper/Lower programos",
      "Detalūs pratimų aprašymai su video",
      "Progreso sekimas",
      "Programos namuose ir sporto salėje",
    ],
  },
  {
    icon: UtensilsCrossed,
    title: "Mitybos planai ir receptai",
    description:
      "Subalansuoti mitybos planai su tiksliais makroelementų skaičiavimais ir gardžiais receptais.",
    features: [
      "Kalorijų skaičiuoklė (Mifflin-St Jeor)",
      "Asmeniniai mitybos planai",
      "Receptų biblioteka su filtrais",
      "Kasdieninis valgių sekimas",
    ],
  },
  {
    icon: Monitor,
    title: "Online mokymai ir kursai",
    description:
      "Edukaciniai kursai apie sportą, mitybą ir sveikatą. Mokykitės savo tempu, bet kur ir bet kada.",
    features: [
      "Video ir teksto pamokos",
      "Sporto pagrindai pradedantiesiems",
      "Mitybos ABC kursas",
      "Meditacija ir atsipalaidavimas",
    ],
  },
  {
    icon: Users,
    title: "Grupiniai iššūkiai",
    description:
      "Prisijunkite prie bendruomenės iššūkių ir pasiekite savo tikslus kartu su kitais LazyFit nariais.",
    features: [
      "30 dienų sporto iššūkiai",
      "Mitybos detokso programos",
      "Progreso lentelės",
      "Bendruomenės palaikymas",
    ],
  },
  {
    icon: Target,
    title: "Progreso sekimas",
    description:
      "Sekite savo kūno pokyčius, svorį, matmenis ir nuotraukas vienoje vietoje.",
    features: [
      "Kūno matmenų registravimas",
      "Svorio grafikai",
      "Progreso nuotraukų palyginimas",
      "Pasiekimų sistema",
    ],
  },
  {
    icon: Trophy,
    title: "Pasiekimų ir motyvacijos sistema",
    description:
      "Atraskite vidinę motyvaciją su pasiekimų ženkleliais ir iššūkių sistema.",
    features: [
      "Pasiekimų ženkleliai",
      "Aktyvumo serijos (streaks)",
      "Asmeniniai tikslai",
      "Progreso ataskitos",
    ],
  },
];

export default function PaslaugosPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="bg-[#101827] text-white py-24 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Mūsų paslaugos</h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Viskas, ko reikia jūsų fitnes kelionei – nuo treniruočių ir mitybos
              planų iki edukacinių kursų ir bendruomenės palaikymo.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.title}
                  className="p-8 hover:shadow-lg transition-shadow group"
                >
                  <div className="bg-[#60988E]/10 p-4 rounded-2xl w-fit mb-6 group-hover:bg-[#60988E]/20 transition-colors">
                    <Icon className="h-8 w-8 text-[#60988E]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-[#60988E] mt-0.5 font-bold">&#10003;</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="bg-[#60988E] py-20 px-4">
          <div className="container mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pasiruošę pradėti?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
              Prisijunkite prie LazyFit ir pradėkite savo kelionę link geresnės
              versijos savęs jau šiandien!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/registracija">
                <Button className="bg-white text-[#60988E] hover:bg-gray-100 px-8 py-3 text-lg flex items-center gap-2">
                  Pradėti nemokamai
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/kontaktai">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg"
                >
                  Susisiekti
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
