import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;

    const nutritionPlan = await prisma.nutritionPlan.findUnique({
      where: {
        id,
      },
      include: {
        membership: true,
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
    console.error("Error fetching nutrition plan:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;
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

    const existingPlan = await prisma.nutritionPlan.findUnique({
      where: { id },
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

    if (!existingPlan) {
      return new NextResponse("Nutrition plan not found", { status: 404 });
    }

    const updatedPlan = await prisma.nutritionPlan.update({
      where: { id },
      data: {
        name,
        description,
        gender: gender || "all",
        membershipId: membershipId || null,
        imageUrl,
        videoUrl,
        isPublished: isPublished || false,
        updatedBy: session.user.id,
      },
    });

    for (const day of existingPlan.days) {
      for (const meal of day.meals) {
        await prisma.nutritionPlanMealItem.deleteMany({
          where: { mealId: meal.id },
        });
      }
      await prisma.nutritionPlanMeal.deleteMany({
        where: { dayId: day.id },
      });
    }
    await prisma.nutritionPlanDay.deleteMany({
      where: { nutritionPlanId: id },
    });

    if (days && days.length > 0) {
      for (const day of days) {
        const createdDay = await prisma.nutritionPlanDay.create({
          data: {
            dayNumber: day.dayNumber,
            nutritionPlanId: id,
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

    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.error("Error updating nutrition plan:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;

    const existingPlan = await prisma.nutritionPlan.findUnique({
      where: { id },
    });

    if (!existingPlan) {
      return new NextResponse("Nutrition plan not found", { status: 404 });
    }

    await prisma.nutritionPlan.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting nutrition plan:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
