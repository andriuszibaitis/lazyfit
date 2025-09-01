export async function calculateNutrition(ingredients: any[]) {
  try {
    const prisma = (await import("@/lib/prisma")).default;

    const foodProductIds = ingredients.map((ing) => ing.foodProductId);

    const foodProducts = await prisma.foodProduct.findMany({
      where: {
        id: {
          in: foodProductIds,
        },
      },
    });

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let totalSugar = 0;

    ingredients.forEach((ingredient) => {
      const product = foodProducts.find(
        (p) => p.id === ingredient.foodProductId
      );
      if (product && ingredient.quantity) {
        const ratio = ingredient.quantity / 100;

        totalCalories += product.calories * ratio;
        totalProtein += product.protein * ratio;
        totalCarbs += product.carbs * ratio;
        totalFat += product.fat * ratio;

        if (product.fiber) {
          totalFiber += product.fiber * ratio;
        }

        if (product.sugar) {
          totalSugar += product.sugar * ratio;
        }
      }
    });

    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalFiber,
      totalSugar,
    };
  } catch (error) {
    console.error("Error calculating nutrition:", error);
    return {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalFiber: 0,
      totalSugar: 0,
    };
  }
}

export function calculateNutritionValues(
  foodProduct: FoodProduct,
  quantity: number
) {
  const ratio = quantity / 100;

  return {
    calories: foodProduct.calories * ratio,
    protein: foodProduct.protein * ratio,
    carbs: foodProduct.carbs * ratio,
    fat: foodProduct.fat * ratio,
  };
}

export function calculateTotalNutrition(items: MealItem[]) {
  return items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
      fiber: acc.fiber + (item.fiber || 0),
      sugar: acc.sugar + (item.sugar || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
  );
}
