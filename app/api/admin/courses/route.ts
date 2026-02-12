import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

// GET - Fetch all courses
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courses = await prisma.course.findMany({
      include: {
        lessons: {
          orderBy: { order: "asc" },
        },
        membership: {
          select: { id: true, name: true },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// POST - Create a new course
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, imageUrl, isPublished, membershipId } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Get the next order number
    const lastCourse = await prisma.course.findFirst({
      orderBy: { order: "desc" },
    });
    const nextOrder = (lastCourse?.order ?? -1) + 1;

    const course = await prisma.course.create({
      data: {
        title,
        description: description || null,
        imageUrl: imageUrl || null,
        isPublished: isPublished ?? false,
        membershipId: membershipId || null,
        order: nextOrder,
        createdBy: session.user.id,
      },
      include: {
        lessons: true,
        membership: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
