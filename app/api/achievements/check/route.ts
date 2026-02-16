import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

// POST - Check and award achievements for the current user
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const awarded: string[] = [];

    // Get all active achievements
    const achievements = await prisma.achievement.findMany({
      where: { isActive: true },
    });

    // Get already unlocked achievements
    const unlocked = await prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true },
    });
    const unlockedIds = new Set(unlocked.map((u) => u.achievementId));

    for (const achievement of achievements) {
      if (unlockedIds.has(achievement.id)) continue;

      let shouldAward = false;

      switch (achievement.trigger) {
        case "registration": {
          // Always award - user exists
          shouldAward = true;
          break;
        }

        case "first_measurement": {
          const count = await prisma.bodyMeasurement.count({
            where: { userId },
          });
          shouldAward = count >= (achievement.triggerValue || 1);
          break;
        }

        case "first_photo": {
          const count = await prisma.progressPhoto.count({
            where: { userId },
          });
          shouldAward = count >= (achievement.triggerValue || 1);
          break;
        }

        case "first_nutrition_plan": {
          const count = await prisma.userNutritionPlan.count({
            where: { userId },
          });
          shouldAward = count >= (achievement.triggerValue || 1);
          break;
        }

        case "meal_tracking_streak": {
          // Count distinct days with meal logs
          const logs = await prisma.userMealLog.findMany({
            where: { userId },
            select: { date: true },
            distinct: ["date"],
            orderBy: { date: "desc" },
          });
          shouldAward = logs.length >= (achievement.triggerValue || 7);
          break;
        }

        case "weight_goal_reached": {
          // Check if user has a nutrition plan with "lose" goal and current weight <= target
          const nutritionPlan = await prisma.userNutritionPlan.findFirst({
            where: { userId, goal: "lose" },
            orderBy: { createdAt: "desc" },
          });
          if (nutritionPlan) {
            const latestMeasurement = await prisma.bodyMeasurement.findFirst({
              where: { userId, weight: { not: null } },
              orderBy: { date: "desc" },
            });
            if (latestMeasurement?.weight && nutritionPlan.weight) {
              // If user lost at least 5% of starting weight, award achievement
              const startWeight = Number(nutritionPlan.weight);
              const currentWeight = Number(latestMeasurement.weight);
              if (currentWeight <= startWeight * 0.95) {
                shouldAward = true;
              }
            }
          }
          break;
        }

        case "first_course_completed": {
          // Check if user has completed any course (all lessons viewed)
          // For now, this is a placeholder until course progress tracking is added
          break;
        }

        default:
          break;
      }

      if (shouldAward) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
          },
        });
        awarded.push(achievement.code);
      }
    }

    return NextResponse.json({ awarded });
  } catch (error) {
    console.error("Error checking achievements:", error);
    return NextResponse.json(
      { error: "Failed to check achievements" },
      { status: 500 }
    );
  }
}
