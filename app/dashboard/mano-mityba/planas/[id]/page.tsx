import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import { redirect } from "next/navigation";
import PageTitleBar from "../../../components/page-title-bar";
import prisma from "@/lib/prisma";
import NutritionChart from "../../components/nutrition-chart";

export default async function NutritionPlanViewPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/prisijungti?callbackUrl=/dashboard/mano-mityba");
  }

  const planId = params.id;

  const nutritionPlan = await prisma.nutritionPlan.findUnique({
    where: {
      id: planId,
    },
    include: {
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
    redirect("/dashboard/mano-mityba");
  }

  const isUserPlan = nutritionPlan.createdBy === session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { planId: true },
  });

  const isPublicPlan =
    nutritionPlan.isPublished &&
    (nutritionPlan.membershipId === null ||
      nutritionPlan.membershipId === user?.planId);

  if (!isUserPlan && !isPublicPlan) {
    redirect("/dashboard/mano-mityba");
  }

  const dayTotals = nutritionPlan.days.map((day) => {
    let dayCalories = 0;
    let dayProtein = 0;
    let dayCarbs = 0;
    let dayFat = 0;

    day.meals.forEach((meal) => {
      meal.items.forEach((item) => {
        dayCalories += item.calories || 0;
        dayProtein += item.protein || 0;
        dayCarbs += item.carbs || 0;
        dayFat += item.fat || 0;
      });
    });

    return {
      dayNumber: day.dayNumber,
      calories: dayCalories,
      protein: dayProtein,
      carbs: dayCarbs,
      fat: dayFat,
    };
  });

  return (
    <>
      <PageTitleBar title={nutritionPlan.name} />
      <div className="flex-1 p-6">
        <div className="mx-auto">
          {}
          {nutritionPlan.description && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-2">Aprašymas</h2>
              <p className="text-gray-700">{nutritionPlan.description}</p>
            </div>
          )}

          {}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="bg-[#60988e] text-white p-4">
              <h2 className="text-xl font-semibold">Dienos</h2>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {nutritionPlan.days.map((day, index) => (
                  <a
                    key={day.id}
                    href={`#day-${day.dayNumber}`}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Diena {day.dayNumber}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {}
          {nutritionPlan.days.map((day, dayIndex) => (
            <div key={day.id} id={`day-${day.dayNumber}`} className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Diena {day.dayNumber}</h2>

              {}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {}
                <div className="bg-white rounded-lg shadow overflow-hidden h-full">
                  <div className="bg-[#60988e] text-white p-4">
                    <h3 className="text-lg font-semibold">Maistinės vertės</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-0 h-[calc(100%-60px)]">
                    <div className="flex flex-col items-center justify-center p-4 border-r border-b border-gray-100 bg-gray-50">
                      <div className="text-sm text-gray-500 mb-1">
                        Kalorijos
                      </div>
                      <div className="text-2xl font-bold">
                        {dayTotals[dayIndex].calories.toFixed(0)} kcal
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 border-b border-gray-100">
                      <div className="text-sm text-gray-500 mb-1">Baltymai</div>
                      <div className="text-2xl font-bold">
                        {dayTotals[dayIndex].protein.toFixed(1)} g
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 border-r border-gray-100 bg-gray-50">
                      <div className="text-sm text-gray-500 mb-1">
                        Angliavandeniai
                      </div>
                      <div className="text-2xl font-bold">
                        {dayTotals[dayIndex].carbs.toFixed(1)} g
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4">
                      <div className="text-sm text-gray-500 mb-1">Riebalai</div>
                      <div className="text-2xl font-bold">
                        {dayTotals[dayIndex].fat.toFixed(1)} g
                      </div>
                    </div>
                  </div>
                </div>

                {}
                <div className="bg-white rounded-lg shadow p-4 h-full flex items-center justify-center">
                  <NutritionChart
                    calories={dayTotals[dayIndex].calories}
                    protein={dayTotals[dayIndex].protein}
                    carbs={dayTotals[dayIndex].carbs}
                    fat={dayTotals[dayIndex].fat}
                  />
                </div>
              </div>

              {}
              {day.meals.map((meal) => (
                <div
                  key={meal.id}
                  className="bg-white rounded-lg shadow overflow-hidden mb-4"
                >
                  <div className="bg-gray-50 p-4 border-b">
                    <h3 className="text-lg font-semibold">{meal.name}</h3>
                  </div>
                  <div className="p-4">
                    {meal.items.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Produktas
                              </th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kiekis (g)
                              </th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kalorijos
                              </th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Baltymai
                              </th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Angliavandeniai
                              </th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Riebalai
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {meal.items.map((item) => (
                              <tr key={item.id}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {item.foodProductName}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                                  {item.quantity}g
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                                  {item.calories.toFixed(0)} kcal
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                                  {item.protein.toFixed(1)}g
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                                  {item.carbs.toFixed(1)}g
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                                  {item.fat.toFixed(1)}g
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-gray-50">
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                                Iš viso:
                              </td>
                              <td className="px-4 py-2"></td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-right">
                                {meal.items
                                  .reduce(
                                    (sum, item) => sum + (item.calories || 0),
                                    0
                                  )
                                  .toFixed(0)}{" "}
                                kcal
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-right">
                                {meal.items
                                  .reduce(
                                    (sum, item) => sum + (item.protein || 0),
                                    0
                                  )
                                  .toFixed(1)}
                                g
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-right">
                                {meal.items
                                  .reduce(
                                    (sum, item) => sum + (item.carbs || 0),
                                    0
                                  )
                                  .toFixed(1)}
                                g
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-right">
                                {meal.items
                                  .reduce(
                                    (sum, item) => sum + (item.fat || 0),
                                    0
                                  )
                                  .toFixed(1)}
                                g
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        Nėra pridėtų produktų
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
