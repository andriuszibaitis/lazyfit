import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

// DELETE - Delete a meal log
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const mealLog = await prisma.userMealLog.findUnique({
      where: { id },
    });

    if (!mealLog || mealLog.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.userMealLog.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting meal log:", error);
    return NextResponse.json(
      { error: "Failed to delete meal log" },
      { status: 500 }
    );
  }
}

// PATCH - Update meal log (recalculate totals)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const mealLog = await prisma.userMealLog.findUnique({
      where: { id },
    });

    if (!mealLog || mealLog.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.userMealLog.update({
      where: { id },
      data: body,
      include: {
        items: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating meal log:", error);
    return NextResponse.json(
      { error: "Failed to update meal log" },
      { status: 500 }
    );
  }
}
