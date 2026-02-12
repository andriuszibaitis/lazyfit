import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prismadb";

// GET - Fetch a single FAQ item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const item = await prisma.fAQItem.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, title: true, slug: true },
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: "FAQ item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching FAQ item:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQ item" },
      { status: 500 }
    );
  }
}

// PUT - Update a FAQ item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { categoryId, question, answer, isActive, order } = body;

    const existingItem = await prisma.fAQItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "FAQ item not found" },
        { status: 404 }
      );
    }

    // If changing category, verify new category exists
    if (categoryId && categoryId !== existingItem.categoryId) {
      const category = await prisma.fAQCategory.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
    }

    const item = await prisma.fAQItem.update({
      where: { id },
      data: {
        ...(categoryId !== undefined && { categoryId }),
        ...(question !== undefined && { question: question.trim() }),
        ...(answer !== undefined && { answer: answer.trim() }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order }),
      },
      include: {
        category: {
          select: { id: true, title: true, slug: true },
        },
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error updating FAQ item:", error);
    return NextResponse.json(
      { error: "Failed to update FAQ item" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a FAQ item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const item = await prisma.fAQItem.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json(
        { error: "FAQ item not found" },
        { status: 404 }
      );
    }

    await prisma.fAQItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting FAQ item:", error);
    return NextResponse.json(
      { error: "Failed to delete FAQ item" },
      { status: 500 }
    );
  }
}
