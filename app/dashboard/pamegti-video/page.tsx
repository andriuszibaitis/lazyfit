import PageTitleBar from "../components/page-title-bar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Clock, Dumbbell, Play } from "lucide-react";

const fakeWorkouts = [
  {
    id: 1,
    title: "Push Day - Stumimo treniruotė",
    duration: 60,
    difficulty: "Vidutinis",
    muscleGroups: ["Krūtinė", "Pečiai", "Tricepsas"],
  },
  {
    id: 2,
    title: "Pull Day - Traukimo treniruotė",
    duration: 65,
    difficulty: "Vidutinis",
    muscleGroups: ["Nugara", "Bicepsas"],
  },
  {
    id: 3,
    title: "Kojų treniruotė",
    duration: 70,
    difficulty: "Vidutinis",
    muscleGroups: ["Kojos", "Sėdmenys"],
  },
  {
    id: 4,
    title: "Namų treniruotė be įrangos",
    duration: 30,
    difficulty: "Pradedantiesiems",
    muscleGroups: ["Visas kūnas"],
  },
  {
    id: 5,
    title: "Pilvo presų treniruotė",
    duration: 20,
    difficulty: "Pradedantiesiems",
    muscleGroups: ["Pilvas", "Core"],
  },
];

export default function PamegtiVideoPage() {
  return (
    <>
      <PageTitleBar title="Pamėgti video" />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
            <div className="mb-6">
              <h2
                className="text-[36px] font-semibold text-[#101827]"
                style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
              >
                Pamėgtos treniruotės
              </h2>
              <p className="text-[#6B7280] mt-2">
                Jūsų mėgstamiausių treniruočių kolekcija
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fakeWorkouts.map((workout) => (
                <Card
                  key={workout.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="bg-gray-100 h-36 flex items-center justify-center relative">
                    <Dumbbell className="h-10 w-10 text-gray-300" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors cursor-pointer">
                      <Play className="h-12 w-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-base line-clamp-1">
                        {workout.title}
                      </h3>
                      <button className="text-red-400 hover:text-red-500 shrink-0 ml-2">
                        <Heart className="h-5 w-5 fill-current" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {workout.duration} min
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {workout.difficulty}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {workout.muscleGroups.map((group) => (
                        <span
                          key={group}
                          className="text-xs bg-[#60988E]/10 text-[#60988E] px-2 py-0.5 rounded-full"
                        >
                          {group}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
