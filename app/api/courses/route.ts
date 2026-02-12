import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

// GET - Fetch all published courses for users
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user to check gender and membership
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        gender: true,
        planId: true,
      },
    });

    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
        OR: [
          { gender: "all" },
          { gender: user?.gender || "all" },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        gender: true,
        difficulty: true,
        lessons: {
          select: {
            id: true,
            duration: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    // Transform to include lesson count and total duration
    const transformedCourses = courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      gender: course.gender,
      difficulty: course.difficulty,
      lessonCount: course.lessons.length,
      totalDuration: course.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0),
    }));

    return NextResponse.json(transformedCourses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
