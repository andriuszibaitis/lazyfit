import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

// This endpoint updates user nutrition plans with icons based on matching names
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all user's nutrition plans without icons
    const userPlans = await prisma.userNutritionPlan.findMany({
      where: {
        userId: session.user.id,
        icon: null,
      },
    });

    // Get all system nutrition plans
    const systemPlans = await prisma.nutritionPlan.findMany({
      select: {
        name: true,
        icon: true,
      },
    });

    // Create a map of plan names to icons
    const nameToIcon: Record<string, string> = {};
    for (const plan of systemPlans) {
      if (plan.icon) {
        nameToIcon[plan.name.toLowerCase()] = plan.icon;
      }
    }

    // Update user plans with matching icons
    let updatedCount = 0;
    for (const userPlan of userPlans) {
      const matchingIcon = nameToIcon[userPlan.name.toLowerCase()];
      if (matchingIcon) {
        await prisma.userNutritionPlan.update({
          where: { id: userPlan.id },
          data: { icon: matchingIcon },
        });
        updatedCount++;
      }
    }

    return NextResponse.json({
      message: `Updated ${updatedCount} plans with icons`,
      updatedCount,
    });
  } catch (error) {
    console.error("Error migrating icons:", error);
    return NextResponse.json(
      { error: "Failed to migrate icons" },
      { status: 500 }
    );
  }
}
