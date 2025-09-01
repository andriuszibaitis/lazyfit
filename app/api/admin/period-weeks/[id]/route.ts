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

    const weekId = params.id;

    const week = await prisma.periodWeek.findUnique({
      where: {
        id: weekId,
      },
    });

    if (!week) {
      return NextResponse.json(
        { error: "Period week not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ week });
  } catch (error) {
    console.error("Error fetching period week:", error);
    return NextResponse.json(
      { error: "Failed to fetch period week" },
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

    const weekId = params.id;
    const body = await request.json();
    const { weekNumber, isCompleted } = body;

    const currentWeek = await prisma.periodWeek.findUnique({
      where: {
        id: weekId,
      },
    });

    if (!currentWeek) {
      return NextResponse.json(
        { error: "Period week not found" },
        { status: 404 }
      );
    }

    if (weekNumber && Number(weekNumber) !== currentWeek.weekNumber) {
      const existingWeek = await prisma.periodWeek.findFirst({
        where: {
          periodId: currentWeek.periodId,
          weekNumber: Number(weekNumber),
          id: {
            not: weekId,
          },
        },
      });

      if (existingWeek) {
        return NextResponse.json(
          { error: "Week number already exists for this period" },
          { status: 400 }
        );
      }
    }

    const updatedWeek = await prisma.periodWeek.update({
      where: {
        id: weekId,
      },
      data: {
        weekNumber: weekNumber !== undefined ? Number(weekNumber) : undefined,
        isCompleted: isCompleted !== undefined ? isCompleted : undefined,
      },
    });

    return NextResponse.json({ week: updatedWeek });
  } catch (error) {
    console.error("Error updating period week:", error);
    return NextResponse.json(
      { error: "Failed to update period week" },
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

    const weekId = params.id;

    await prisma.periodWeek.delete({
      where: {
        id: weekId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting period week:", error);
    return NextResponse.json(
      { error: "Failed to delete period week" },
      { status: 500 }
    );
  }
}
