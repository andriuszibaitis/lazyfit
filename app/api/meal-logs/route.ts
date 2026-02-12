import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

// GET - Fetch meal logs for a date range
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const planId = searchParams.get("planId");

    if (!startDate || !endDate || !planId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Parse dates as UTC to avoid timezone issues
    const parseDate = (dateStr: string) => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(Date.UTC(year, month - 1, day));
    };

    const mealLogs = await prisma.userMealLog.findMany({
      where: {
        userId: session.user.id,
        userNutritionPlanId: planId,
        date: {
          gte: parseDate(startDate),
          lte: parseDate(endDate),
        },
      },
      include: {
        items: true,
      },
      orderBy: [
        { date: "asc" },
        { mealOrder: "asc" },
      ],
    });

    return NextResponse.json(mealLogs);
  } catch (error) {
    console.error("Error fetching meal logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch meal logs" },
      { status: 500 }
    );
  }
}

// POST - Create a new meal log
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userNutritionPlanId, date, mealName, mealOrder } = body;

    if (!userNutritionPlanId || !date || !mealName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Parse date as UTC to avoid timezone issues
    const [year, month, day] = date.split('-').map(Number);
    const parsedDate = new Date(Date.UTC(year, month - 1, day));

    // Check if meal log already exists
    const existingLog = await prisma.userMealLog.findUnique({
      where: {
        userId_userNutritionPlanId_date_mealName: {
          userId: session.user.id,
          userNutritionPlanId,
          date: parsedDate,
          mealName,
        },
      },
    });

    if (existingLog) {
      return NextResponse.json(existingLog);
    }

    const mealLog = await prisma.userMealLog.create({
      data: {
        userId: session.user.id,
        userNutritionPlanId,
        date: parsedDate,
        mealName,
        mealOrder: mealOrder || 0,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(mealLog, { status: 201 });
  } catch (error) {
    console.error("Error creating meal log:", error);
    return NextResponse.json(
      { error: "Failed to create meal log" },
      { status: 500 }
    );
  }
}
