"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { PlusCircle, Trash2, Plus } from "lucide-react";
import AddFoodProductModal from "./add-food-product-modal";

interface FoodProduct {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isUserCreated?: boolean;
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
  description: string;
  days: Day[];
}

interface UserNutritionPlanFormProps {
  foodProducts: FoodProduct[];
  existingPlan?: NutritionPlan;
}

export default function UserNutritionPlanForm({
  foodProducts: initialFoodProducts,
  existingPlan,
}: UserNutritionPlanFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [foodProducts, setFoodProducts] =
    useState<FoodProduct[]>(initialFoodProducts);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const [plan, setPlan] = useState<NutritionPlan>(
    existingPlan || {
      name: "",
      description: "",
      days: [
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
      ],
    }
  );

  const userProducts = foodProducts.filter((p) => p.isUserCreated);
  const systemProducts = foodProducts.filter((p) => !p.isUserCreated);

  const handleProductAdded = (newProduct: FoodProduct) => {
    setFoodProducts((prev) => [...prev, newProduct]);
  };

  const handlePlanChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPlan((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addDay = () => {
    setPlan((prev) => ({
      ...prev,
      days: [
        ...prev.days,
        {
          dayNumber: prev.days.length + 1,
          meals: [
            {
              mealNumber: 1,
              name: "Pusryčiai",
              items: [],
            },
          ],
        },
      ],
    }));
  };

  const removeDay = (dayIndex: number) => {
    setPlan((prev) => {
      const updatedDays = prev.days.filter((_, index) => index !== dayIndex);

      updatedDays.forEach((day, index) => {
        day.dayNumber = index + 1;
      });
      return {
        ...prev,
        days: updatedDays,
      };
    });
  };

  const addMeal = (dayIndex: number) => {
    setPlan((prev) => {
      const updatedDays = [...prev.days];
      updatedDays[dayIndex].meals.push({
        mealNumber: updatedDays[dayIndex].meals.length + 1,
        name: `Valgis ${updatedDays[dayIndex].meals.length + 1}`,
        items: [],
      });
      return {
        ...prev,
        days: updatedDays,
      };
    });
  };

  const removeMeal = (dayIndex: number, mealIndex: number) => {
    setPlan((prev) => {
      const updatedDays = [...prev.days];
      updatedDays[dayIndex].meals = updatedDays[dayIndex].meals.filter(
        (_, index) => index !== mealIndex
      );

      updatedDays[dayIndex].meals.forEach((meal, index) => {
        meal.mealNumber = index + 1;
      });
      return {
        ...prev,
        days: updatedDays,
      };
    });
  };

  const handleMealNameChange = (
    dayIndex: number,
    mealIndex: number,
    name: string
  ) => {
    setPlan((prev) => {
      const updatedDays = [...prev.days];
      updatedDays[dayIndex].meals[mealIndex].name = name;
      return {
        ...prev,
        days: updatedDays,
      };
    });
  };

  const addFoodItem = (
    dayIndex: number,
    mealIndex: number,
    foodProductId: string
  ) => {
    const selectedProduct = foodProducts.find((p) => p.id === foodProductId);
    if (!selectedProduct) return;

    setPlan((prev) => {
      const updatedDays = [...prev.days];
      const quantity = 100;

      const calories = (selectedProduct.calories * quantity) / 100;
      const protein = (selectedProduct.protein * quantity) / 100;
      const carbs = (selectedProduct.carbs * quantity) / 100;
      const fat = (selectedProduct.fat * quantity) / 100;

      updatedDays[dayIndex].meals[mealIndex].items.push({
        foodProductId,
        foodProductName: selectedProduct.name,
        quantity,
        calories,
        protein,
        carbs,
        fat,
      });

      return {
        ...prev,
        days: updatedDays,
      };
    });
  };

  const updateFoodItemQuantity = (
    dayIndex: number,
    mealIndex: number,
    itemIndex: number,
    quantity: number
  ) => {
    setPlan((prev) => {
      const updatedDays = [...prev.days];
      const item = updatedDays[dayIndex].meals[mealIndex].items[itemIndex];
      const selectedProduct = foodProducts.find(
        (p) => p.id === item.foodProductId
      );

      if (!selectedProduct) return prev;

      const calories = (selectedProduct.calories * quantity) / 100;
      const protein = (selectedProduct.protein * quantity) / 100;
      const carbs = (selectedProduct.carbs * quantity) / 100;
      const fat = (selectedProduct.fat * quantity) / 100;

      item.quantity = quantity;
      item.calories = calories;
      item.protein = protein;
      item.carbs = carbs;
      item.fat = fat;

      return {
        ...prev,
        days: updatedDays,
      };
    });
  };

  const removeFoodItem = (
    dayIndex: number,
    mealIndex: number,
    itemIndex: number
  ) => {
    setPlan((prev) => {
      const updatedDays = [...prev.days];
      updatedDays[dayIndex].meals[mealIndex].items = updatedDays[
        dayIndex
      ].meals[mealIndex].items.filter((_, index) => index !== itemIndex);
      return {
        ...prev,
        days: updatedDays,
      };
    });
  };

  const calculateMealNutrition = (items: MealItem[]) => {
    return items.reduce(
      (acc, item) => {
        return {
          calories: acc.calories + item.calories,
          protein: acc.protein + item.protein,
          carbs: acc.carbs + item.carbs,
          fat: acc.fat + item.fat,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const calculateDayNutrition = (meals: Meal[]) => {
    return meals.reduce(
      (acc, meal) => {
        const mealNutrition = calculateMealNutrition(meal.items);
        return {
          calories: acc.calories + mealNutrition.calories,
          protein: acc.protein + mealNutrition.protein,
          carbs: acc.carbs + mealNutrition.carbs,
          fat: acc.fat + mealNutrition.fat,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!plan.name) {
      toast({
        title: "Klaida",
        description: "Įveskite plano pavadinimą",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/dashboard/nutrition-plans", {
        method: existingPlan ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plan),
      });

      if (!response.ok) {
        throw new Error("Nepavyko išsaugoti plano");
      }

      const savedPlan = await response.json();

      toast({
        title: "Sėkmingai išsaugota",
        description: "Mitybos planas sėkmingai išsaugotas",
      });

      router.push("/dashboard/mano-mityba");
    } catch (error) {
      console.error("Error saving nutrition plan:", error);
      toast({
        title: "Klaida",
        description: "Nepavyko išsaugoti plano. Bandykite dar kartą.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Plano pavadinimas</Label>
          <Input
            id="name"
            name="name"
            value={plan.name}
            onChange={handlePlanChange}
            placeholder="Pvz., Mano savaitės planas"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Aprašymas (neprivaloma)</Label>
        <Textarea
          id="description"
          name="description"
          value={plan.description}
          onChange={handlePlanChange}
          placeholder="Aprašykite savo mitybos planą..."
          rows={3}
        />
      </div>

      <div className="space-y-6">
        {plan.days.map((day, dayIndex) => (
          <Card key={dayIndex} className="overflow-hidden">
            <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center">
              <h3 className="text-lg font-semibold">Diena {day.dayNumber}</h3>
              {plan.days.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeDay(dayIndex)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Pašalinti dieną
                </Button>
              )}
            </div>
            <CardContent className="p-6">
              <div className="space-y-6">
                {day.meals.map((meal, mealIndex) => {
                  const mealNutrition = calculateMealNutrition(meal.items);

                  return (
                    <div key={mealIndex} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <Input
                            value={meal.name}
                            onChange={(e) =>
                              handleMealNameChange(
                                dayIndex,
                                mealIndex,
                                e.target.value
                              )
                            }
                            className="font-medium w-40"
                          />
                          <div className="text-sm text-gray-500">
                            {mealNutrition.calories.toFixed(0)} kcal | B:{" "}
                            {mealNutrition.protein.toFixed(0)}g | A:{" "}
                            {mealNutrition.carbs.toFixed(0)}g | R:{" "}
                            {mealNutrition.fat.toFixed(0)}g
                          </div>
                        </div>
                        {day.meals.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeMeal(dayIndex, mealIndex)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Pašalinti
                          </Button>
                        )}
                      </div>

                      <div className="space-y-4">
                        {meal.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center gap-2"
                          >
                            <div className="flex-1">{item.foodProductName}</div>
                            <div className="w-24">
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateFoodItemQuantity(
                                    dayIndex,
                                    mealIndex,
                                    itemIndex,
                                    Number.parseInt(e.target.value)
                                  )
                                }
                                className="text-right"
                              />
                            </div>
                            <div className="w-10">g</div>
                            <div className="w-20 text-right">
                              {item.calories.toFixed(0)} kcal
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeFoodItem(dayIndex, mealIndex, itemIndex)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                        <div className="flex items-center gap-2 mt-4">
                          <div className="flex-1">
                            <div className="flex gap-2">
                              <Select
                                onValueChange={(value) =>
                                  addFoodItem(dayIndex, mealIndex, value)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Pasirinkite produktą" />
                                </SelectTrigger>
                                <SelectContent>
                                  {userProducts.length > 0 && (
                                    <>
                                      <div className="px-2 py-1.5 text-sm font-semibold">
                                        Mano produktai
                                      </div>
                                      {userProducts.map((product) => (
                                        <SelectItem
                                          key={product.id}
                                          value={product.id}
                                        >
                                          {product.name}
                                        </SelectItem>
                                      ))}
                                      <div className="px-2 py-1.5 text-sm font-semibold mt-2">
                                        Visi produktai
                                      </div>
                                    </>
                                  )}
                                  {systemProducts.map((product) => (
                                    <SelectItem
                                      key={product.id}
                                      value={product.id}
                                    >
                                      {product.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setIsAddProductModalOpen(true)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="w-24"></div>
                          <div className="w-10"></div>
                          <div className="w-20"></div>
                          <div className="w-9"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addMeal(dayIndex)}
                  className="w-full"
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Pridėti valgį
                </Button>
              </div>

              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="flex justify-between font-medium">
                  <span>Dienos suma:</span>
                  <span>
                    {calculateDayNutrition(day.meals).calories.toFixed(0)} kcal
                    | B: {calculateDayNutrition(day.meals).protein.toFixed(0)}g
                    | A: {calculateDayNutrition(day.meals).carbs.toFixed(0)}g |
                    R: {calculateDayNutrition(day.meals).fat.toFixed(0)}g
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addDay}
          className="w-full"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Pridėti dieną
        </Button>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/mano-mityba")}
        >
          Atšaukti
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saugoma..." : "Išsaugoti planą"}
        </Button>
      </div>

      <AddFoodProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onProductAdded={handleProductAdded}
      />
    </form>
  );
}
