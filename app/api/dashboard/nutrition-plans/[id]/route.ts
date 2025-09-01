import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;

    const nutritionPlan = await prisma.nutritionPlan.findUnique({
      where: {
        id,
        OR: [
          { createdBy: session.user.id },

          {
            isPublished: true,
            OR: [{ membershipId: null }, { membershipId: session.user.planId }],
          },
        ],
      },
      include: {
        days: {
          orderBy: {
            dayNumber: "asc",
          },
          include: {
            meals: {
              orderBy: {
                mealNumber: "asc",
              },
              include: {
                items: true,
              },
            },
          },
        },
      },
    });

    if (!nutritionPlan) {
      return new NextResponse("Nutrition plan not found", { status: 404 });
    }

    return NextResponse.json(nutritionPlan);
  } catch (error) {
    console.error("[NUTRITION_PLAN_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { name, description, days } = body;

    const existingPlan = await prisma.nutritionPlan.findUnique({
      where: {
        id,
        createdBy: session.user.id,
      },
    });

    if (!existingPlan) {
      return new NextResponse("Nutrition plan not found or not owned by user", {
        status: 404,
      });
    }

    await prisma.$transaction([
      prisma.nutritionPlanMealItem.deleteMany({
        where: {
          meal: {
            day: {
              nutritionPlanId: id,
            },
          },
        },
      }),
      prisma.nutritionPlanMeal.deleteMany({
        where: {
          day: {
            nutritionPlanId: id,
          },
        },
      }),
      prisma.nutritionPlanDay.deleteMany({
        where: {
          nutritionPlanId: id,
        },
      }),
    ]);

    const updatedPlan = await prisma.nutritionPlan.update({
      where: {
        id,
      },
      data: {
        name,
        description: description || "",
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
      include: {
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
    });

    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.error("[NUTRITION_PLAN_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;

    const existingPlan = await prisma.nutritionPlan.findUnique({
      where: {
        id,
        createdBy: session.user.id,
      },
    });

    if (!existingPlan) {
      return new NextResponse("Nutrition plan not found or not owned by user", {
        status: 404,
      });
    }

    await prisma.$transaction([
      prisma.nutritionPlanMealItem.deleteMany({
        where: {
          meal: {
            day: {
              nutritionPlanId: id,
            },
          },
        },
      }),
      prisma.nutritionPlanMeal.deleteMany({
        where: {
          day: {
            nutritionPlanId: id,
          },
        },
      }),
      prisma.nutritionPlanDay.deleteMany({
        where: {
          nutritionPlanId: id,
        },
      }),
      prisma.nutritionPlan.delete({
        where: {
          id,
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[NUTRITION_PLAN_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
