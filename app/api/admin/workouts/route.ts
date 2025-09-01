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

    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");
    const showCopies = searchParams.get("showCopies") === "true";

    const where: any = {};

    if (published) {
      where.isPublished = published === "true";
    }

    if (!showCopies) {
      where.isCopy = false;
    }

    const workouts = await prisma.workout.findMany({
      where,
      orderBy: { createdAt: "desc" },
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
        },
        programWorkouts: {
          include: {
            program: true,
          },
        },
      },
    });

    return NextResponse.json({ workouts });
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return NextResponse.json(
      { error: "Failed to fetch workouts" },
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

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const workout = await prisma.workout.create({
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
        createdBy: session.user.email || undefined,
      },
    });

    return NextResponse.json({ workout });
  } catch (error) {
    console.error("Error creating workout:", error);
    return NextResponse.json(
      { error: "Failed to create workout" },
      { status: 500 }
    );
  }
}
