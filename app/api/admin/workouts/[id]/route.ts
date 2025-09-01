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

    const id = params.id;

    const workout = await prisma.workout.findUnique({
      where: { id },
      include: {
        membership: {
          select: {
            name: true,
            planId: true,
          },
        },
        workoutExercises: {
          include: {
            exercise: true,
          },
          orderBy: { order: "asc" },
        },
        programWorkouts: {
          include: {
            program: true,
          },
        },
      },
    });

    if (!workout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    return NextResponse.json({ workout });
  } catch (error) {
    console.error("Error fetching workout:", error);
    return NextResponse.json(
      { error: "Failed to fetch workout" },
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

    const body = await request.json();
    const {
      name,
      description,
      duration,
      difficulty,
      targetMuscleGroups,
      equipment,
      imageUrl,
      videoUrl,
      isPublished,
      membershipId,
    } = body;

    const id = params.id;

    const workout = await prisma.workout.update({
      where: { id },
      data: {
        name,
        description,
        duration: duration ? Number.parseInt(duration) : null,
        difficulty: difficulty || "medium",
        targetMuscleGroups: targetMuscleGroups || [],
        equipment: equipment || [],
        imageUrl,
        videoUrl,
        isPublished: isPublished || false,
        membershipId:
          membershipId === "all" || !membershipId ? null : membershipId,
        updatedBy: session.user.email || undefined,
      },
    });

    return NextResponse.json({ workout });
  } catch (error) {
    console.error("Error updating workout:", error);
    return NextResponse.json(
      { error: "Failed to update workout" },
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

    const id = params.id;

    await prisma.workoutExercise.deleteMany({
      where: { workoutId: id },
    });

    await prisma.programWorkout.deleteMany({
      where: { workoutId: id },
    });

    await prisma.workout.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting workout:", error);
    return NextResponse.json(
      { error: "Failed to delete workout" },
      { status: 500 }
    );
  }
}
