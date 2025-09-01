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
    const programId = searchParams.get("programId");

    if (!programId) {
      return NextResponse.json(
        { error: "Program ID is required" },
        { status: 400 }
      );
    }

    const periods = await prisma.programPeriod.findMany({
      where: {
        programId: programId,
      },
      orderBy: {
        startWeek: "asc",
      },
    });

    return NextResponse.json({ periods });
  } catch (error) {
    console.error("Error fetching program periods:", error);
    return NextResponse.json(
      { error: "Failed to fetch program periods" },
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
    const { programId, name, description, startWeek, endWeek } = body;

    if (!programId || !name || !startWeek || !endWeek) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (Number(startWeek) > Number(endWeek)) {
      return NextResponse.json(
        { error: "Start week must be less than or equal to end week" },
        { status: 400 }
      );
    }

    const program = await prisma.trainingProgram.findUnique({
      where: {
        id: programId,
      },
    });

    if (!program) {
      return NextResponse.json(
        { error: "Training program not found" },
        { status: 404 }
      );
    }

    const existingPeriods = await prisma.programPeriod.findMany({
      where: {
        programId,
      },
    });

    const hasOverlap = existingPeriods.some(
      (period) =>
        (Number(startWeek) >= period.startWeek &&
          Number(startWeek) <= period.endWeek) ||
        (Number(endWeek) >= period.startWeek &&
          Number(endWeek) <= period.endWeek) ||
        (Number(startWeek) <= period.startWeek &&
          Number(endWeek) >= period.endWeek)
    );

    if (hasOverlap) {
      return NextResponse.json(
        {
          error:
            "This period overlaps with an existing period. Please choose different weeks.",
        },
        { status: 400 }
      );
    }

    const highestOrder = await prisma.programPeriod.findFirst({
      where: {
        programId,
      },
      orderBy: {
        order: "desc",
      },
    });

    const newOrder = highestOrder ? highestOrder.order + 1 : 0;

    const period = await prisma.programPeriod.create({
      data: {
        programId,
        name,
        description,
        startWeek: Number(startWeek),
        endWeek: Number(endWeek),
        order: newOrder,
      },
    });

    const weekStructures = [];
    for (
      let weekNumber = Number(startWeek);
      weekNumber <= Number(endWeek);
      weekNumber++
    ) {
      weekStructures.push({
        periodId: period.id,
        weekNumber,
        isCompleted: false,
      });
    }

    if (weekStructures.length > 0) {
      await prisma.periodWeek.createMany({
        data: weekStructures,
      });
    }

    return NextResponse.json({ period });
  } catch (error) {
    console.error("Error creating program period:", error);
    return NextResponse.json(
      { error: "Failed to create program period" },
      { status: 500 }
    );
  }
}
