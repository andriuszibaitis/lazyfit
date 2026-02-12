import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prismadb";

// GET - Fetch all FAQ categories
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await prisma.fAQCategory.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching FAQ categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQ categories" },
      { status: 500 }
    );
  }
}

// POST - Create a new FAQ category
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, isActive } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-ąčęėįšųūž]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    // Check if slug already exists
    const existingCategory = await prisma.fAQCategory.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this title already exists" },
        { status: 400 }
      );
    }

    // Get max order
    const maxOrder = await prisma.fAQCategory.aggregate({
      _max: { order: true },
    });

    const category = await prisma.fAQCategory.create({
      data: {
        title: title.trim(),
        slug,
        description: description?.trim() || null,
        isActive: isActive ?? true,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating FAQ category:", error);
    return NextResponse.json(
      { error: "Failed to create FAQ category" },
      { status: 500 }
    );
  }
}
