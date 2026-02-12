import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const nutritionPlan = await prisma.nutritionPlan.findUnique({
      where: {
        id,
        isPublished: true,
      },
      include: {
        membership: true,
        days: {
          orderBy: {
            dayNumber: "asc",
          },
          include: {
            meals: {
              orderBy: {
                mealNumber: "asc",
              },
              include: {
                items: true,
              },
            },
          },
        },
      },
    });

    if (!nutritionPlan) {
      return NextResponse.json(
        { error: "Nutrition plan not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this plan
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { membership: true },
    });

    const userMembershipId = user?.membership?.id || null;

    // If plan requires membership, check if user has it
    if (
      nutritionPlan.membershipId &&
      nutritionPlan.membershipId !== userMembershipId
    ) {
      return NextResponse.json(
        { error: "You don't have access to this nutrition plan" },
        { status: 403 }
      );
    }

    return NextResponse.json(nutritionPlan);
  } catch (error) {
    console.error("Error fetching nutrition plan:", error);
    return NextResponse.json(
      { error: "Failed to fetch nutrition plan" },
      { status: 500 }
    );
  }
}
