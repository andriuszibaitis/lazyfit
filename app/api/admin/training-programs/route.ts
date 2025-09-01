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
    const published = searchParams.get("published");

    let whereClause = {};
    if (published === "true") {
      whereClause = { isPublished: true };
    } else if (published === "false") {
      whereClause = { isPublished: false };
    }

    const programs = await prisma.trainingProgram.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        membership: {
          select: {
            name: true,
            planId: true,
          },
        },
        programWorkouts: {
          include: {
            workout: true,
          },
          orderBy: [{ dayNumber: "asc" }, { order: "asc" }],
        },
      },
    });

    return NextResponse.json({ programs });
  } catch (error) {
    console.error("Error fetching training programs:", error);
    return NextResponse.json(
      { error: "Failed to fetch training programs" },
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
    console.log("Received body:", body);

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

    const membershipIdValue =
      membershipId === "all" || !membershipId ? null : membershipId;

    console.log("Creating program with membershipId:", membershipIdValue);

    const program = await prisma.trainingProgram.create({
      data: {
        name,
        description: description || null,
        difficulty: difficulty || "medium",
        duration: duration ? Number.parseInt(duration) : null,
        gender: gender || "all",
        goal: goal || null,
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        isPublished: isPublished || false,
        membershipId: membershipIdValue,
        createdBy: session.user.email || null,
        updatedBy: session.user.email || null,
      },
    });

    return NextResponse.json({ program });
  } catch (error) {
    console.error("Error creating training program:", error);
    return NextResponse.json(
      {
        error: "Failed to create training program",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
