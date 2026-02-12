import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prismadb";

// GET - Get all achievements with user's unlock status
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all achievements
    const achievements = await prisma.achievement.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    // Get user's unlocked achievements
    const userAchievements = await prisma.userAchievement.findMany({
      where: {
        userId: session.user.id,
      },
    });

    // Create a map of unlocked achievements
    const unlockedMap = new Map(
      userAchievements.map((ua) => [ua.achievementId, ua.unlockedAt])
    );

    // Combine data
    const achievementsWithStatus = achievements.map((achievement) => ({
      ...achievement,
      isUnlocked: unlockedMap.has(achievement.id),
      unlockedAt: unlockedMap.get(achievement.id) || null,
    }));

    return NextResponse.json({ achievements: achievementsWithStatus });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}
