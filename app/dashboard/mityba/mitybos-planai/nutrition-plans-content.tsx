"use client";

import NutritionPlanCard from "../nutrition-plan-card";

interface NutritionPlan {
  id: string;
  name: string;
  description: string | null;
  benefits: string | null;
  icon: string | null;
  isPopular: boolean;
  image: string;
  daysCount: number;
  mealsPerDay: number;
  avgDailyCalories: number;
  avgDailyProtein: number;
  avgDailyCarbs: number;
  avgDailyFat: number;
  gender: string;
}

interface NutritionPlansContentProps {
  plans: NutritionPlan[];
}

export default function NutritionPlansContent({
  plans,
}: NutritionPlansContentProps) {
  return (
    <div className="mb-12 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.length > 0 ? (
          plans.map((plan) => (
            <NutritionPlanCard key={plan.id} plan={plan} />
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-muted-foreground">Nėra prieinamų mitybos planų</p>
            <p className="text-sm text-gray-500 mt-2">
              Patikrinkite, ar turite aktyvią narystę arba ar yra sukurtų
              mitybos planų.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
