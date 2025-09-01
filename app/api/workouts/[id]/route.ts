import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/lib/auth-options";
import crypto from "crypto";

const prisma = new PrismaClient();

async function authenticateBunnyVideo(videoUrl: string) {
  if (!videoUrl || !process.env.BUNNY_STREAM_TOKEN) {
    console.log("Missing video URL or Bunny token:", {
      videoUrl,
      hasToken: !!process.env.BUNNY_STREAM_TOKEN,
    });
    return videoUrl;
  }

  try {
    console.log("Original video URL:", videoUrl);

    let videoId = "";
    let libraryId = "";

    if (videoUrl.includes("iframe.mediadelivery.net/play/")) {
      const parts = videoUrl.split("/play/")[1].split("/");
      if (parts.length >= 2) {
        libraryId = parts[0];
        videoId = parts[1].split("?")[0];
      }
    } else if (videoUrl.includes("iframe.mediadelivery.net/embed/")) {
      const parts = videoUrl.split("/embed/")[1].split("/");
      if (parts.length >= 2) {
        libraryId = parts[0];
        videoId = parts[1].split("?")[0];
      }
    } else if (videoUrl.includes("b-cdn.net")) {
      libraryId = videoUrl.split("/")[4];
      videoId = videoUrl.split("/").pop()?.split(".")[0] || "";
    }

    console.log("Extracted video info:", { videoId, libraryId });

    if (!videoId || !libraryId) {
      console.log("Could not extract video ID or library ID");
      return videoUrl;
    }

    const tokenSecurityKey = process.env.BUNNY_STREAM_TOKEN;
    const expirationTime = Math.floor(Date.now() / 1000) + 3600;

    const tokenData = `${tokenSecurityKey}${videoId}${expirationTime}`;
    const token = crypto.createHash("sha256").update(tokenData).digest("hex");

    console.log("Generated token info:", {
      tokenLength: token.length,
      expirationTime,
      tokenFirstChars: token.substring(0, 10) + "...",
    });

    const embedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;
    const authenticatedUrl = `${embedUrl}?token=${token}&expires=${expirationTime}`;

    console.log("Final authenticated URL:", authenticatedUrl);
    return authenticatedUrl;
  } catch (error) {
    console.error("Error authenticating Bunny video:", error);
    return videoUrl;
  }
}

function addThumbnailUrls(workout: any) {
  if (!workout || !process.env.BUNNY_STREAM_TOKEN) {
    return workout;
  }

  try {
    if (workout.videoUrl) {
      let videoId = "";

      if (workout.videoUrl.includes("iframe.mediadelivery.net")) {
        const urlParts = workout.videoUrl.split("/");
        const idIndex =
          urlParts.indexOf("embed") > -1
            ? urlParts.indexOf("embed") + 2
            : urlParts.indexOf("play") + 2;

        if (idIndex < urlParts.length) {
          videoId = urlParts[idIndex].split("?")[0];
        }
      } else if (workout.videoUrl.includes("b-cdn.net")) {
        const urlParts = workout.videoUrl.split("/");
        videoId = urlParts[urlParts.length - 1].split(".")[0];
      }

      if (videoId) {
        const tokenSecurityKey = process.env.BUNNY_STREAM_TOKEN;
        const expirationTime = Math.floor(Date.now() / 1000) + 3600;

        const tokenData = `${tokenSecurityKey}${videoId}${expirationTime}`;
        const token = crypto
          .createHash("sha256")
          .update(tokenData)
          .digest("hex");

        const randomSuffix = Math.random().toString(16).substring(2, 10);

        workout.thumbnailUrl = `https://vz-01a4b1c4-97f.b-cdn.net/bcdn_token=${token}&expires=${expirationTime}&token_path=%2F${videoId}%2F/${videoId}/thumbnail_${randomSuffix}.jpg`;
      }
    }

    if (workout.workoutExercises && Array.isArray(workout.workoutExercises)) {
      workout.workoutExercises = workout.workoutExercises.map((ex) => {
        if (ex.exercise && ex.exercise.videoUrl) {
          let videoId = "";

          if (ex.exercise.videoUrl.includes("iframe.mediadelivery.net")) {
            const urlParts = ex.exercise.videoUrl.split("/");
            const idIndex =
              urlParts.indexOf("embed") > -1
                ? urlParts.indexOf("embed") + 2
                : urlParts.indexOf("play") + 2;

            if (idIndex < urlParts.length) {
              videoId = urlParts[idIndex].split("?")[0];
            }
          } else if (ex.exercise.videoUrl.includes("b-cdn.net")) {
            const urlParts = ex.exercise.videoUrl.split("/");
            videoId = urlParts[urlParts.length - 1].split(".")[0];
          }

          if (videoId) {
            const tokenSecurityKey = process.env.BUNNY_STREAM_TOKEN;
            const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

            const tokenData = `${tokenSecurityKey}${videoId}${expirationTime}`;
            const token = crypto
              .createHash("sha256")
              .update(tokenData)
              .digest("hex");

            const randomSuffix = Math.random().toString(16).substring(2, 10);

            ex.exercise.thumbnailUrl = `https://vz-01a4b1c4-97f.b-cdn.net/bcdn_token=${token}&expires=${expirationTime}&token_path=%2F${videoId}%2F/${videoId}/thumbnail_${randomSuffix}.jpg`;
          }
        }
        return ex;
      });
    }

    return workout;
  } catch (error) {
    console.error("Error adding thumbnail URLs:", error);
    return workout;
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Fetching workout with ID:", params.id);

    const session = await getServerSession(authOptions);
    if (!session) {
      console.log("No session found, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("User session found:", {
      userId: session.user.id,
      membershipId: session.user.membershipId,
      membershipStatus: session.user.membershipStatus,
    });

    const workout = await prisma.workout.findUnique({
      where: { id: params.id },
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

    console.log("Workout membership info:", {
      workoutMembershipId: workout.membershipId,
      userMembershipId: session.user.membershipId,
      userMembershipStatus: session.user.membershipStatus,
    });

    const hasAccess =
      !workout.membershipId ||
      workout.membershipId === "" ||
      (session.user.membershipStatus === "active" &&
        session.user.membershipId === workout.membershipId);

    if (hasAccess) {
      console.log("User has access to workout videos, authenticating URLs");

      const authenticatedWorkout = { ...workout };

      if (authenticatedWorkout.videoUrl) {
        console.log("Authenticating main workout video");
        authenticatedWorkout.videoUrl = await authenticateBunnyVideo(
          authenticatedWorkout.videoUrl
        );
      }

      authenticatedWorkout.workoutExercises = await Promise.all(
        authenticatedWorkout.workoutExercises.map(async (ex, index) => {
          const updatedEx = { ...ex };
          if (updatedEx.exercise.videoUrl) {
            console.log(
              `Authenticating exercise video ${index + 1}: ${
                updatedEx.exercise.name
              }`
            );
            updatedEx.exercise = {
              ...updatedEx.exercise,
              videoUrl: await authenticateBunnyVideo(
                updatedEx.exercise.videoUrl
              ),
            };
          }
          return updatedEx;
        })
      );

      const workoutWithThumbnails = addThumbnailUrls(authenticatedWorkout);

      console.log("Returning authenticated workout data with thumbnails");
      return NextResponse.json(workoutWithThumbnails);
    } else {
      console.log(
        "User does not have access, returning restricted workout data"
      );
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
    console.error("Error in workout API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
