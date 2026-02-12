import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prismadb";

// GET - Get single achievement
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const achievement = await prisma.achievement.findUnique({
      where: { id },
    });

    if (!achievement) {
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(achievement);
  } catch (error) {
    console.error("Error fetching achievement:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievement" },
      { status: 500 }
    );
  }
}

// PUT - Update achievement
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const achievement = await prisma.achievement.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        iconUrl: body.iconUrl,
        iconSvg: body.iconSvg,
        trigger: body.trigger,
        triggerValue: body.triggerValue,
        order: body.order,
        isActive: body.isActive,
      },
    });

    return NextResponse.json(achievement);
  } catch (error) {
    console.error("Error updating achievement:", error);
    return NextResponse.json(
      { error: "Failed to update achievement" },
      { status: 500 }
    );
  }
}

// DELETE - Delete achievement
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Delete user achievements first (cascade should handle this, but explicit for safety)
    await prisma.userAchievement.deleteMany({
      where: { achievementId: id },
    });

    await prisma.achievement.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Achievement deleted" });
  } catch (error) {
    console.error("Error deleting achievement:", error);
    return NextResponse.json(
      { error: "Failed to delete achievement" },
      { status: 500 }
    );
  }
}
