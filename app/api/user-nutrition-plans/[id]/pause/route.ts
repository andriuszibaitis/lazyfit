import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

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

    // Check if the plan belongs to the user
    const plan = await prisma.userNutritionPlan.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    // Pause (deactivate) the plan
    const updatedPlan = await prisma.userNutritionPlan.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.error("Error pausing nutrition plan:", error);
    return NextResponse.json(
      { error: "Failed to pause nutrition plan" },
      { status: 500 }
    );
  }
}
