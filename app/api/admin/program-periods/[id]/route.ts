import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const periodId = params.id;

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

    return NextResponse.json({ period });
  } catch (error) {
    console.error("Error fetching program period:", error);
    return NextResponse.json(
      { error: "Failed to fetch program period" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const periodId = params.id;
    const body = await request.json();
    const { name, description, startWeek, endWeek, order } = body;

    if (startWeek && endWeek && Number(startWeek) > Number(endWeek)) {
      return NextResponse.json(
        { error: "Start week must be less than or equal to end week" },
        { status: 400 }
      );
    }

    const currentPeriod = await prisma.programPeriod.findUnique({
      where: {
        id: periodId,
      },
    });

    if (!currentPeriod) {
      return NextResponse.json(
        { error: "Program period not found" },
        { status: 404 }
      );
    }

    if (startWeek || endWeek) {
      const newStartWeek = startWeek
        ? Number(startWeek)
        : currentPeriod.startWeek;
      const newEndWeek = endWeek ? Number(endWeek) : currentPeriod.endWeek;

      const existingPeriods = await prisma.programPeriod.findMany({
        where: {
          programId: currentPeriod.programId,
          id: {
            not: periodId,
          },
        },
      });

      const hasOverlap = existingPeriods.some(
        (period) =>
          (newStartWeek >= period.startWeek &&
            newStartWeek <= period.endWeek) ||
          (newEndWeek >= period.startWeek && newEndWeek <= period.endWeek) ||
          (newStartWeek <= period.startWeek && newEndWeek >= period.endWeek)
      );

      if (hasOverlap) {
        return NextResponse.json(
          {
            error:
              "This period would overlap with an existing period. Please choose different weeks.",
          },
          { status: 400 }
        );
      }
    }

    const updatedPeriod = await prisma.programPeriod.update({
      where: {
        id: periodId,
      },
      data: {
        name: name !== undefined ? name : undefined,
        description: description !== undefined ? description : undefined,
        startWeek: startWeek !== undefined ? Number(startWeek) : undefined,
        endWeek: endWeek !== undefined ? Number(endWeek) : undefined,
        order: order !== undefined ? Number(order) : undefined,
      },
    });

    if (
      (startWeek && Number(startWeek) !== currentPeriod.startWeek) ||
      (endWeek && Number(endWeek) !== currentPeriod.endWeek)
    ) {
      await prisma.periodWeek.deleteMany({
        where: {
          periodId,
        },
      });

      const newStartWeek = startWeek
        ? Number(startWeek)
        : currentPeriod.startWeek;
      const newEndWeek = endWeek ? Number(endWeek) : currentPeriod.endWeek;

      const weekStructures = [];
      for (
        let weekNumber = newStartWeek;
        weekNumber <= newEndWeek;
        weekNumber++
      ) {
        weekStructures.push({
          periodId,
          weekNumber,
          isCompleted: false,
        });
      }

      if (weekStructures.length > 0) {
        await prisma.periodWeek.createMany({
          data: weekStructures,
        });
      }
    }

    return NextResponse.json({ period: updatedPeriod });
  } catch (error) {
    console.error("Error updating program period:", error);
    return NextResponse.json(
      { error: "Failed to update program period" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const periodId = params.id;

    await prisma.periodWeek.deleteMany({
      where: {
        periodId,
      },
    });

    await prisma.programPeriod.delete({
      where: {
        id: periodId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting program period:", error);
    return NextResponse.json(
      { error: "Failed to delete program period" },
      { status: 500 }
    );
  }
}
