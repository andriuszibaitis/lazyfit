"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Save, Loader2, PlusCircle } from "lucide-react";
import AddFoodProductModal from "./add-food-product-modal";

interface FoodProduct {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  serving?: number;
  servingUnit?: string;
  isCustom?: boolean;
  userId?: string;
}

interface MealItem {
  id?: string;
  foodProductId: string;
  foodProductName: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

interface Meal {
  id?: string;
  mealNumber: number;
  name: string;
  items: MealItem[];
}

interface Day {
  id?: string;
  dayNumber: number;
  meals: Meal[];
}

interface NutritionPlan {
  id?: string;
  name: string;
  description: string | null;
}

interface NutritionPlanFormProps {
  foodProducts: FoodProduct[];
  nutritionPlan?: NutritionPlan & { days: Day[] };
  isEditing?: boolean;
}

function calculateNutritionValues(foodProduct: FoodProduct, quantity: number) {
  const ratio = quantity / 100;

  return {
    calories: foodProduct.calories * ratio,
    protein: foodProduct.protein * ratio,
    carbs: foodProduct.carbs * ratio,
    fat: foodProduct.fat * ratio,
  };
}

export default function NutritionPlanForm({
  foodProducts: initialFoodProducts,
  nutritionPlan,
  isEditing = false,
}: NutritionPlanFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [planName, setPlanName] = useState(nutritionPlan?.name || "");
  const [planDescription, setPlanDescription] = useState(
    nutritionPlan?.description || ""
  );
  const [days, setDays] = useState<Day[]>(
    nutritionPlan?.days || [
      {
        dayNumber: 1,
        meals: [
          {
            mealNumber: 1,
            name: "Pusryčiai",
            items: [],
          },
        ],
      },
    ]
  );

  const [activeDay, setActiveDay] = useState(0);
  const [activeMeal, setActiveMeal] = useState(0);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [foodProducts, setFoodProducts] =
    useState<FoodProduct[]>(initialFoodProducts);

  const addDay = () => {
    const newDayNumber =
      days.length > 0 ? Math.max(...days.map((day) => day.dayNumber)) + 1 : 1;

    setDays([
      ...days,
      {
        dayNumber: newDayNumber,
        meals: [
          {
            mealNumber: 1,
            name: "Pusryčiai",
            items: [],
          },
        ],
      },
    ]);

    setActiveDay(days.length);
    setActiveMeal(0);
  };

  const removeDay = (dayIndex: number) => {
    setDays(days.filter((_, index) => index !== dayIndex));

    if (activeDay >= days.length - 1) {
      setActiveDay(Math.max(0, days.length - 2));
    }
  };

  const addMeal = (dayIndex: number) => {
    const day = days[dayIndex];
    const newMealNumber =
      day.meals.length > 0
        ? Math.max(...day.meals.map((meal) => meal.mealNumber)) + 1
        : 1;

    const mealNames = [
      "Pusryčiai",
      "Priešpiečiai",
      "Pietūs",
      "Pavakariai",
      "Vakarienė",
      "Naktipiečiai",
    ];
    const defaultName =
      mealNames[day.meals.length % mealNames.length] ||
      `Valgis ${newMealNumber}`;

    const updatedDays = [...days];
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      meals: [
        ...updatedDays[dayIndex].meals,
        {
          mealNumber: newMealNumber,
          name: defaultName,
          items: [],
        },
      ],
    };

    setDays(updatedDays);

    setActiveMeal(day.meals.length);
  };

  const removeMeal = (dayIndex: number, mealIndex: number) => {
    const updatedDays = [...days];
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      meals: updatedDays[dayIndex].meals.filter(
        (_, index) => index !== mealIndex
      ),
    };

    setDays(updatedDays);

