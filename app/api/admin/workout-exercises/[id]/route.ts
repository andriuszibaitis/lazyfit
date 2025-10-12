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

    const { id } = await params;

    const workoutExercise = await prisma.workoutExercise.findUnique({
      where: {
        id,
      },
      include: {
        exercise: true,
      },
    });

    if (!workoutExercise) {
      return NextResponse.json(
        { error: "Workout exercise not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ workoutExercise });
  } catch (error) {
    console.error("Error fetching workout exercise:", error);
    return NextResponse.json(
      { error: "Failed to fetch workout exercise" },
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

    const { id } = await params;
    const body = await request.json();
    const {
      sets,
      reps,
      restTime,
      tempo,
      supersetGroup,
      supersetOrder,
      notes,
      order,
    } = body;

    const parsedSets = sets
      ? typeof sets === "string"
        ? Number.parseInt(sets, 10)
        : sets
      : null;

    const parsedRestTime = restTime
      ? typeof restTime === "string"
        ? Number.parseInt(restTime, 10)
        : restTime
      : null;

    const parsedSupersetOrder = supersetOrder
      ? typeof supersetOrder === "string"
        ? Number.parseInt(supersetOrder, 10)
        : supersetOrder
      : null;

    const parsedOrder = order
      ? typeof order === "string"
        ? Number.parseInt(order, 10)
        : order
      : null;

    const workoutExercise = await prisma.workoutExercise.update({
      where: {
        id,
      },
      data: {
        sets: parsedSets,
        reps: reps || null,
        restTime: parsedRestTime,
        tempo: tempo || null,
        supersetGroup: supersetGroup || null,
        supersetOrder: parsedSupersetOrder,
        notes: notes || null,
        order: parsedOrder,
      },
      include: {
        exercise: true,
      },
    });

    return NextResponse.json({ workoutExercise });
  } catch (error) {
    console.error("Error updating workout exercise:", error);
    return NextResponse.json(
      { error: "Failed to update workout exercise" },
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

    const { id } = await params;

    const workoutExercise = await prisma.workoutExercise.findUnique({
      where: {
        id,
      },
      include: {
        workout: {
          include: {
            programWorkouts: true,
          },
        },
      },
    });

    if (!workoutExercise) {
      return NextResponse.json(
        { error: "Workout exercise not found" },
        { status: 404 }
      );
    }

    const workoutToUse = workoutExercise.workout;

    if (
      workoutExercise.workout.programWorkouts.length > 1 &&
      !workoutExercise.workout.isCopy
    ) {
      const workoutCopy = await prisma.workout.create({
        data: {
          name: workoutExercise.workout.name,
          description: workoutExercise.workout.description,
          duration: workoutExercise.workout.duration,
          difficulty: workoutExercise.workout.difficulty,
          targetMuscleGroups: workoutExercise.workout.targetMuscleGroups,
          equipment: workoutExercise.workout.equipment,
          imageUrl: workoutExercise.workout.imageUrl,
          videoUrl: workoutExercise.workout.videoUrl,
          isPublished: false,
          isCopy: true,
          originalWorkoutId: workoutExercise.workout.id,
        },
      });

      const existingExercises = await prisma.workoutExercise.findMany({
        where: {
          workoutId: workoutExercise.workout.id,
          id: {
            not: id,
          },
        },
      });

      if (existingExercises.length > 0) {
        await prisma.workoutExercise.createMany({
          data: existingExercises.map((we) => ({
            workoutId: workoutCopy.id,
            exerciseId: we.exerciseId,
            order: we.order,
            sets: we.sets,
            reps: we.reps,
            restTime: we.restTime,
            tempo: we.tempo,
            supersetGroup: we.supersetGroup,
            supersetOrder: we.supersetOrder,
            notes: we.notes,
          })),
        });
      }

      if (workoutExercise.workout.programWorkouts.length > 0) {
        await prisma.programWorkout.update({
          where: {
            id: workoutExercise.workout.programWorkouts[0].id,
          },
          data: {
            workoutId: workoutCopy.id,
          },
        });
      }

      return NextResponse.json({ success: true });
    }

    await prisma.workoutExercise.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting workout exercise:", error);
    return NextResponse.json(
      { error: "Failed to delete workout exercise" },
      { status: 500 }
    );
  }
}
