import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prismadb";

// GET - Fetch a single FAQ category
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

    const category = await prisma.fAQCategory.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching FAQ category:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQ category" },
      { status: 500 }
    );
  }
}

// PUT - Update a FAQ category
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
    const { title, description, isActive, order } = body;

    const existingCategory = await prisma.fAQCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Generate new slug if title changed
    let slug = existingCategory.slug;
    if (title && title.trim() !== existingCategory.title) {
      slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-ąčęėįšųūž]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      // Check if new slug already exists (excluding current category)
      const slugExists = await prisma.fAQCategory.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Category with this title already exists" },
          { status: 400 }
        );
      }
    }

    const category = await prisma.fAQCategory.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim(), slug }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating FAQ category:", error);
    return NextResponse.json(
      { error: "Failed to update FAQ category" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a FAQ category
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

    const category = await prisma.fAQCategory.findUnique({
      where: { id },
      include: {
        _count: { select: { items: true } },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Delete category (cascade will delete items)
    await prisma.fAQCategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting FAQ category:", error);
    return NextResponse.json(
      { error: "Failed to delete FAQ category" },
      { status: 500 }
    );
  }
}
