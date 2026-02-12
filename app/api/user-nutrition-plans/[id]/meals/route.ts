import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: planId } = await params;
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return NextResponse.json(
        { error: "Date parameter is required" },
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

    // Parse date as UTC to avoid timezone issues
    const [year, month, day] = dateParam.split('-').map(Number);
    const parsedDate = new Date(Date.UTC(year, month - 1, day));

    // Get meals for this date
    const meals = await prisma.userMealLog.findMany({
      where: {
        userNutritionPlanId: planId,
        userId: session.user.id,
        date: parsedDate,
      },
      orderBy: {
        mealOrder: "asc",
      },
      select: {
        id: true,
        mealName: true,
        mealOrder: true,
      },
    });

    return NextResponse.json(meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
    return NextResponse.json(
      { error: "Failed to fetch meals" },
      { status: 500 }
    );
  }
}
