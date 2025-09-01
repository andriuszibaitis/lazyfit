import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";
import { calculateNutrition } from "@/app/lib/nutrition";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recipe = await prisma.recipe.findUnique({
      where: { id: params.id },
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

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipe" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const recipe = await prisma.$transaction(async (tx) => {
      await tx.recipeIngredient.deleteMany({
        where: { recipeId: params.id },
      });

      await tx.recipeMembership.deleteMany({
        where: { recipeId: params.id },
      });

      const updatedRecipe = await tx.recipe.update({
        where: { id: params.id },
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

      return updatedRecipe;
    });

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    return NextResponse.json(
      { error: "Failed to update recipe" },
      { status: 500 }
    );
  }
}
