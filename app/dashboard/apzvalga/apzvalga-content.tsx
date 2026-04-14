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
  const { setPageTitle, setMobileGreeting } = usePageTitle();
  const firstName = user?.name?.split(" ")[0] || "Vartotojau";

  useEffect(() => {
    setPageTitle(`Sveiki, ${firstName}`);
    setMobileGreeting({ userName: user?.name || firstName, userImage: user?.image });
    return () => setMobileGreeting(null);
  }, [setPageTitle, setMobileGreeting, firstName, user?.name, user?.image]);

  return (
    <div className="flex-1 px-4 py-4 lg:p-6 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        {/* Mobile: Streak + Completed side by side */}
        <div className="grid grid-cols-2 gap-4 mb-4 md:hidden">
          <StreakCard userName={user?.name} />
          <CompletedWorkoutsCard />
        </div>

        {/* Top row - desktop grid */}
        <div className="hidden md:grid md:grid-cols-[305px_1fr_1fr] gap-4 mb-4 auto-rows-fr">
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

        {/* Mobile: WeeklyPlan -> Body measurements -> Nutrition */}
        <div className="md:hidden space-y-4 mb-4">
          <WeeklyPlanCard />
          <BodyMeasurementsCard />
          <NutritionStatsCard />
        </div>

        {/* Second row - 2 columns (desktop) */}
        <div className="hidden md:grid md:grid-cols-2 gap-4 mb-4">
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
