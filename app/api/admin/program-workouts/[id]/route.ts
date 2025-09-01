import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { weekNumber, dayNumber, order } = body;

    const programWorkout = await prisma.programWorkout.update({
      where: { id: params.id },
      data: {
        weekNumber: weekNumber ? Number.parseInt(weekNumber) : undefined,
        dayNumber: dayNumber ? Number.parseInt(dayNumber) : undefined,
        order: order ? Number.parseInt(order) : undefined,
      },
    });

    return NextResponse.json({ programWorkout });
  } catch (error) {
    console.error("Error updating program workout:", error);
    return NextResponse.json(
      { error: "Failed to update program workout" },
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

    const programWorkout = await prisma.programWorkout.findUnique({
      where: { id: params.id },
      include: {
        workout: true,
      },
    });

    if (!programWorkout) {
      return NextResponse.json(
        { error: "Program workout not found" },
        { status: 404 }
      );
    }

    await prisma.programWorkout.delete({
      where: { id: params.id },
    });

    if (programWorkout.workout.name.includes("Kopija savaitės")) {
      await prisma.workoutExercise.deleteMany({
        where: { workoutId: programWorkout.workoutId },
      });

      await prisma.workout.delete({
        where: { id: programWorkout.workoutId },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing workout from program:", error);
    return NextResponse.json(
      { error: "Failed to remove workout from program" },
      { status: 500 }
    );
  }
}
