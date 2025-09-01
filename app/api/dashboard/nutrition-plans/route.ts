import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userPlans = await prisma.nutritionPlan.findMany({
      where: {
        createdBy: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const publishedPlans = await prisma.nutritionPlan.findMany({
      where: {
        isPublished: true,
        OR: [{ membershipId: null }, { membershipId: session.user.planId }],
        NOT: {
          createdBy: session.user.id,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json([...userPlans, ...publishedPlans]);
  } catch (error) {
    console.error("[NUTRITION_PLANS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, description, days } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!days || !Array.isArray(days) || days.length === 0) {
      return new NextResponse("At least one day is required", { status: 400 });
    }

    const nutritionPlan = await prisma.nutritionPlan.create({
      data: {
        name,
        description: description || "",
        createdBy: session.user.id,
        isPublished: false,
        days: {
          create: days.map((day: any) => ({
            dayNumber: day.dayNumber,
            meals: {
              create: day.meals.map((meal: any) => ({
                mealNumber: meal.mealNumber,
                name: meal.name,
                items: {
                  create: meal.items.map((item: any) => ({
                    foodProductId: item.foodProductId,
                    foodProductName: item.foodProductName,
                    quantity: item.quantity,
                    calories: item.calories,
                    protein: item.protein,
                    carbs: item.carbs,
                    fat: item.fat,
                  })),
                },
              })),
            },
          })),
        },
      },
    });

    return NextResponse.json(nutritionPlan);
  } catch (error) {
    console.error("[NUTRITION_PLANS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
