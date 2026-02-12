import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

// POST - Add item to meal log
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: mealLogId } = await params;
    const body = await request.json();
    const { foodProductId, foodProductName, quantity, unit, calories, protein, carbs, fat } = body;

    // Verify ownership of meal log
    const mealLog = await prisma.userMealLog.findUnique({
      where: { id: mealLogId },
    });

    if (!mealLog || mealLog.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Create the meal item
    const item = await prisma.userMealLogItem.create({
      data: {
        userMealLogId: mealLogId,
        foodProductId,
        foodProductName,
        quantity: Math.round(quantity),
        unit: unit || "g",
        calories: Math.round(calories),
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fat: Math.round(fat),
      },
    });

    // Update meal log totals
    const allItems = await prisma.userMealLogItem.findMany({
      where: { userMealLogId: mealLogId },
    });

    const totals = allItems.reduce(
      (acc, item) => ({
        totalCalories: acc.totalCalories + item.calories,
        totalProtein: acc.totalProtein + item.protein,
        totalCarbs: acc.totalCarbs + item.carbs,
        totalFat: acc.totalFat + item.fat,
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
    );

    await prisma.userMealLog.update({
      where: { id: mealLogId },
      data: {
        totalCalories: Math.round(totals.totalCalories),
        totalProtein: Math.round(totals.totalProtein),
        totalCarbs: Math.round(totals.totalCarbs),
        totalFat: Math.round(totals.totalFat),
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error adding meal item:", error);
    return NextResponse.json(
      { error: "Failed to add meal item" },
      { status: 500 }
    );
  }
}
