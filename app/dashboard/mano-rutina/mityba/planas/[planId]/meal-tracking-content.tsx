"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { CustomTabs } from "@/components/ui/custom-tabs";
import MealCard from "./meal-card";
import { usePageTitle } from "@/app/dashboard/contexts/page-title-context";
import { SuccessModal } from "@/components/ui/modal";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface UserNutritionPlan {
  id: string;
  name: string;
  goal: string;
  activityLevel: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  bmr: number;
  tdee: number;
  targetCalories: number;
  icon: string | null;
  isActive: boolean;
}

interface MealLogItem {
  id: string;
  foodProductId: string | null;
  foodProductName: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealLog {
  id: string;
  date: string;
  mealName: string;
  mealOrder: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  items: MealLogItem[];
}

interface MealTrackingContentProps {
  plan: UserNutritionPlan;
  userWeight: number;
}

const DAYS_LT = [
  { id: "monday", label: "Pirmadienis", short: "Pir" },
  { id: "tuesday", label: "Antradienis", short: "Ant" },
  { id: "wednesday", label: "Trečiadienis", short: "Tre" },
  { id: "thursday", label: "Ketvirtadienis", short: "Ketv" },
  { id: "friday", label: "Penktadienis", short: "Pen" },
  { id: "saturday", label: "Šeštadienis", short: "Šeš" },
  { id: "sunday", label: "Sekmadienis", short: "Sek" },
];

const DEFAULT_MEALS = [
  { name: "Pusryčiai", order: 0 },
  { name: "Pietūs", order: 1 },
  { name: "Vakarienė", order: 2 },
];

function getWeekDates(date: Date): { start: Date; end: Date; dates: Date[] } {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(date);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);

  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return { start: monday, end: sunday, dates };
}

function formatDateRange(start: Date, end: Date): string {
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  const startStr = start.toLocaleDateString("lt-LT", { day: "numeric", month: "long" });
  const endStr = end.toLocaleDateString("lt-LT", options);
  return `${startStr} – ${endStr}`;
}

