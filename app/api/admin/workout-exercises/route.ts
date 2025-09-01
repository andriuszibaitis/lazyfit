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
    const workoutId = searchParams.get("workoutId");

    if (!workoutId) {
      return NextResponse.json(
        { error: "Workout ID is required" },
        { status: 400 }
      );
    }

    const workoutExercises = await prisma.workoutExercise.findMany({
      where: {
        workoutId: workoutId,
      },
      include: {
        exercise: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json({ workoutExercises });
  } catch (error) {
    console.error("Error fetching workout exercises:", error);
    return NextResponse.json(
      { error: "Failed to fetch workout exercises" },
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
    const {
      workoutId,
      exerciseId,
      order,
      sets,
      reps,
      restTime,
      tempo,
      supersetGroup,
      supersetOrder,
      notes,
    } = body;

    if (!workoutId || !exerciseId) {
      return NextResponse.json(
        { error: "Workout ID and Exercise ID are required" },
        { status: 400 }
      );
    }

    const workout = await prisma.workout.findUnique({
      where: {
        id: workoutId,
      },
      include: {
        programWorkouts: true,
      },
    });

    if (!workout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    const exercise = await prisma.exercise.findUnique({
      where: {
        id: exerciseId,
      },
    });

    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    let workoutToUse = workout;

    if (workout.programWorkouts.length > 1 && !workout.isCopy) {
      const workoutCopy = await prisma.workout.create({
        data: {
          name: workout.name,
          description: workout.description,
          duration: workout.duration,
          difficulty: workout.difficulty,
          targetMuscleGroups: workout.targetMuscleGroups,
          equipment: workout.equipment,
          imageUrl: workout.imageUrl,
          videoUrl: workout.videoUrl,
          isPublished: false,
          isCopy: true,
          originalWorkoutId: workout.id,
        },
      });

      const existingExercises = await prisma.workoutExercise.findMany({
        where: {
          workoutId: workout.id,
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

      if (workout.programWorkouts.length > 0) {
        await prisma.programWorkout.update({
          where: {
            id: workout.programWorkouts[0].id,
          },
          data: {
            workoutId: workoutCopy.id,
          },
        });
      }

      workoutToUse = workoutCopy;
    }

    const parsedSupersetOrder = supersetOrder
      ? typeof supersetOrder === "string"
        ? Number.parseInt(supersetOrder, 10)
        : supersetOrder
      : null;

    const existingWorkoutExercise = await prisma.workoutExercise.findFirst({
      where: {
        workoutId: workoutToUse.id,
        exerciseId,
        supersetGroup,
        supersetOrder: parsedSupersetOrder,
      },
    });

    if (existingWorkoutExercise) {
      return NextResponse.json(
        {
          error:
            "This exercise is already in the workout with the same superset configuration",
        },
        { status: 400 }
      );
    }

    const highestOrder = await prisma.workoutExercise.findFirst({
      where: {
        workoutId: workoutToUse.id,
      },
      orderBy: {
        order: "desc",
      },
    });

    const newOrder = order
      ? typeof order === "string"
        ? Number.parseInt(order, 10)
        : order
      : highestOrder
      ? highestOrder.order + 1
      : 0;

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

    const workoutExercise = await prisma.workoutExercise.create({
      data: {
        workoutId: workoutToUse.id,
        exerciseId,
        order: newOrder,
        sets: parsedSets,
        reps: reps || null,
        restTime: parsedRestTime,
        tempo: tempo || null,
        supersetGroup: supersetGroup || null,
        supersetOrder: parsedSupersetOrder,
        notes: notes || null,
      },
      include: {
        exercise: true,
      },
    });

    return NextResponse.json({ workoutExercise });
  } catch (error) {
    console.error("Error adding exercise to workout:", error);
    return NextResponse.json(
      { error: "Failed to add exercise to workout" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      workoutId,
      sets,
      reps,
      restTime,
      tempo,
      supersetGroup,
      supersetOrder,
      notes,
      order,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Exercise ID is required" },
        { status: 400 }
      );
    }

    const currentExercise = await prisma.workoutExercise.findUnique({
      where: { id },
      include: {
        workout: {
          include: {
            programWorkouts: true,
          },
        },
      },
    });

    if (!currentExercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    let workoutToUse = currentExercise.workout;
    let exerciseToUpdate = id;

    if (
      currentExercise.workout.programWorkouts.length > 1 &&
      !currentExercise.workout.isCopy
    ) {
      const workoutCopy = await prisma.workout.create({
        data: {
          name: currentExercise.workout.name,
          description: currentExercise.workout.description,
          duration: currentExercise.workout.duration,
          difficulty: currentExercise.workout.difficulty,
          targetMuscleGroups: currentExercise.workout.targetMuscleGroups,
          equipment: currentExercise.workout.equipment,
          imageUrl: currentExercise.workout.imageUrl,
          videoUrl: currentExercise.workout.videoUrl,
          isPublished: false,
          isCopy: true,
          originalWorkoutId: currentExercise.workout.id,
        },
      });

      const existingExercises = await prisma.workoutExercise.findMany({
        where: {
          workoutId: currentExercise.workout.id,
        },
        include: {
          exercise: true,
        },
      });

      for (const exercise of existingExercises) {
        const newExercise = await prisma.workoutExercise.create({
          data: {
            workoutId: workoutCopy.id,
            exerciseId: exercise.exerciseId,
            order: exercise.order,
            sets: exercise.sets,
            reps: exercise.reps,
            restTime: exercise.restTime,
            tempo: exercise.tempo,
            supersetGroup: exercise.supersetGroup,
            supersetOrder: exercise.supersetOrder,
            notes: exercise.notes,
          },
        });

        if (exercise.id === id) {
          exerciseToUpdate = newExercise.id;
        }
      }

      if (currentExercise.workout.programWorkouts.length > 0) {
        await prisma.programWorkout.update({
          where: {
            id: currentExercise.workout.programWorkouts[0].id,
          },
          data: {
            workoutId: workoutCopy.id,
          },
        });
      }

      workoutToUse = workoutCopy;
    }

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

    const updatedExercise = await prisma.workoutExercise.update({
      where: {
        id: exerciseToUpdate,
      },
      data: {
        sets: parsedSets,
        reps: reps !== undefined ? reps : undefined,
        restTime: parsedRestTime,
        tempo: tempo !== undefined ? tempo : undefined,
        supersetGroup: supersetGroup !== undefined ? supersetGroup : undefined,
        supersetOrder: parsedSupersetOrder,
        notes: notes !== undefined ? notes : undefined,
        order: parsedOrder,
      },
      include: {
        exercise: true,
      },
    });

    return NextResponse.json({ workoutExercise: updatedExercise });
  } catch (error) {
    console.error("Error updating workout exercise:", error);
    return NextResponse.json(
      { error: "Failed to update workout exercise" },
      { status: 500 }
    );
  }
}
