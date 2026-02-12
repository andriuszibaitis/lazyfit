import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

// PATCH - Reorder lessons
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { lessons } = body;

    if (!lessons || !Array.isArray(lessons)) {
      return NextResponse.json(
        { error: "Lessons array is required" },
        { status: 400 }
      );
    }

    // Update each lesson's order
    await Promise.all(
      lessons.map((lesson: { id: string; order: number }) =>
        prisma.courseLesson.update({
          where: { id: lesson.id },
          data: { order: lesson.order },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering lessons:", error);
    return NextResponse.json(
      { error: "Failed to reorder lessons" },
      { status: 500 }
    );
  }
}
