import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

// PATCH - Reorder meal logs
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { meals } = body;

    if (!meals || !Array.isArray(meals)) {
      return NextResponse.json(
        { error: "Missing meals array" },
        { status: 400 }
      );
    }

    // Update all meal orders in a transaction
    await prisma.$transaction(
      meals.map((meal: { id: string; mealOrder: number }) =>
        prisma.userMealLog.update({
          where: { id: meal.id },
          data: { mealOrder: meal.mealOrder },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering meals:", error);
    return NextResponse.json(
      { error: "Failed to reorder meals" },
      { status: 500 }
    );
  }
}
