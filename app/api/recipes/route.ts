import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

// GET - Fetch all published recipes
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const all = searchParams.get("all") === "true";

    const recipes = await prisma.recipe.findMany({
      where: {
        isPublished: true,
        ...(query && !all
          ? {
              title: {
                contains: query,
              },
            }
          : {}),
      },
      select: {
        id: true,
        title: true,
        servings: true,
        totalCalories: true,
        totalProtein: true,
        totalCarbs: true,
        totalFat: true,
        image: true,
      },
      orderBy: {
        title: "asc",
      },
      take: 50,
    });

    // Transform to match expected format
    const transformedRecipes = recipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      servings: recipe.servings || 1,
      calories: recipe.totalCalories || 0,
      protein: recipe.totalProtein || 0,
      carbs: recipe.totalCarbs || 0,
      fat: recipe.totalFat || 0,
      image: recipe.image,
    }));

    return NextResponse.json(transformedRecipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
