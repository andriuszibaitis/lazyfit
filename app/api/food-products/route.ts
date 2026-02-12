import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

// POST - Create a new food product
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, category, serving, servingUnit, calories, protein, carbs, fat } = body;

    if (!name?.trim() || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.foodProduct.create({
      data: {
        name: name.trim(),
        category,
        serving: serving || 100,
        servingUnit: servingUnit || "g",
        calories: calories || 0,
        protein: protein || 0,
        carbs: carbs || 0,
        fat: fat || 0,
        userId: session.user.id,
        isUserCreated: true,
      },
      select: {
        id: true,
        name: true,
        category: true,
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
        serving: true,
        servingUnit: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating food product:", error);
    return NextResponse.json(
      { error: "Failed to create food product" },
      { status: 500 }
    );
  }
}
