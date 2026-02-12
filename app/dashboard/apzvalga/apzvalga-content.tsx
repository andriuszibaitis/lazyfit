"use client";

import { useEffect } from "react";
import { usePageTitle } from "../contexts/page-title-context";
import StreakCard from "./components/streak-card";
import CompletedWorkoutsCard from "./components/completed-workouts-card";
import BodyMeasurementsCard from "./components/body-measurements-card";
import WeightTrackingCard from "./components/weight-tracking-card";
import WeeklyPlanCard from "./components/weekly-plan-card";
import NutritionStatsCard from "./components/nutrition-stats-card";
import ProgressCard from "./components/progress-card";
import AchievementsCard from "./components/achievements-card";
import WeeklyQuestionCard from "./components/weekly-question-card";

interface ApzvalgaContentProps {
  user: any;
}

export default function ApzvalgaContent({ user }: ApzvalgaContentProps) {
  const { setPageTitle } = usePageTitle();
  const firstName = user?.name?.split(" ")[0] || "Vartotojau";

  useEffect(() => {
    setPageTitle(`Sveiki, ${firstName}`);
  }, [setPageTitle, firstName]);

  return (
    <div className="flex-1 p-6 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        {/* Top row - custom grid */}
        <div className="grid grid-cols-1 md:grid-cols-[305px_1fr_1fr] gap-4 mb-4 auto-rows-fr">
          {/* Left column - Streak + Completed workouts (narrower) */}
          <div className="flex flex-col gap-4 h-full">
            <div className="flex-1">
              <StreakCard userName={user?.name} />
            </div>
            <div className="flex-1">
              <CompletedWorkoutsCard />
            </div>
          </div>

          {/* Middle column - Body measurements */}
          <BodyMeasurementsCard />

          {/* Right column - Weight tracking */}
          <WeightTrackingCard />
        </div>

        {/* Second row - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <WeeklyPlanCard />
          <NutritionStatsCard />
        </div>

        {/* Third row - custom grid */}
        <div className="grid grid-cols-1 md:grid-cols-[305px_1fr_1fr] gap-4">
          <ProgressCard />
          <AchievementsCard />
          <WeeklyQuestionCard />
        </div>
      </div>
    </div>
  );
}
