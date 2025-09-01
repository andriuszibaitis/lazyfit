import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = new URL(request.url).searchParams;
    const periodId = searchParams.get("periodId");

    if (!periodId) {
      return NextResponse.json(
        { error: "Period ID is required" },
        { status: 400 }
      );
    }

    const weeks = await prisma.periodWeek.findMany({
      where: {
        periodId: periodId,
      },
      orderBy: {
        weekNumber: "asc",
      },
    });

    return NextResponse.json({ weeks });
  } catch (error) {
    console.error("Error fetching period weeks:", error);
    return NextResponse.json(
      { error: "Failed to fetch period weeks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { periodId, weekNumber, isCompleted } = body;

    if (!periodId || !weekNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const period = await prisma.programPeriod.findUnique({
      where: {
        id: periodId,
      },
    });

    if (!period) {
      return NextResponse.json(
        { error: "Program period not found" },
        { status: 404 }
      );
    }

    const existingWeek = await prisma.periodWeek.findFirst({
      where: {
        periodId,
        weekNumber: Number(weekNumber),
      },
    });

    if (existingWeek) {
      return NextResponse.json(
        { error: "Week already exists for this period" },
        { status: 400 }
      );
    }

    const week = await prisma.periodWeek.create({
      data: {
        periodId,
        weekNumber: Number(weekNumber),
        isCompleted: isCompleted || false,
      },
    });

    return NextResponse.json({ week });
  } catch (error) {
    console.error("Error creating period week:", error);
    return NextResponse.json(
      { error: "Failed to create period week" },
      { status: 500 }
    );
  }
}
