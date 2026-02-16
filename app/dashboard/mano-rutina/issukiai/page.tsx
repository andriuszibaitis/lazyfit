import PageTitleBar from "../../components/page-title-bar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Flame, Target, CheckCircle, Play } from "lucide-react";

const myChallenges = [
  {
    id: 1,
    title: "30 dienų plankos iššūkis",
    description: "Kasdien didinkite plankos trukmę",
    duration: "30 dienų",
    progress: 12,
    total: 30,
    status: "active",
    category: "Jėga",
    icon: <Flame className="h-5 w-5 text-orange-500" />,
  },
  {
    id: 2,
    title: "10 000 žingsnių kasdien",
    description: "Eikite mažiausiai 10 000 žingsnių",
    duration: "21 diena",
    progress: 21,
    total: 21,
    status: "completed",
    category: "Kardio",
    icon: <Trophy className="h-5 w-5 text-yellow-500" />,
  },
  {
    id: 3,
    title: "Savaitės detoksas",
    description: "Atsisakykite cukraus ir perdirbtų produktų",
    duration: "7 dienos",
    progress: 0,
    total: 7,
    status: "not_started",
    category: "Mityba",
    icon: <Target className="h-5 w-5 text-green-500" />,
  },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: "Vykdomas", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Užbaigtas", color: "bg-green-100 text-green-800" },
  not_started: { label: "Nepradėtas", color: "bg-gray-100 text-gray-800" },
};

export default function ManoRutinaIssukiaiPage() {
  return (
    <>
      <PageTitleBar title="Mano rutina" />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2
                  className="text-[36px] font-semibold text-[#101827]"
                  style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
                >
                  Mano iššūkiai
                </h2>
                <p className="text-[#6B7280] mt-2">
                  Jūsų aktyvūs ir užbaigti iššūkiai
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {myChallenges.map((challenge) => {
                const status = statusLabels[challenge.status];
                const progressPercent =
                  challenge.total > 0
                    ? Math.round((challenge.progress / challenge.total) * 100)
                    : 0;

                return (
                  <Card key={challenge.id} className="p-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="bg-gray-100 p-3 rounded-lg shrink-0">
                        {challenge.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-base">
                            {challenge.title}
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                          {challenge.description}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  challenge.status === "completed"
                                    ? "bg-green-500"
                                    : "bg-[#60988E]"
                                }`}
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 shrink-0">
                            {challenge.progress}/{challenge.total} d.
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {challenge.status === "completed" ? (
                          <div className="flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle className="h-5 w-5" />
                            <span>Užbaigta</span>
                          </div>
                        ) : challenge.status === "active" ? (
                          <Button
                            size="sm"
                            className="bg-[#60988E] text-white hover:bg-opacity-90"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Tęsti
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            Pradėti
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
