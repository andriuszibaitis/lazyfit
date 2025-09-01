import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";
import { calculateNutrition } from "@/app/lib/nutrition";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      preparationTime,
      cookingTime,
      servings,
      difficulty,
      instructions,
      image,
      tags,
      ingredients,
      isPublished,
      availableToAll,
      membershipIds,
      categoryId,
    } = body;

    const nutrition = await calculateNutrition(ingredients);

    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        preparationTime,
        cookingTime,
        servings,
        difficulty,
        instructions,
        image,
        tags,
        isPublished,
        availableToAll,
        categoryId: categoryId || null,
        createdBy: session.user.id,
        updatedBy: session.user.id,
        ...nutrition,
        ingredients: {
          create: ingredients.map((ingredient: any) => ({
            foodProductId: ingredient.foodProductId,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            url: ingredient.url || null,
          })),
        },

        ...(!availableToAll && membershipIds && membershipIds.length > 0
          ? {
              memberships: {
                create: membershipIds.map((membershipId: string) => ({
                  membershipId,
                })),
              },
            }
          : {}),
      },
      include: {
        ingredients: {
          include: {
            foodProduct: true,
          },
        },
        memberships: true,
        category: true,
      },
    });

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: {
          include: {
            foodProduct: true,
          },
        },
        memberships: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
