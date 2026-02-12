import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth-options";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import NutritionPlansContent from "./nutrition-plans-content";

export default async function MitybosPlanaiPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/prisijungti?callbackUrl=/dashboard/mityba/mitybos-planai");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { membership: true },
  });

  const userMembershipId = user?.membership?.id || null;

  // Fetch nutrition plans that user has access to
  const nutritionPlans = await prisma.nutritionPlan.findMany({
    where: {
      isPublished: true,
      OR: [
        { membershipId: null }, // Available to all
        { membershipId: userMembershipId || undefined },
      ],
    },
    include: {
      days: {
        include: {
          meals: {
            include: {
              items: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Calculate totals for each plan
  const formattedPlans = nutritionPlans.map((plan) => {
    // Calculate average daily calories/macros
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let mealCount = 0;

    plan.days.forEach((day) => {
      day.meals.forEach((meal) => {
        meal.items.forEach((item) => {
          totalCalories += item.calories;
          totalProtein += item.protein;
          totalCarbs += item.carbs;
          totalFat += item.fat;
        });
        mealCount++;
      });
    });

    const daysCount = plan.days.length || 1;
    const avgDailyCalories = Math.round(totalCalories / daysCount);
    const avgDailyProtein = Math.round(totalProtein / daysCount);
    const avgDailyCarbs = Math.round(totalCarbs / daysCount);
    const avgDailyFat = Math.round(totalFat / daysCount);
    const mealsPerDay = Math.round(mealCount / daysCount);

    return {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      benefits: plan.benefits,
      icon: plan.icon,
      isPopular: plan.isPopular,
      image: plan.imageUrl || "/placeholder.svg?height=300&width=400",
      daysCount: plan.days.length,
      mealsPerDay,
      avgDailyCalories,
      avgDailyProtein,
      avgDailyCarbs,
      avgDailyFat,
      gender: plan.gender,
    };
  });

  return <NutritionPlansContent plans={formattedPlans} />;
}
