import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const foodProducts = await prisma.foodProduct.findMany({
      where: {
        OR: [{ isActive: true, userId: null }, { userId: session.user.id }],
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(foodProducts);
  } catch (error) {
    console.error("[FOOD_PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, calories, protein, carbs, fat, category, serving } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const foodProduct = await prisma.foodProduct.create({
      data: {
        name,
        calories: Number.parseFloat(calories.toString()),
        protein: Number.parseFloat(protein.toString()),
        carbs: Number.parseFloat(carbs.toString()),
        fat: Number.parseFloat(fat.toString()),
        category: category || null,
        serving: serving ? Number.parseFloat(serving.toString()) : 100,
        isActive: true,
        userId: session.user.id,
      },
    });

    return NextResponse.json(foodProduct);
  } catch (error) {
    console.error("[FOOD_PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
