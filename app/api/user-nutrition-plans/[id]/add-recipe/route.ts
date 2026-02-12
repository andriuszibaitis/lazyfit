import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: planId } = await params;
    const body = await request.json();
    const { recipeId, date, mealName } = body;

    if (!recipeId || !date || !mealName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the plan belongs to the user
    const plan = await prisma.userNutritionPlan.findFirst({
      where: {
        id: planId,
        userId: session.user.id,
      },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    // Fetch recipe with ingredients
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        ingredients: {
          include: {
            foodProduct: true,
          },
        },
      },
    });

    if (!recipe) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      );
    }

    const servings = recipe.servings || 1;
    // Parse date as UTC to avoid timezone issues
    const [year, month, day] = date.split('-').map(Number);
    const parsedDate = new Date(Date.UTC(year, month - 1, day));

    // Find or create the meal log for this date and meal name
    let mealLog = await prisma.userMealLog.findFirst({
      where: {
        userId: session.user.id,
        userNutritionPlanId: planId,
        date: parsedDate,
        mealName: mealName,
      },
    });

    if (!mealLog) {
      // Get meal order based on meal name
      const mealOrder = getMealOrder(mealName);

      mealLog = await prisma.userMealLog.create({
        data: {
          userId: session.user.id,
          userNutritionPlanId: planId,
          date: parsedDate,
          mealName: mealName,
          mealOrder: mealOrder,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
        },
      });
    }

    // Add each ingredient as a meal log item (for 1 serving)
    let addedCalories = 0;
    let addedProtein = 0;
    let addedCarbs = 0;
    let addedFat = 0;

    for (const ingredient of recipe.ingredients) {
      const product = ingredient.foodProduct;
      const quantity = Math.round((ingredient.quantity || 100) / servings);

      // Calculate macros based on quantity (assuming product values are per 100g)
      const multiplier = quantity / (product.serving || 100);
      const calories = (product.calories || 0) * multiplier;
      const protein = (product.protein || 0) * multiplier;
      const carbs = (product.carbs || 0) * multiplier;
      const fat = (product.fat || 0) * multiplier;

      await prisma.userMealLogItem.create({
        data: {
          userMealLogId: mealLog.id,
          foodProductId: product.id,
          foodProductName: product.name,
          quantity: quantity,
          unit: product.servingUnit || "g",
          calories: calories,
          protein: protein,
          carbs: carbs,
          fat: fat,
        },
      });

      addedCalories += calories;
      addedProtein += protein;
      addedCarbs += carbs;
      addedFat += fat;
    }

    // Update meal log totals
    await prisma.userMealLog.update({
      where: { id: mealLog.id },
      data: {
        totalCalories: { increment: addedCalories },
        totalProtein: { increment: addedProtein },
        totalCarbs: { increment: addedCarbs },
        totalFat: { increment: addedFat },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding recipe to plan:", error);
    return NextResponse.json(
      { error: "Failed to add recipe to plan" },
      { status: 500 }
    );
  }
}

function getMealOrder(mealName: string): number {
  const orders: Record<string, number> = {
    "Pusryčiai": 0,
    "Pietūs": 1,
    "Vakarienė": 2,
    "Užkandis": 3,
    "Užkandis 2": 4,
  };
  return orders[mealName] ?? 5;
}
