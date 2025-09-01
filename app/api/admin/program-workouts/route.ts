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

    const programWorkouts = await prisma.programWorkout.findMany({
      where: {
        programId: programId,
      },
      include: {
        workout: {
          include: {
            workoutExercises: {
              include: {
                exercise: true,
              },
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
      orderBy: [
        {
          weekNumber: "asc",
        },
        {
          dayNumber: "asc",
        },
        {
          order: "asc",
        },
      ],
    });

    return NextResponse.json({ programWorkouts });
  } catch (error) {
    console.error("Error fetching program workouts:", error);
    return NextResponse.json(
      { error: "Failed to fetch program workouts" },
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
      programId,
      periodId,
      workoutId,
      weekNumber,
      dayNumber,
      order,
      createCopy = true,
    } = body;

    if (!programId || !workoutId || !weekNumber || !dayNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    const workout = await prisma.workout.findUnique({
      where: {
        id: workoutId,
      },
      include: {
        workoutExercises: {
          include: {
            exercise: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!workout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    if (periodId) {
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

      if (period.programId !== programId) {
        return NextResponse.json(
          { error: "Period does not belong to this program" },
          { status: 400 }
        );
      }

      if (weekNumber < period.startWeek || weekNumber > period.endWeek) {
        return NextResponse.json(
          {
            error: `Week number must be between ${period.startWeek} and ${period.endWeek} for this period`,
          },
          { status: 400 }
        );
      }
    }

    let workoutToUse = workout;

    if (createCopy) {
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

      if (workout.workoutExercises && workout.workoutExercises.length > 0) {
        const exercisesToCreate = workout.workoutExercises.map((we) => ({
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
        }));

        await prisma.workoutExercise.createMany({
          data: exercisesToCreate,
        });
      }

      workoutToUse = await prisma.workout.findUnique({
        where: {
          id: workoutCopy.id,
        },
        include: {
          workoutExercises: {
            include: {
              exercise: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      });
    }

    const programWorkout = await prisma.programWorkout.create({
      data: {
        programId,
        periodId,
        workoutId: workoutToUse.id,
        weekNumber: Number(weekNumber),
        dayNumber: Number(dayNumber),
        order: order || 0,
      },
      include: {
        workout: {
          include: {
            workoutExercises: {
              include: {
                exercise: true,
              },
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ programWorkout });
  } catch (error) {
    console.error("Error creating program workout:", error);
    return NextResponse.json(
      { error: "Failed to create program workout" },
      { status: 500 }
    );
  }
}
