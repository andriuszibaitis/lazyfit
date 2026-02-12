import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

// PATCH - Update meal item
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await params;
    const body = await request.json();
    const { quantity } = body;

    // Get item with meal log to verify ownership
    const item = await prisma.userMealLogItem.findUnique({
      where: { id: itemId },
      include: {
        userMealLog: true,
      },
    });

    if (!item || item.userMealLog.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Validate quantity
    if (!quantity || quantity <= 0) {
      return NextResponse.json({ error: "Quantity must be greater than 0" }, { status: 400 });
    }

    // Calculate new macros based on quantity change
    // Original values are per the original quantity, so we need to get per-unit values
    const originalQuantity = item.quantity || 1; // Prevent division by zero
    const multiplier = quantity / originalQuantity;

    const newCalories = Math.round(item.calories * multiplier) || 0;
    const newProtein = Math.round(item.protein * multiplier) || 0;
    const newCarbs = Math.round(item.carbs * multiplier) || 0;
    const newFat = Math.round(item.fat * multiplier) || 0;

    // Update the item
    const updatedItem = await prisma.userMealLogItem.update({
      where: { id: itemId },
      data: {
        quantity: Math.round(quantity),
        calories: newCalories,
        protein: newProtein,
        carbs: newCarbs,
        fat: newFat,
      },
    });

    // Recalculate meal log totals
    const allItems = await prisma.userMealLogItem.findMany({
      where: { userMealLogId: item.userMealLogId },
    });

    const totals = allItems.reduce(
      (acc, i) => ({
        totalCalories: acc.totalCalories + i.calories,
        totalProtein: acc.totalProtein + i.protein,
        totalCarbs: acc.totalCarbs + i.carbs,
        totalFat: acc.totalFat + i.fat,
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
    );

    await prisma.userMealLog.update({
      where: { id: item.userMealLogId },
      data: {
        totalCalories: Math.round(totals.totalCalories),
        totalProtein: Math.round(totals.totalProtein),
        totalCarbs: Math.round(totals.totalCarbs),
        totalFat: Math.round(totals.totalFat),
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating meal item:", error);
    return NextResponse.json(
      { error: "Failed to update meal item" },
      { status: 500 }
    );
  }
}

// DELETE - Remove meal item
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await params;

    // Get item with meal log to verify ownership
    const item = await prisma.userMealLogItem.findUnique({
      where: { id: itemId },
      include: {
        userMealLog: true,
      },
    });

    if (!item || item.userMealLog.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const mealLogId = item.userMealLogId;

    // Delete the item
    await prisma.userMealLogItem.delete({
      where: { id: itemId },
    });

    // Recalculate meal log totals
    const remainingItems = await prisma.userMealLogItem.findMany({
      where: { userMealLogId: mealLogId },
    });

    const totals = remainingItems.reduce(
      (acc, i) => ({
        totalCalories: acc.totalCalories + i.calories,
        totalProtein: acc.totalProtein + i.protein,
        totalCarbs: acc.totalCarbs + i.carbs,
        totalFat: acc.totalFat + i.fat,
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting meal item:", error);
    return NextResponse.json(
      { error: "Failed to delete meal item" },
      { status: 500 }
    );
  }
}
