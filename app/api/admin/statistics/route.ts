import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalUsers,
      activeMembers,
      totalCourses,
      totalWorkouts,
      totalPrograms,
      totalRecipes,
      totalFoodProducts,
      totalAchievements,
      totalNutritionPlans,
      totalExercises,
      membershipGroups,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { membershipStatus: "active" } }),
      prisma.course.count(),
      prisma.workout.count({ where: { isCopy: false } }),
      prisma.trainingProgram.count(),
      prisma.recipe.count(),
      prisma.foodProduct.count({ where: { isUserCreated: false } }),
      prisma.achievement.count(),
      prisma.nutritionPlan.count(),
      prisma.exercise.count(),
      prisma.user.groupBy({
        by: ["planId"],
        where: { planId: { not: null } },
        _count: { planId: true },
      }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          membershipStatus: true,
        },
      }),
    ]);

    // Get membership names for breakdown
    const membershipBreakdown = [];
    for (const group of membershipGroups) {
      if (group.planId) {
        const membership = await prisma.membership.findUnique({
          where: { planId: group.planId },
          select: { name: true, planId: true },
        });
        membershipBreakdown.push({
          planId: group.planId,
          name: membership?.name || group.planId,
          count: group._count.planId,
        });
      }
    }

    return NextResponse.json({
      totalUsers,
      activeMembers,
      totalCourses,
      totalWorkouts,
      totalPrograms,
      totalRecipes,
      totalFoodProducts,
      totalAchievements,
      totalNutritionPlans,
      totalExercises,
      membershipBreakdown,
      recentUsers,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Nepavyko gauti statistikos" },
      { status: 500 }
    );
  }
}
