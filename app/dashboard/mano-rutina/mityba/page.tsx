import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth-options";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ManoRutinaMitybaContent from "./mano-rutina-mityba-content";

export default async function ManoRutinaMitybaPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/prisijungti?callbackUrl=/dashboard/mano-rutina/mityba");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { membership: true },
  });

  const userMembershipId = user?.membership?.id || null;

  // Fetch user's nutrition plans
  const userPlans = await prisma.userNutritionPlan.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const hasUserPlans = userPlans.length > 0;

  // Calculate age from birthDate
  let userAge: number | null = null;
  if (user?.birthDate) {
    const today = new Date();
    const birth = new Date(user.birthDate);
    userAge = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      userAge--;
    }
  }

  const userProfile = {
    gender: user?.gender || null,
    age: userAge,
  };

  // Fetch all available nutrition plans
  const nutritionPlans = await prisma.nutritionPlan.findMany({
    where: {
      isPublished: true,
      OR: [
        { membershipId: null },
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

  return <ManoRutinaMitybaContent plans={formattedPlans} userPlans={userPlans} hasUserPlans={hasUserPlans} userProfile={userProfile} />;
}
