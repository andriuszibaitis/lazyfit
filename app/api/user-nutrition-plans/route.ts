import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

// Activity level multipliers
const activityMultipliers: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.465,
  active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

// Goal calorie adjustments
const goalAdjustments: Record<string, number> = {
  maintain: 1.0,
  lose: 0.8, // 20% deficit
  gain: 1.15, // 15% surplus
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, goal, activityLevel, gender, age, height, weight, sourcePlanId, icon } = body;

    // Validate required fields
    if (!name || !goal || !activityLevel || !gender || !age || !height || !weight) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get icon from source plan if sourcePlanId is provided
    let planIcon = icon || null;
    if (sourcePlanId && !planIcon) {
      const sourcePlan = await prisma.nutritionPlan.findUnique({
        where: { id: sourcePlanId },
        select: { icon: true },
      });
      planIcon = sourcePlan?.icon || null;
    }

    // Parse numeric values
    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    // Validate numeric values
    if (isNaN(ageNum) || isNaN(heightNum) || isNaN(weightNum)) {
      return NextResponse.json(
        { error: "Invalid numeric values" },
        { status: 400 }
      );
    }

    // Calculate BMR using Mifflin-St Jeor Formula
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    // Calculate TDEE
    const multiplier = activityMultipliers[activityLevel] || 1.2;
    const tdee = Math.round(bmr * multiplier);

    // Calculate target calories based on goal
    const goalMultiplier = goalAdjustments[goal] || 1.0;
    const targetCalories = Math.round(tdee * goalMultiplier);

    // Deactivate any existing active plans for this user
    await prisma.userNutritionPlan.updateMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    // Create the new plan
    const plan = await prisma.userNutritionPlan.create({
      data: {
        name,
        userId: session.user.id,
        goal,
        activityLevel,
        gender,
        age: ageNum,
        height: heightNum,
        weight: weightNum,
        bmr: Math.round(bmr),
        tdee,
        targetCalories,
        icon: planIcon,
        isActive: true,
      },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Error creating nutrition plan:", error);
    return NextResponse.json(
      { error: "Failed to create nutrition plan" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plans = await prisma.userNutritionPlan.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching nutrition plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch nutrition plans" },
      { status: 500 }
    );
  }
}
