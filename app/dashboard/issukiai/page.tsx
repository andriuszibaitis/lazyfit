import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Clock,
  Users,
  Flame,
  Dumbbell,
  Target,
  Salad,
} from "lucide-react";

const challenges = [
  {
    id: "1",
    title: "30 dienų plankos iššūkis",
    description:
      "Kiekvieną dieną atlikite planką, pradedant nuo 30 sekundžių ir kas dieną pridedant po 5 sekundes. Po 30 dienų galėsite laikyti planką 3+ minutes!",
    duration: "30 dienų",
    difficulty: "Pradedantiesiems",
    participants: 234,
    icon: <Dumbbell className="h-6 w-6" />,
    color: "bg-blue-500",
    category: "Sportas",
  },
  {
    id: "2",
    title: "Savaitės detoksas",
    description:
      "7 dienų sveikos mitybos iššūkis – atsisakykite cukraus, perdirbto maisto ir alkoholio. Valgykite tik natūralius produktus ir gerkite 2+ litrus vandens.",
    duration: "7 dienos",
    difficulty: "Vidutinis",
    participants: 156,
    icon: <Salad className="h-6 w-6" />,
    color: "bg-green-500",
    category: "Mityba",
  },
  {
    id: "3",
    title: "100 atsispaudimų per dieną",
    description:
      "Iššūkis drąsiesiems – kiekvieną dieną atlikite 100 atsispaudimų. Galite padalinti į kelis setus per visą dieną. Trukmė: 14 dienų.",
    duration: "14 dienų",
    difficulty: "Pažengusiems",
    participants: 89,
    icon: <Flame className="h-6 w-6" />,
    color: "bg-red-500",
    category: "Sportas",
  },
  {
    id: "4",
    title: "10 000 žingsnių kasdien",
    description:
      "Siekite bent 10 000 žingsnių kiekvieną dieną visą mėnesį. Puikus būdas padidinti kasdienį aktyvumą ir pagerinti sveikatą.",
    duration: "30 dienų",
    difficulty: "Pradedantiesiems",
    participants: 412,
    icon: <Target className="h-6 w-6" />,
    color: "bg-purple-500",
    category: "Aktyvumas",
  },
];

const difficultyColors: Record<string, string> = {
  Pradedantiesiems: "bg-green-100 text-green-800",
  Vidutinis: "bg-yellow-100 text-yellow-800",
  Pažengusiems: "bg-red-100 text-red-800",
};

export default function IssukiaiPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Iššūkiai</h1>
          <p className="text-gray-500 text-sm mt-1">
            Prisijunkite prie iššūkių ir pasiekite naujų aukštumų
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 text-center">
          <Trophy className="h-6 w-6 text-[#60988E] mx-auto mb-2" />
          <p className="text-2xl font-bold">{challenges.length}</p>
          <p className="text-xs text-gray-500">Aktyvūs iššūkiai</p>
        </Card>
        <Card className="p-4 text-center">
          <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">
            {challenges.reduce((sum, c) => sum + c.participants, 0)}
          </p>
          <p className="text-xs text-gray-500">Dalyvių</p>
        </Card>
        <Card className="p-4 text-center">
          <Clock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">7-30</p>
          <p className="text-xs text-gray-500">Dienų trukmė</p>
        </Card>
        <Card className="p-4 text-center">
          <Flame className="h-6 w-6 text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs text-gray-500">Jūsų užbaigti</p>
        </Card>
      </div>

      {/* Challenge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="overflow-hidden">
            <div className={`${challenge.color} p-4 text-white`}>
              <div className="flex items-center gap-3">
                {challenge.icon}
                <div>
                  <h3 className="font-bold text-lg">{challenge.title}</h3>
                  <span className="text-white/80 text-sm">
                    {challenge.category}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-5">
              <p className="text-gray-600 text-sm mb-4">
                {challenge.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  <Clock className="h-3 w-3" />
                  {challenge.duration}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    difficultyColors[challenge.difficulty]
                  }`}
                >
                  {challenge.difficulty}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  <Users className="h-3 w-3" />
                  {challenge.participants} dalyvių
                </span>
              </div>
              <Button className="w-full bg-[#60988E] text-white hover:bg-opacity-90">
                Dalyvauti
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
