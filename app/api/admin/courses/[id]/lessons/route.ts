import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

// POST - Create a new lesson
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: courseId } = await params;
    const body = await request.json();
    const { title, type, content, videoUrl, duration } = body;

    if (!title || !type) {
      return NextResponse.json(
        { error: "Title and type are required" },
        { status: 400 }
      );
    }

    if (type !== "video" && type !== "text") {
      return NextResponse.json(
        { error: "Type must be 'video' or 'text'" },
        { status: 400 }
      );
    }

    // Get the next order number for this course
    const lastLesson = await prisma.courseLesson.findFirst({
      where: { courseId },
      orderBy: { order: "desc" },
    });
    const nextOrder = (lastLesson?.order ?? -1) + 1;

    const lesson = await prisma.courseLesson.create({
      data: {
        courseId,
        title,
        type,
        content: content || null,
        videoUrl: videoUrl || null,
        duration: duration ? parseInt(duration) : null,
        order: nextOrder,
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error("Error creating lesson:", error);
    return NextResponse.json(
      { error: "Failed to create lesson" },
      { status: 500 }
    );
  }
}