function formatDateForApi(date: Date): string {
  // Use local date to avoid timezone issues
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function MealTrackingContent({ plan, userWeight }: MealTrackingContentProps) {
  const router = useRouter();
  const { setPageTitle, setShowBackButton, setBackUrl } = usePageTitle();

  // Set page title to plan name
  useEffect(() => {
    setPageTitle(plan.name);
    setShowBackButton(true);
    setBackUrl("/dashboard/mano-rutina/mityba");
  }, [plan.name, setPageTitle, setShowBackButton, setBackUrl]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1; // Convert Sunday=0 to index 6, Monday=1 to index 0
  });
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMealName, setNewMealName] = useState<string | null>(null);

  // Delete success modal state
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [deletedMealName, setDeletedMealName] = useState("");

  // Copy success modal state
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [copiedMealName, setCopiedMealName] = useState("");

  // Rename success modal state
  const [showRenameSuccess, setShowRenameSuccess] = useState(false);
  const [renamedMealName, setRenamedMealName] = useState("");

  // Clipboard state for copy/paste
  interface ClipboardItem {
    foodProductId: string | null;
    foodProductName: string;
    quantity: number;
    unit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }
  const [clipboard, setClipboard] = useState<{ sourceMealId: string; items: ClipboardItem[] } | null>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const weekData = useMemo(() => getWeekDates(currentDate), [currentDate]);
  const selectedDate = weekData.dates[selectedDayIndex];

  // Calculate daily macros targets based on plan
  const macroTargets = useMemo(() => {
    const calories = plan.targetCalories;
    // Standard macro split: 30% protein, 40% carbs, 30% fat
    // Adjust based on goal
    let proteinRatio = 0.30;
    let carbsRatio = 0.40;
    let fatRatio = 0.30;

    if (plan.goal === "lose") {
      proteinRatio = 0.35; // Higher protein for satiety
      carbsRatio = 0.35;
      fatRatio = 0.30;
    } else if (plan.goal === "gain") {
      proteinRatio = 0.30;
      carbsRatio = 0.45; // Higher carbs for energy
      fatRatio = 0.25;
    }

    return {
      calories,
      protein: Math.round((calories * proteinRatio) / 4), // 4 cal per gram
      carbs: Math.round((calories * carbsRatio) / 4),
      fat: Math.round((calories * fatRatio) / 9), // 9 cal per gram
      proteinPerKg: (Math.round((calories * proteinRatio) / 4) / userWeight).toFixed(1),
      carbsPerKg: (Math.round((calories * carbsRatio) / 4) / userWeight).toFixed(1),
      fatPerKg: (Math.round((calories * fatRatio) / 9) / userWeight).toFixed(1),
    };
  }, [plan.targetCalories, plan.goal, userWeight]);

  // Memoize date strings to prevent infinite loops
  const startDateStr = formatDateForApi(weekData.start);
  const endDateStr = formatDateForApi(weekData.end);

  // Fetch meal logs for current week
  useEffect(() => {
    async function fetchMealLogs() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/meal-logs?planId=${plan.id}&startDate=${startDateStr}&endDate=${endDateStr}`
        );
        if (response.ok) {
          const data = await response.json();
          setMealLogs(data);
        }
      } catch (error) {
        console.error("Error fetching meal logs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMealLogs();
  }, [plan.id, startDateStr, endDateStr]);

  // Filter meals for selected day
  const selectedDayMeals = useMemo(() => {
    const dateStr = formatDateForApi(selectedDate);
    return mealLogs.filter((log) => log.date.split("T")[0] === dateStr);
  }, [mealLogs, selectedDate]);

  // Calculate daily totals
  const dailyTotals = useMemo(() => {
    return selectedDayMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.totalCalories,
        protein: acc.protein + meal.totalProtein,
        carbs: acc.carbs + meal.totalCarbs,
        fat: acc.fat + meal.totalFat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [selectedDayMeals]);

  // Calculate weekly totals per day for progress circles
  const weeklyProgress = useMemo(() => {
    return weekData.dates.map((date) => {
      const dateStr = formatDateForApi(date);
      const dayMeals = mealLogs.filter((log) => log.date.split("T")[0] === dateStr);
      const totalCalories = dayMeals.reduce((sum, m) => sum + m.totalCalories, 0);
      return totalCalories;
    });
  }, [mealLogs, weekData.dates]);

  // Week navigation
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Add new meal
  const handleAddMeal = async (mealName: string) => {
    try {
      const response = await fetch("/api/meal-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userNutritionPlanId: plan.id,
          date: formatDateForApi(selectedDate),
          mealName,
          mealOrder: selectedDayMeals.length,
        }),
      });

      if (response.ok) {
        const newMeal = await response.json();
        setMealLogs((prev) => [...prev, newMeal]);
        setNewMealName(null);
      }
    } catch (error) {
      console.error("Error creating meal:", error);
    }
  };

  // Delete meal
  const handleDeleteMeal = async (mealId: string, mealName: string) => {
    try {
      const response = await fetch(`/api/meal-logs/${mealId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMealLogs((prev) => prev.filter((m) => m.id !== mealId));
        setDeletedMealName(mealName);
        setShowDeleteSuccess(true);
      }
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  // Add food item to meal
  const handleAddFoodItem = async (mealLogId: string, product: {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    serving: number;
  }, quantity: number) => {
    const multiplier = quantity / 100; // Products are per 100g

    try {
      const response = await fetch(`/api/meal-logs/${mealLogId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foodProductId: product.id,
          foodProductName: product.name,
          quantity: Math.round(quantity),
          unit: "g",
          calories: Math.round(product.calories * multiplier),
          protein: Math.round(product.protein * multiplier),
          carbs: Math.round(product.carbs * multiplier),
          fat: Math.round(product.fat * multiplier),
        }),
      });

      if (response.ok) {
        // Refresh meal logs
        const logsResponse = await fetch(
          `/api/meal-logs?planId=${plan.id}&startDate=${startDateStr}&endDate=${endDateStr}`
        );
        if (logsResponse.ok) {
          const data = await logsResponse.json();
          setMealLogs(data);
        }
      }
    } catch (error) {
      console.error("Error adding food item:", error);
    }
  };

  // Update food item quantity
  const handleUpdateItemQuantity = async (itemId: string, quantity: number) => {
    try {
      const response = await fetch(`/api/meal-logs/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        // Refresh meal logs
        const logsResponse = await fetch(
          `/api/meal-logs?planId=${plan.id}&startDate=${startDateStr}&endDate=${endDateStr}`
        );
        if (logsResponse.ok) {
          const data = await logsResponse.json();
          setMealLogs(data);
        }
      }
    } catch (error) {
      console.error("Error updating food item:", error);
    }
  };

  // Delete food item
  const handleDeleteFoodItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/meal-logs/items/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh meal logs
        const logsResponse = await fetch(
          `/api/meal-logs?planId=${plan.id}&startDate=${startDateStr}&endDate=${endDateStr}`
        );
        if (logsResponse.ok) {
          const data = await logsResponse.json();
          setMealLogs(data);
        }
      }
    } catch (error) {
      console.error("Error deleting food item:", error);
    }
  };

  // Rename meal
  const handleRenameMeal = async (mealId: string, newName: string) => {
    try {
      const response = await fetch(`/api/meal-logs/${mealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealName: newName }),
      });

      if (response.ok) {
        // Update local state
        setMealLogs((prev) =>
          prev.map((meal) =>
            meal.id === mealId ? { ...meal, mealName: newName } : meal
          )
        );
        setRenamedMealName(newName);
        setShowRenameSuccess(true);
      }
    } catch (error) {
      console.error("Error renaming meal:", error);
    }
  };

  // Copy meal items to clipboard
  const handleCopyMealItems = (mealId: string, mealName: string, items: ClipboardItem[]) => {
    setClipboard({ sourceMealId: mealId, items });
    setCopiedMealName(mealName);
    setShowCopySuccess(true);
  };

  // Paste clipboard items to a meal
  const handlePasteMealItems = async (targetMealId: string) => {
    if (!clipboard || clipboard.items.length === 0) return;

    try {
      // Add each item from clipboard to target meal
      for (const item of clipboard.items) {
        await fetch(`/api/meal-logs/${targetMealId}/items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            foodProductId: item.foodProductId,
            foodProductName: item.foodProductName,
            quantity: item.quantity,
            unit: item.unit,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat,
          }),
        });
      }

      // Clear clipboard after paste
      setClipboard(null);

      // Refresh meal logs
      const logsResponse = await fetch(
        `/api/meal-logs?planId=${plan.id}&startDate=${startDateStr}&endDate=${endDateStr}`
      );
      if (logsResponse.ok) {
        const data = await logsResponse.json();
        setMealLogs(data);
      }
    } catch (error) {
      console.error("Error pasting meal items:", error);
    }
  };

  // Handle drag end for reordering meals
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = selectedDayMeals.findIndex((meal) => meal.id === active.id);
      const newIndex = selectedDayMeals.findIndex((meal) => meal.id === over.id);

      // Optimistically update UI
      const reorderedMeals = arrayMove(selectedDayMeals, oldIndex, newIndex);

      // Update local state
      setMealLogs((prev) => {
        const dateStr = formatDateForApi(selectedDate);
        const otherMeals = prev.filter((log) => log.date.split("T")[0] !== dateStr);
        const updatedMeals = reorderedMeals.map((meal, index) => ({
          ...meal,
          mealOrder: index,
        }));
        return [...otherMeals, ...updatedMeals];
      });

      // Update order on server
      try {
        await fetch("/api/meal-logs/reorder", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            meals: reorderedMeals.map((meal, index) => ({
              id: meal.id,
              mealOrder: index,
            })),
          }),
        });
      } catch (error) {
        console.error("Error reordering meals:", error);
      }
    }
  };

  // Calculate progress percentage
  const progressPercent = macroTargets.calories > 0
    ? Math.round((dailyTotals.calories / macroTargets.calories) * 100)
    : 0;

  // Week total calories
  const weekTotalCalories = weeklyProgress.reduce((sum, cal) => sum + cal, 0);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Weekly overview */}
        <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6 mb-6">
          <div className="flex items-start justify-between">
            {/* Left side - title and calories */}
            <div className="flex-1 max-w-[50%]">
              <h1
                className="text-[36px] font-semibold text-[#101827] mb-4"
                style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
              >
                Tavo progresas
              </h1>
              <p className="text-[16px] font-medium text-[#101827] font-[Outfit]" style={{ lineHeight: "120%" }}>
                {weekTotalCalories} kcal
              </p>
              <p className="text-[14px] text-[#6B7280]">Suvartota šią savaitę</p>
              <div className="mt-2">
                <div className="h-2 bg-[#F0F0F0] rounded-full">
                  <div
                    className="h-full bg-[#60988E] rounded-full"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[14px] text-[#6B7280]">{dailyTotals.calories} kcal</span>
                  <span className="text-[14px] text-[#6B7280]">{progressPercent}%</span>
                </div>
              </div>
            </div>

            {/* Right side - week navigation and day circles */}
            <div className="flex-1 max-w-[50%] ml-8">
              {/* Week navigation */}
              <div className="flex justify-center mb-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#EFEFEF] bg-white">
                  <button
                    onClick={goToPreviousWeek}
                    className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#6B7280]" />
                  </button>
                  <span className="text-[14px] font-medium text-[#101827]">
                    {formatDateRange(weekData.start, weekData.end)}
                  </span>
                  <button
                    onClick={goToNextWeek}
                    className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full"
                  >
                    <ChevronRight className="w-4 h-4 text-[#6B7280]" />
                  </button>
                </div>
              </div>
              {/* Day circles */}
              <div className="flex justify-between">
              {DAYS_LT.map((day, index) => {
                const dayCalories = weeklyProgress[index];
                const isSelected = index === selectedDayIndex;
                const hasData = dayCalories > 0;
                const dayProgress = Math.min((dayCalories / macroTargets.calories) * 100, 100);

                return (
                  <div
                    key={day.id}
                    className="flex flex-col items-center gap-1"
                  >
                    <span className="text-[13px] font-medium text-[#101827] font-[Outfit] text-center" style={{ lineHeight: "120%" }}>
                      {day.short}
                    </span>
                    <div className="relative w-14 h-14 rounded-full flex items-center justify-center">
                      {/* Progress circle */}
                      <svg className="w-14 h-14 -rotate-90" style={{ opacity: 0.85 }}>
                        <circle
                          cx="28"
                          cy="28"
                          r="24"
                          fill="none"
                          stroke="rgba(187, 177, 252, 0.25)"
                          strokeWidth="5"
                        />
                        {hasData && (
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            fill="none"
                            stroke="#BBB1FC"
                            strokeWidth="5"
                            strokeDasharray={`${dayProgress * 1.508} 150.8`}
                            strokeLinecap="round"
                          />
                        )}
                      </svg>
                    </div>
                    <span className="text-[11px] text-[#6B7280]">{dayCalories} kcal</span>
                  </div>
                );
              })}
              </div>
            </div>
          </div>
        </div>

        {/* Day content - tabs, macros, meals in one container */}
        <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
          {/* Day tabs */}
          <CustomTabs
            tabs={DAYS_LT.map((day) => ({ id: day.id, label: day.label }))}
            activeTab={DAYS_LT[selectedDayIndex].id}
            onTabChange={(tabId) => {
              const index = DAYS_LT.findIndex((d) => d.id === tabId);
              setSelectedDayIndex(index);
            }}
            fullWidth
            className="mb-6"
          />

          {/* Macro distribution */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-medium text-[#101827]">Maisto medžiagų pasiskirstymas</h2>
              <button className="text-[#60988E] text-[14px] font-medium hover:underline">
                Redaguoti
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {/* Calories */}
              <div className="bg-[#F9F9F9] rounded-xl p-4 flex items-center gap-4">
                <div className="relative w-14 h-14 flex-shrink-0">
                  <svg className="w-14 h-14 -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="rgba(187, 177, 252, 0.25)"
                      strokeWidth="5"
                    />
                    {dailyTotals.calories > 0 && (
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        fill="none"
                        stroke="#BBB1FC"
                        strokeWidth="5"
                        strokeDasharray={`${Math.min((dailyTotals.calories / macroTargets.calories) * 100, 100) * 1.508} 150.8`}
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                </div>
                <div>
                  <span className="text-[14px] text-[#6B7280]">Kalorijos</span>
                  <p className="text-[18px] font-semibold text-[#101827]">
                    {dailyTotals.calories}
                    <span className="text-[14px] font-normal text-[#9FA4B0]"> / {macroTargets.calories} kcal</span>
                  </p>
                </div>
              </div>

              {/* Carbs */}
              <div className="bg-[#F9F9F9] rounded-xl p-4 flex items-center gap-4">
                <div className="relative w-14 h-14 flex-shrink-0">
                  <svg className="w-14 h-14 -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="rgba(187, 177, 252, 0.25)"
                      strokeWidth="5"
                    />
                    {dailyTotals.carbs > 0 && (
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        fill="none"
                        stroke="#51BD9B"
                        strokeWidth="5"
                        strokeDasharray={`${Math.min((dailyTotals.carbs / macroTargets.carbs) * 100, 100) * 1.508} 150.8`}
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                </div>
                <div>
                  <span className="text-[14px] text-[#6B7280]">Angliavandeniai</span>
                  <p className="text-[18px] font-semibold text-[#101827]">
                    {Math.round(dailyTotals.carbs)} g
                    <span className="text-[14px] font-normal text-[#9FA4B0]"> / {macroTargets.carbsPerKg} g/kg</span>
                  </p>
                </div>
              </div>

              {/* Protein */}
              <div className="bg-[#F9F9F9] rounded-xl p-4 flex items-center gap-4">
                <div className="relative w-14 h-14 flex-shrink-0">
                  <svg className="w-14 h-14 -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="rgba(187, 177, 252, 0.25)"
                      strokeWidth="5"
                    />
                    {dailyTotals.protein > 0 && (
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        fill="none"
                        stroke="#F98466"
                        strokeWidth="5"
                        strokeDasharray={`${Math.min((dailyTotals.protein / macroTargets.protein) * 100, 100) * 1.508} 150.8`}
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                </div>
                <div>
                  <span className="text-[14px] text-[#6B7280]">Baltymai</span>
                  <p className="text-[18px] font-semibold text-[#101827]">
                    {Math.round(dailyTotals.protein)} g
                    <span className="text-[14px] font-normal text-[#9FA4B0]"> / {macroTargets.proteinPerKg} g/kg</span>
                  </p>
                </div>
              </div>

              {/* Fat */}
              <div className="bg-[#F9F9F9] rounded-xl p-4 flex items-center gap-4">
                <div className="relative w-14 h-14 flex-shrink-0">
                  <svg className="w-14 h-14 -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="rgba(187, 177, 252, 0.25)"
                      strokeWidth="5"
                    />
                    {dailyTotals.fat > 0 && (
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        fill="none"
                        stroke="#334BA3"
                        strokeWidth="5"
                        strokeDasharray={`${Math.min((dailyTotals.fat / macroTargets.fat) * 100, 100) * 1.508} 150.8`}
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                </div>
                <div>
                  <span className="text-[14px] text-[#6B7280]">Riebalai</span>
                  <p className="text-[18px] font-semibold text-[#101827]">
                    {Math.round(dailyTotals.fat)} g
                    <span className="text-[14px] font-normal text-[#9FA4B0]"> / {macroTargets.fatPerKg} g/kg</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Meals section */}
          <div>
            <h2 className="text-[18px] font-medium text-[#101827] mb-4">Visos dienos valgymai</h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#60988E]" />
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={selectedDayMeals.map((meal) => meal.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {/* Existing meals */}
                  {selectedDayMeals.map((meal) => (
                    <MealCard
                      key={meal.id}
                      meal={meal}
                      macroTargets={macroTargets}
                      onAddItem={(product, quantity) => handleAddFoodItem(meal.id, product, quantity)}
                      onUpdateItemQuantity={handleUpdateItemQuantity}
                      onDeleteItem={handleDeleteFoodItem}
                      onDeleteMeal={() => handleDeleteMeal(meal.id, meal.mealName)}
                      onRenameMeal={(newName) => handleRenameMeal(meal.id, newName)}
                      clipboard={clipboard}
                      onCopy={handleCopyMealItems}
                      onPaste={() => handlePasteMealItems(meal.id)}
                    />
                  ))}

              {/* Add new meal */}
              {newMealName !== null ? (
                <div className="border border-dashed border-[#E6E6E6] rounded-xl p-4">
                  <input
                    type="text"
                    value={newMealName}
                    onChange={(e) => setNewMealName(e.target.value)}
                    placeholder="Valgymo pavadinimas (pvz. Pusryčiai)"
                    className="w-full px-3 py-2 border border-[#E6E6E6] rounded-lg mb-3"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (newMealName.trim()) {
                          handleAddMeal(newMealName.trim());
                        }
                      }}
                      disabled={!newMealName.trim()}
                      className="px-4 py-2 bg-[#60988E] text-white rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                      Pridėti
                    </button>
                    <button
                      onClick={() => setNewMealName(null)}
                      className="px-4 py-2 border border-[#E6E6E6] rounded-lg text-sm font-medium"
                    >
                      Atšaukti
                    </button>
                  </div>
                </div>
              ) : null}
                </div>
              </SortableContext>
            </DndContext>
          )}
          </div>

          {/* Add new meal button */}
          {newMealName === null && (
            <div className="border-t border-[#EFEFEF] mt-6 pt-4">
              <button
                onClick={() => setNewMealName("")}
                className="flex items-center gap-2 text-[#60988E] text-[14px] font-medium hover:opacity-80"
              >
                <Plus className="w-4 h-4" />
                Naujas valgymas
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Delete Success Modal */}
      <SuccessModal
        isOpen={showDeleteSuccess}
        onClose={() => setShowDeleteSuccess(false)}
        title={`Valgymas ${deletedMealName} sėkmingai ištrintas!`}
        highlightText={deletedMealName}
        buttonText="Gerai"
        onButtonClick={() => setShowDeleteSuccess(false)}
        variant="delete"
      />

      {/* Copy Success Modal */}
      <SuccessModal
        isOpen={showCopySuccess}
        onClose={() => setShowCopySuccess(false)}
        title={`Valgymo ${copiedMealName} produktai nukopijuoti! Dabar galite juos įklijuoti į kitus valgymus.`}
        highlightText={copiedMealName}
        buttonText="Supratau"
        onButtonClick={() => setShowCopySuccess(false)}
      />

      {/* Rename Success Modal */}
      <SuccessModal
        isOpen={showRenameSuccess}
        onClose={() => setShowRenameSuccess(false)}
        title={`Valgymo pavadinimas sėkmingai pakeistas į ${renamedMealName}!`}
        highlightText={renamedMealName}
        buttonText="Gerai"
        onButtonClick={() => setShowRenameSuccess(false)}
      />
    </div>
  );
}
