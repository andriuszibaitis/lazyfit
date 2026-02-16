"use client";

import { useState } from "react";
import PageTitleBar from "../components/page-title-bar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Clock,
  Dumbbell,
  ChefHat,
  UtensilsCrossed,
  BookOpen,
} from "lucide-react";

type FilterType = "all" | "recipes" | "workouts" | "exercises";

const fakeRecipes = [
  { id: 1, type: "recipe" as const, title: "Vištienos krūtinėlė su daržovėmis", calories: 380, time: 30, category: "Pietūs" },
  { id: 2, type: "recipe" as const, title: "Avižinė košė su bananais", calories: 320, time: 10, category: "Pusryčiai" },
  { id: 3, type: "recipe" as const, title: "Lašišos filė su ryžiais", calories: 520, time: 25, category: "Vakarienė" },
];

const fakeWorkouts = [
  { id: 4, type: "workout" as const, title: "Push Day treniruotė", duration: 60, difficulty: "Vidutinis", muscles: "Krūtinė, Pečiai" },
  { id: 5, type: "workout" as const, title: "Namų treniruotė", duration: 30, difficulty: "Pradedantiesiems", muscles: "Visas kūnas" },
];

const fakeExercises = [
  { id: 6, type: "exercise" as const, title: "Pritūpimai su štanga", muscle: "Kojos", equipment: "Štanga" },
  { id: 7, type: "exercise" as const, title: "Prisitraukimai", muscle: "Nugara", equipment: "Skersinis" },
  { id: 8, type: "exercise" as const, title: "Planka", muscle: "Core", equipment: "Be įrangos" },
];

const filters: { value: FilterType; label: string }[] = [
  { value: "all", label: "Visi" },
  { value: "recipes", label: "Receptai" },
  { value: "workouts", label: "Treniruotės" },
  { value: "exercises", label: "Pratimai" },
];

export default function PamegtiPage() {
  const [filter, setFilter] = useState<FilterType>("all");

  return (
    <>
      <PageTitleBar title="Pamėgti" />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2
                  className="text-[36px] font-semibold text-[#101827]"
                  style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
                >
                  Mano pamėgti
                </h2>
                <p className="text-[#6B7280] mt-2">
                  Visi jūsų mėgstamiausi elementai vienoje vietoje
                </p>
              </div>
              <div className="flex gap-2">
                {filters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`px-3 py-1.5 rounded-full text-sm transition ${
                      filter === f.value
                        ? "bg-[#60988E] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {(filter === "all" || filter === "recipes") && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <ChefHat className="h-5 w-5 text-[#60988E]" />
                    Receptai
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {fakeRecipes.map((recipe) => (
                      <Card key={recipe.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{recipe.title}</h4>
                          <Heart className="h-4 w-4 text-red-400 fill-current shrink-0 ml-2" />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {recipe.time} min
                          </span>
                          <span>{recipe.calories} kcal</span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full">{recipe.category}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {(filter === "all" || filter === "workouts") && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Dumbbell className="h-5 w-5 text-[#60988E]" />
                    Treniruotės
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {fakeWorkouts.map((w) => (
                      <Card key={w.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{w.title}</h4>
                          <Heart className="h-4 w-4 text-red-400 fill-current shrink-0 ml-2" />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {w.duration} min
                          </span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full">{w.difficulty}</span>
                          <span>{w.muscles}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {(filter === "all" || filter === "exercises") && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#60988E]" />
                    Pratimai
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {fakeExercises.map((ex) => (
                      <Card key={ex.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{ex.title}</h4>
                          <Heart className="h-4 w-4 text-red-400 fill-current shrink-0 ml-2" />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="bg-[#60988E]/10 text-[#60988E] px-2 py-0.5 rounded-full">{ex.muscle}</span>
                          <span>{ex.equipment}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
