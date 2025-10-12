import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const exercise = await prisma.exercise.findUnique({
      where: { id: (await params).id },
      include: {
        workoutExercises: {
          include: {
            workout: true,
          },
        },
      },
    });

    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ exercise });
  } catch (error) {
    console.error("Error fetching exercise:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercise" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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
      muscleGroup,
      secondaryMuscleGroups,
      equipment,
      difficulty,
      instructions,
      tips,
      imageUrl,
      videoUrl,
      isPublished,
    } = body;

    const exercise = await prisma.exercise.update({
      where: { id: (await params).id },
      data: {
        name,
        description,
        muscleGroup,
        secondaryMuscleGroups: secondaryMuscleGroups || [],
        equipment,
        difficulty: difficulty || "medium",
        instructions: instructions || [],
        tips: tips || [],
        imageUrl,
        videoUrl,
        isPublished: isPublished || false,
        updatedBy: session.user.email || undefined,
      },
    });

    return NextResponse.json({ exercise });
  } catch (error) {
    console.error("Error updating exercise:", error);
    return NextResponse.json(
      { error: "Failed to update exercise" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.workoutExercise.deleteMany({
      where: { exerciseId: (await params).id },
    });

    await prisma.exercise.delete({
      where: { id: (await params).id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting exercise:", error);
    return NextResponse.json(
      { error: "Failed to delete exercise" },
      { status: 500 }
    );
  }
}
