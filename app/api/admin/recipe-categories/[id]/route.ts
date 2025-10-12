import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

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
    const category = await prisma.recipeCategory.findUnique({
      where: { id },
      include: {
        recipes: true,
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
    console.error("Error fetching recipe category:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipe category" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, image, isActive, order } = body;

    const slug = name
      ? name
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-")
      : undefined;

    const { id } = await params;
    const category = await prisma.recipeCategory.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        image,
        isActive,
        order,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating recipe category:", error);
    return NextResponse.json(
      { error: "Failed to update recipe category" },
      { status: 500 }
    );
  }
}

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
    const categoryWithRecipes = await prisma.recipeCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { recipes: true },
        },
      },
    });

    if (
      categoryWithRecipes?._count.recipes &&
      categoryWithRecipes._count.recipes > 0
    ) {
      return NextResponse.json(
        {
          error:
            "Cannot delete category with recipes. Please reassign recipes first.",
        },
        { status: 400 }
      );
    }

    await prisma.recipeCategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting recipe category:", error);
    return NextResponse.json(
      { error: "Failed to delete recipe category" },
      { status: 500 }
    );
  }
}
