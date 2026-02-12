import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prismadb";

// GET - Fetch all FAQ items (with optional category filter)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const items = await prisma.fAQItem.findMany({
      where: categoryId ? { categoryId } : undefined,
      orderBy: { order: "asc" },
      include: {
        category: {
          select: { id: true, title: true, slug: true },
        },
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching FAQ items:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQ items" },
      { status: 500 }
    );
  }
}

// POST - Create a new FAQ item
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { categoryId, question, answer, isActive } = body;

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    if (!question || !question.trim()) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    if (!answer || !answer.trim()) {
      return NextResponse.json(
        { error: "Answer is required" },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await prisma.fAQCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Get max order for this category
    const maxOrder = await prisma.fAQItem.aggregate({
      where: { categoryId },
      _max: { order: true },
    });

    const item = await prisma.fAQItem.create({
      data: {
        categoryId,
        question: question.trim(),
        answer: answer.trim(),
        isActive: isActive ?? true,
        order: (maxOrder._max.order ?? -1) + 1,
      },
      include: {
        category: {
          select: { id: true, title: true, slug: true },
        },
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating FAQ item:", error);
    return NextResponse.json(
      { error: "Failed to create FAQ item" },
      { status: 500 }
    );
  }
}
