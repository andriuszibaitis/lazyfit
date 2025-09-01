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

    const program = await prisma.trainingProgram.findUnique({
      where: {
        id: id,
      },
      include: {
        membership: {
          select: {
            name: true,
            planId: true,
          },
        },
        programWorkouts: {
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
              dayNumber: "asc",
            },
            {
              order: "asc",
            },
          ],
        },
      },
    });

    if (!program) {
      return NextResponse.json(
        { error: "Training program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ program });
  } catch (error) {
    console.error("Error fetching training program:", error);
    return NextResponse.json(
      { error: "Failed to fetch training program" },
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

    const id = params.id;
    const body = await request.json();
    const {
      name,
      description,
      difficulty,
      duration,
      gender,
      goal,
      imageUrl,
      videoUrl,
      isPublished,
      membershipId,
    } = body;

    const program = await prisma.trainingProgram.update({
      where: {
        id: id,
      },
      data: {
        name,
        description,
        difficulty: difficulty || "medium",
        duration: duration ? Number.parseInt(duration) : null,
        gender: gender || "all",
        goal,
        imageUrl,
        videoUrl,
        isPublished: isPublished || false,
        membershipId: membershipId === "" ? null : membershipId,
        updatedBy: session.user.email || undefined,
      },
    });

    return NextResponse.json({ program });
  } catch (error) {
    console.error("Error updating training program:", error);
    return NextResponse.json(
      { error: "Failed to update training program" },
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

    await prisma.programWorkout.deleteMany({
      where: {
        programId: id,
      },
    });

    await prisma.trainingProgram.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Program deleted successfully" });
  } catch (error) {
    console.error("Error deleting training program:", error);
    return NextResponse.json(
      { error: "Failed to delete training program" },
      { status: 500 }
    );
  }
}
