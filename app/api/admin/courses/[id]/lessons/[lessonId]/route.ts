import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

// PATCH - Update a lesson
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId } = await params;
    const body = await request.json();

    // Convert duration to int if provided
    if (body.duration !== undefined) {
      body.duration = body.duration ? parseInt(body.duration) : null;
    }

    const lesson = await prisma.courseLesson.update({
      where: { id: lessonId },
      data: body,
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error updating lesson:", error);
    return NextResponse.json(
      { error: "Failed to update lesson" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a lesson
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId } = await params;

    await prisma.courseLesson.delete({
      where: { id: lessonId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return NextResponse.json(
      { error: "Failed to delete lesson" },
      { status: 500 }
    );
  }
}
