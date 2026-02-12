import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/lib/auth-options";
import {
  generateAuthenticatedEmbedUrl,
  generateAuthenticatedThumbnailUrl,
  isBunnyUrl,
} from "@/lib/bunny";

const prisma = new PrismaClient();

function addThumbnailUrls(workout: any) {
  if (!workout) return workout;

  try {
    // Pridėti thumbnail pagrindiniam video
    if (workout.videoUrl && isBunnyUrl(workout.videoUrl)) {
      workout.thumbnailUrl = generateAuthenticatedThumbnailUrl(workout.videoUrl);
    }

    // Pridėti thumbnails pratimų video
    if (workout.workoutExercises && Array.isArray(workout.workoutExercises)) {
      workout.workoutExercises = workout.workoutExercises.map((ex: any) => {
        if (ex.exercise?.videoUrl && isBunnyUrl(ex.exercise.videoUrl)) {
          ex.exercise.thumbnailUrl = generateAuthenticatedThumbnailUrl(
            ex.exercise.videoUrl
          );
        }
        return ex;
      });
    }

    return workout;
  } catch (error) {
    console.error("[WORKOUT_API] Klaida pridedant thumbnails:", error);
    return workout;
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("Fetching workout with ID:", id);

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workout = await prisma.workout.findUnique({
      where: { id: id },
      include: {
        membership: {
          select: {
            id: true,
            name: true,
            planId: true,
          },
        },
        workoutExercises: {
          orderBy: { order: "asc" },
          include: {
            exercise: true,
          },
        },
      },
    });

    if (!workout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    // Tikrinti ar vartotojas turi prieigą
    const hasAccess =
      !workout.membershipId ||
      workout.membershipId === "" ||
      (session.user.membershipStatus === "active" &&
        session.user.membershipId === workout.membershipId);

    if (hasAccess) {
      // Autentifikuoti video URLs
      const authenticatedWorkout = { ...workout };

      if (authenticatedWorkout.videoUrl && isBunnyUrl(authenticatedWorkout.videoUrl)) {
        authenticatedWorkout.videoUrl = generateAuthenticatedEmbedUrl(
          authenticatedWorkout.videoUrl,
          { autoplay: false, responsive: true }
        );
      }

      authenticatedWorkout.workoutExercises = authenticatedWorkout.workoutExercises.map(
        (ex: any) => {
          if (ex.exercise?.videoUrl && isBunnyUrl(ex.exercise.videoUrl)) {
            return {
              ...ex,
              exercise: {
                ...ex.exercise,
                videoUrl: generateAuthenticatedEmbedUrl(ex.exercise.videoUrl, {
                  autoplay: false,
                  responsive: true,
                }),
              },
            };
          }
          return ex;
        }
      );

      // Pridėti thumbnails
      const workoutWithThumbnails = addThumbnailUrls(authenticatedWorkout);

      return NextResponse.json(workoutWithThumbnails);
    } else {
      // Vartotojas neturi prieigos - grąžinti apribotus duomenis
      const restrictedWorkout = {
        ...workout,
        videoUrl: workout.videoUrl ? "restricted" : null,
        workoutExercises: workout.workoutExercises.map((ex) => ({
          ...ex,
          exercise: {
            ...ex.exercise,
            videoUrl: ex.exercise.videoUrl ? "restricted" : null,
          },
        })),
      };

      return NextResponse.json(restrictedWorkout);
    }
  } catch (error) {
    console.error("[WORKOUT_API] Klaida:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
