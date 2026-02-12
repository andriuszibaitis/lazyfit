"use client";

import { useState } from "react";
import { TabItem } from "@/components/ui/custom-tabs";
import { Button } from "@/components/ui/button";
import TrainingCard from "../components/training-card";
import PageTitleBar from "../components/page-title-bar";
import { SportsFilterPanel, SportsFilterState } from "./sports-filter-panel";

interface Training {
  id: string;
  title: string;
  image: string;
  duration: number;
  level: string;
  isFavorite: boolean;
  membershipId: string | null;
  membershipName: string | undefined;
  createdAt: string;
}

interface SportsTabsProps {
  trainings: Training[];
}

export default function SportsTabs({ trainings }: SportsTabsProps) {
  const [activeTab, setActiveTab] = useState("treneruotes");
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SportsFilterState>({
    muscleGroup: null,
    difficulty: null,
    duration: null,
    equipment: null,
  });

  const tabs: TabItem[] = [
    { id: "treneruotes", label: "Treneruotės" },
    { id: "sporto-issukiai", label: "Sporto iššūkiai" },
    { id: "sporto-programos", label: "Sporto programos" },
  ];

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  const handleApplyFilters = (filters: SportsFilterState) => {
    setActiveFilters(filters);
  };

  // Filter trainings based on active filters
  const filteredTrainings = trainings.filter((training) => {
    if (activeFilters.difficulty && training.level !== activeFilters.difficulty) {
      return false;
    }
    if (activeFilters.duration) {
      const duration = training.duration;
      switch (activeFilters.duration) {
        case "15min":
          if (duration > 15) return false;
          break;
        case "30min":
          if (duration > 30) return false;
          break;
        case "45min":
          if (duration > 45) return false;
          break;
        case "60min+":
          if (duration < 60) return false;
          break;
      }
    }
    return true;
  });

  // Sort trainings
  const sortedTrainings = [...filteredTrainings].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "popular":
        // Kol kas rūšiuojame pagal naujumą (ateityje galima pridėti peržiūrų skaičių)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "duration-short":
        return a.duration - b.duration;
      case "duration-long":
        return b.duration - a.duration;
      default:
        return 0;
    }
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case "treneruotes":
        return (
          <>
            <SportsFilterPanel
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
              onClose={() => setIsFilterOpen(false)}
              onApply={handleApplyFilters}
              sortValue={sortBy}
              onSortChange={setSortBy}
              activeFilterCount={activeFilterCount > 0 ? activeFilterCount : undefined}
              totalCount={sortedTrainings.length}
            />

            <div className="mb-8 lg:mb-12">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[28px] lg:text-[40px] font-[mango] text-[#101827]">
                  Naujausios treniruotės
                </h2>
                <Button variant="outline" className="bg-white hidden sm:inline-flex">
                  Daugiau
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {sortedTrainings.length > 0 ? (
                  sortedTrainings.map((training) => (
                    <TrainingCard key={training.id} training={training} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">
                      Nėra prieinamų treniruočių
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Patikrinkite, ar turite aktyvią narystę arba ar yra
                      sukurtų treniruočių.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <MuscleGroupSection
              muscleGroup="Presas"
              trainings={sortedTrainings.filter(
                (t) =>
                  t.title.toLowerCase().includes("pres") ||
                  t.title.toLowerCase().includes("abs") ||
                  t.title.toLowerCase().includes("core")
              )}
            />

            <MuscleGroupSection
              muscleGroup="Nugara"
              trainings={sortedTrainings.filter(
                (t) =>
                  t.title.toLowerCase().includes("nugar") ||
                  t.title.toLowerCase().includes("back")
              )}
            />
          </>
        );
      case "sporto-issukiai":
        return (
          <div className="p-8 text-center">
            <h3 className="text-xl font-medium">
              Sporto iššūkiai bus prieinami netrukus
            </h3>
          </div>
        );
      case "sporto-programos":
        return (
          <div className="p-8 text-center">
            <h3 className="text-xl font-medium">
              Sporto programos bus prieinamos netrukus
            </h3>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <PageTitleBar
        title="Sportas"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {renderTabContent()}
        </div>
      </div>
    </>
  );
}

function MuscleGroupSection({
  muscleGroup,
  trainings,
}: {
  muscleGroup: string;
  trainings: Training[];
}) {
  if (trainings.length === 0) return null;

  return (
    <div className="mb-8 lg:mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl lg:text-2xl font-bold text-[#101827]">{muscleGroup}</h2>
        <Button variant="outline" className="bg-white hidden sm:inline-flex">
          Daugiau
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {trainings.map((training) => (
          <TrainingCard key={training.id} training={training} />
        ))}
      </div>
    </div>
  );
}