    if (activeMeal >= updatedDays[dayIndex].meals.length) {
      setActiveMeal(Math.max(0, updatedDays[dayIndex].meals.length - 1));
    }
  };

  const updateMealName = (
    dayIndex: number,
    mealIndex: number,
    name: string
  ) => {
    const updatedDays = [...days];
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      meals: updatedDays[dayIndex].meals.map((meal, idx) =>
        idx === mealIndex ? { ...meal, name } : meal
      ),
    };

    setDays(updatedDays);
  };

  const addFoodItem = (
    dayIndex: number,
    mealIndex: number,
    foodProductId: string,
    quantity: number
  ) => {
    const foodProduct = foodProducts.find((p) => p.id === foodProductId);
    if (!foodProduct) return;

    const { calories, protein, carbs, fat } = calculateNutritionValues(
      foodProduct,
      quantity
    );

    const newItem: MealItem = {
      foodProductId,
      foodProductName: foodProduct.name,
      quantity,
      calories,
      protein,
      carbs,
      fat,
    };

    const updatedDays = [...days];
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      meals: updatedDays[dayIndex].meals.map((meal, idx) =>
        idx === mealIndex ? { ...meal, items: [...meal.items, newItem] } : meal
      ),
    };

    setDays(updatedDays);
  };

  const removeFoodItem = (
    dayIndex: number,
    mealIndex: number,
    itemIndex: number
  ) => {
    const updatedDays = [...days];
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      meals: updatedDays[dayIndex].meals.map((meal, idx) =>
        idx === mealIndex
          ? {
              ...meal,
              items: meal.items.filter((_, iIdx) => iIdx !== itemIndex),
            }
          : meal
      ),
    };

    setDays(updatedDays);
  };

  const updateFoodItemQuantity = (
    dayIndex: number,
    mealIndex: number,
    itemIndex: number,
    quantity: number
  ) => {
    const updatedDays = [...days];
    const meal = updatedDays[dayIndex].meals[mealIndex];
    const item = meal.items[itemIndex];
    const foodProduct = foodProducts.find((p) => p.id === item.foodProductId);

    if (!foodProduct) return;

    const { calories, protein, carbs, fat } = calculateNutritionValues(
      foodProduct,
      quantity
    );

    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      meals: updatedDays[dayIndex].meals.map((meal, idx) =>
        idx === mealIndex
          ? {
              ...meal,
              items: meal.items.map((item, iIdx) =>
                iIdx === itemIndex
                  ? {
                      ...item,
                      quantity,
                      calories,
                      protein,
                      carbs,
                      fat,
                    }
                  : item
              ),
            }
          : meal
      ),
    };

    setDays(updatedDays);
  };

  const calculateMealTotals = (items: MealItem[]) => {
    return items.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fat: acc.fat + item.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const calculateDayTotals = (meals: Meal[]) => {
    return meals.reduce(
      (acc, meal) => {
        const mealTotals = calculateMealTotals(meal.items);
        return {
          calories: acc.calories + mealTotals.calories,
          protein: acc.protein + mealTotals.protein,
          carbs: acc.carbs + mealTotals.carbs,
          fat: acc.fat + mealTotals.fat,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const handleProductAdded = (newProduct: FoodProduct) => {
    console.log("New product added:", newProduct);
    setFoodProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!planName) {
      alert("Prašome įvesti mitybos plano pavadinimą");
      return;
    }

    if (days.length === 0) {
      alert("Prašome pridėti bent vieną dieną");
      return;
    }

    const emptyDayIndex = days.findIndex((day) => day.meals.length === 0);
    if (emptyDayIndex !== -1) {
      alert(
        `Diena ${days[emptyDayIndex].dayNumber} neturi valgių. Prašome pridėti bent vieną valgį.`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = isEditing
        ? `/api/dashboard/nutrition-plans/${nutritionPlan?.id}`
        : "/api/dashboard/nutrition-plans";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: planName,
          description: planDescription,
          gender: "all",
          days,
        }),
      });

      if (!response.ok) {
        throw new Error("Įvyko klaida išsaugant mitybos planą");
      }

      router.push("/dashboard/mano-mityba");
      router.refresh();
    } catch (error) {
      console.error("Error saving nutrition plan:", error);
      alert("Įvyko klaida išsaugant mitybos planą");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Pagrindinė informacija</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="plan-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pavadinimas *
            </label>
            <input
              type="text"
              id="plan-name"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              required
              placeholder="Pvz., Mano savaitės planas"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#60988e]"
            />
          </div>

          <div>
            <label
              htmlFor="plan-description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Aprašymas
            </label>
            <textarea
              id="plan-description"
              value={planDescription || ""}
              onChange={(e) => setPlanDescription(e.target.value)}
              rows={2}
              placeholder="Trumpas plano aprašymas (neprivaloma)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#60988e]"
            />
          </div>
        </div>
      </div>

      {}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-[#60988e] text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Dienos ir valgiai</h2>
          <button
            type="button"
            onClick={addDay}
            className="flex items-center gap-2 px-3 py-1.5 bg-white text-[#60988e] rounded-md hover:bg-gray-100 transition-colors"
          >
            <Plus size={16} />
            <span>Pridėti dieną</span>
          </button>
        </div>

        {days.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600 mb-4">Dar nepridėjote jokių dienų</p>
            <button
              type="button"
              onClick={addDay}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#60988e] text-white rounded-md hover:bg-[#4e7d74] transition-colors"
            >
              <Plus size={16} />
              <span>Pridėti dieną</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            {}
            <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200">
              <div className="p-4">
                <h3 className="font-medium text-gray-700 mb-2">Dienos</h3>
                <ul className="space-y-1">
                  {days.map((day, dayIndex) => (
                    <li key={dayIndex}>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveDay(dayIndex);
                          setActiveMeal(0);
                        }}
                        className={`w-full flex justify-between items-center px-3 py-2 rounded-md ${
                          activeDay === dayIndex
                            ? "bg-[#60988e] text-white"
                            : "hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        <span>Diena {day.dayNumber}</span>
                        {days.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeDay(dayIndex);
                            }}
                            className={`${
                              activeDay === dayIndex
                                ? "text-white hover:text-red-200"
                                : "text-gray-500 hover:text-red-500"
                            } transition-colors`}
                            title="Ištrinti dieną"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={addDay}
                  className="w-full mt-2 flex items-center justify-center gap-1 px-3 py-2 border border-dashed border-gray-300 rounded-md text-gray-500 hover:text-[#60988e] hover:border-[#60988e] transition-colors"
                >
                  <PlusCircle size={16} />
                  <span>Pridėti dieną</span>
                </button>
              </div>
            </div>

            {}
            <div className="flex-1">
              {days[activeDay] && (
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-lg">
                      Diena {days[activeDay].dayNumber}
                    </h3>
                    <div className="text-sm text-gray-600">
                      {Object.entries(
                        calculateDayTotals(days[activeDay].meals)
                      ).map(([key, value]) => (
                        <span key={key} className="mr-3">
                          <span className="font-medium">
                            {key === "calories"
                              ? "Kalorijos"
                              : key === "protein"
                              ? "Baltymai"
                              : key === "carbs"
                              ? "Angliavandeniai"
                              : "Riebalai"}
                            :
                          </span>{" "}
                          {value.toFixed(key === "calories" ? 0 : 1)}
                          {key === "calories" ? " kcal" : " g"}
                        </span>
                      ))}
                    </div>
                  </div>

                  {}
                  <div className="mb-4 border-b border-gray-200">
                    <div className="flex overflow-x-auto">
                      {days[activeDay].meals.map((meal, mealIndex) => (
                        <button
                          key={mealIndex}
                          type="button"
                          onClick={() => setActiveMeal(mealIndex)}
                          className={`flex items-center whitespace-nowrap px-4 py-2 border-b-2 ${
                            activeMeal === mealIndex
                              ? "border-[#60988e] text-[#60988e]"
                              : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                          }`}
                        >
                          {meal.name}
                          {days[activeDay].meals.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeMeal(activeDay, mealIndex);
                              }}
                              className="ml-2 text-gray-400 hover:text-red-500"
                              title="Ištrinti valgį"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => addMeal(activeDay)}
                        className="flex items-center whitespace-nowrap px-4 py-2 text-gray-500 hover:text-[#60988e]"
                      >
                        <Plus size={16} className="mr-1" />
                        <span>Pridėti valgį</span>
                      </button>
                    </div>
                  </div>

                  {}
                  {days[activeDay].meals[activeMeal] && (
                    <div>
                      <div className="mb-4">
                        <label
                          htmlFor="meal-name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Valgio pavadinimas
                        </label>
                        <input
                          type="text"
                          id="meal-name"
                          value={days[activeDay].meals[activeMeal].name}
                          onChange={(e) =>
                            updateMealName(
                              activeDay,
                              activeMeal,
                              e.target.value
                            )
                          }
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#60988e]"
                        />
                      </div>

                      {}
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Produktai</h4>
                        {days[activeDay].meals[activeMeal].items.length > 0 ? (
                          <div className="overflow-x-auto mb-4">
                            <table className="w-full min-w-[600px] border-collapse">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="text-left p-2">Produktas</th>
                                  <th className="text-right p-2">Kiekis (g)</th>
                                  <th className="text-right p-2">Kalorijos</th>
                                  <th className="text-right p-2">Baltymai</th>
                                  <th className="text-right p-2">
                                    Angliavandeniai
                                  </th>
                                  <th className="text-right p-2">Riebalai</th>
                                  <th className="p-2"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {days[activeDay].meals[activeMeal].items.map(
                                  (item, itemIndex) => (
                                    <tr key={itemIndex} className="border-t">
                                      <td className="p-2">
                                        {item.foodProductName}
                                      </td>
                                      <td className="p-2">
                                        <input
                                          type="number"
                                          min="1"
                                          value={item.quantity}
                                          onChange={(e) =>
                                            updateFoodItemQuantity(
                                              activeDay,
                                              activeMeal,
                                              itemIndex,
                                              Number(e.target.value)
                                            )
                                          }
                                          className="w-20 px-2 py-1 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#60988e]"
                                        />
                                      </td>
                                      <td className="text-right p-2">
                                        {item.calories.toFixed(0)} kcal
                                      </td>
                                      <td className="text-right p-2">
                                        {item.protein.toFixed(1)} g
                                      </td>
                                      <td className="text-right p-2">
                                        {item.carbs.toFixed(1)} g
                                      </td>
                                      <td className="text-right p-2">
                                        {item.fat.toFixed(1)} g
                                      </td>
                                      <td className="p-2 text-center">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeFoodItem(
                                              activeDay,
                                              activeMeal,
                                              itemIndex
                                            )
                                          }
                                          className="text-gray-500 hover:text-red-500 transition-colors"
                                          title="Ištrinti produktą"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                              <tfoot>
                                <tr className="border-t bg-gray-50">
                                  <td className="p-2 font-medium">Iš viso:</td>
                                  <td className="p-2"></td>
                                  <td className="text-right p-2 font-medium">
                                    {calculateMealTotals(
                                      days[activeDay].meals[activeMeal].items
                                    ).calories.toFixed(0)}{" "}
                                    kcal
                                  </td>
                                  <td className="text-right p-2 font-medium">
                                    {calculateMealTotals(
                                      days[activeDay].meals[activeMeal].items
                                    ).protein.toFixed(1)}{" "}
                                    g
                                  </td>
                                  <td className="text-right p-2 font-medium">
                                    {calculateMealTotals(
                                      days[activeDay].meals[activeMeal].items
                                    ).carbs.toFixed(1)}{" "}
                                    g
                                  </td>
                                  <td className="text-right p-2 font-medium">
                                    {calculateMealTotals(
                                      days[activeDay].meals[activeMeal].items
                                    ).fat.toFixed(1)}{" "}
                                    g
                                  </td>
                                  <td className="p-2"></td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm mb-4">
                            Dar nepridėjote jokių produktų
                          </p>
                        )}

                        {}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-medium">Pridėti produktą</h5>
                            <button
                              type="button"
                              onClick={() => setIsAddProductModalOpen(true)}
                              className="text-sm text-[#60988e] hover:underline"
                            >
                              Nerandate produkto? Pridėkite naują
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-3 items-end">
                            <div>
                              <label
                                htmlFor="food-product"
                                className="block text-sm text-gray-600 mb-1"
                              >
                                Produktas
                              </label>
                              <select
                                id="food-product"
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#60988e]"
                                defaultValue=""
                              >
                                <option value="" disabled>
                                  Pasirinkite produktą
                                </option>
                                {foodProducts.some((p) => p.userId) && (
                                  <optgroup label="Mano produktai">
                                    {foodProducts
                                      .filter((p) => p.userId)
                                      .map((product) => (
                                        <option
                                          key={product.id}
                                          value={product.id}
                                        >
                                          {product.name}
                                        </option>
                                      ))}
                                  </optgroup>
                                )}
                                <optgroup label="Visi produktai">
                                  {foodProducts
                                    .filter((p) => !p.userId)
                                    .map((product) => (
                                      <option
                                        key={product.id}
                                        value={product.id}
                                      >
                                        {product.name}
                                      </option>
                                    ))}
                                </optgroup>
                              </select>
                            </div>

                            <div>
                              <label
                                htmlFor="quantity"
                                className="block text-sm text-gray-600 mb-1"
                              >
                                Kiekis (g)
                              </label>
                              <input
                                type="number"
                                id="quantity"
                                min="1"
                                defaultValue="100"
                                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#60988e]"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const select = document.getElementById(
                                  "food-product"
                                ) as HTMLSelectElement;
                                const quantityInput = document.getElementById(
                                  "quantity"
                                ) as HTMLInputElement;

                                if (select.value && quantityInput.value) {
                                  addFoodItem(
                                    activeDay,
                                    activeMeal,
                                    select.value,
                                    Number(quantityInput.value)
                                  );
                                  select.value = "";
                                  quantityInput.value = "100";
                                }
                              }}
                              className="px-4 py-2 bg-[#60988e] text-white rounded-md hover:bg-[#4e7d74] transition-colors"
                            >
                              Pridėti produktą
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-3 bg-[#60988e] text-white rounded-md hover:bg-[#4e7d74] transition-colors disabled:bg-gray-400"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Saugoma...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>{isEditing ? "Atnaujinti planą" : "Išsaugoti planą"}</span>
            </>
          )}
        </button>
      </div>

      {}
      <AddFoodProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onProductAdded={handleProductAdded}
      />
    </form>
  );
}
