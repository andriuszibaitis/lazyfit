import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth-options";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import RecipesContent from "./recipes-content";

export default async function ReceptaiPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/prisijungti?callbackUrl=/dashboard/mityba/receptai");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { membership: true },
  });

  const userMembershipId = user?.membership?.id || null;

  // Fetch recipes that user has access to
  const recipes = await prisma.recipe.findMany({
    where: {
      AND: [
        { isPublished: true },
        {
          OR: [
            { availableToAll: true },
            {
              memberships: {
                some: {
                  membershipId: userMembershipId || undefined,
                },
              },
            },
          ],
        },
      ],
    },
    include: {
      category: true,
    },
    take: 12,
    orderBy: { createdAt: "desc" },
  });

  // Fetch categories for filter
  const categories = await prisma.recipeCategory.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  const formattedRecipes = recipes.map((recipe) => ({
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    image: recipe.image || "/placeholder.svg?height=300&width=400",
    preparationTime: recipe.preparationTime,
    cookingTime: recipe.cookingTime,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    calories: recipe.caloriesPerServing || 0,
    protein: recipe.proteinPerServing || 0,
    carbs: recipe.carbsPerServing || 0,
    fat: recipe.fatPerServing || 0,
    category: recipe.category?.name || null,
  }));

  const formattedCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));

  return (
    <RecipesContent recipes={formattedRecipes} categories={formattedCategories} />
  );
}
