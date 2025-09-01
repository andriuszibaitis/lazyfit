import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";

    const plans = await prisma.nutritionPlan.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      include: {
        membership: {
          select: {
            name: true,
          },
        },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching nutrition plans:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      gender,
      membershipId,
      imageUrl,
      videoUrl,
      isPublished,
      days,
    } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const nutritionPlan = await prisma.nutritionPlan.create({
      data: {
        name,
        description,
        gender: gender || "all",
        membershipId: membershipId || null,
        imageUrl,
        videoUrl,
        isPublished: isPublished || false,
        createdBy: session.user.id,
        updatedBy: session.user.id,
      },
    });

    if (days && days.length > 0) {
      for (const day of days) {
        const createdDay = await prisma.nutritionPlanDay.create({
          data: {
            dayNumber: day.dayNumber,
            nutritionPlanId: nutritionPlan.id,
          },
        });

        if (day.meals && day.meals.length > 0) {
          for (const meal of day.meals) {
            const createdMeal = await prisma.nutritionPlanMeal.create({
              data: {
                mealNumber: meal.mealNumber,
                name: meal.name,
                dayId: createdDay.id,
              },
            });

            if (meal.items && meal.items.length > 0) {
              for (const item of meal.items) {
                await prisma.nutritionPlanMealItem.create({
                  data: {
                    foodProductId: item.foodProductId,
                    foodProductName: item.foodProductName,
                    quantity: item.quantity,
                    calories: item.calories,
                    protein: item.protein,
                    carbs: item.carbs,
                    fat: item.fat,
                    mealId: createdMeal.id,
                  },
                });
              }
            }
          }
        }
      }
    }

    return NextResponse.json(nutritionPlan);
  } catch (error) {
    console.error("Error creating nutrition plan:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
