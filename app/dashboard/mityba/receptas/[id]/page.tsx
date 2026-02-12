"use client";

import { use, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Plus } from "lucide-react";
import {
  ClockIcon,
  DifficultyLevel1Icon,
  DifficultyLevel2Icon,
  DifficultyLevel3Icon,
  HeartIcon,
} from "@/components/icons";
import { usePageTitle } from "@/app/dashboard/contexts/page-title-context";
import { Tag } from "@/components/ui/tag";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { CustomSelect } from "@/components/ui/custom-select";

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  preparationTime: number | null;
  cookingTime: number | null;
  servings: number;
  difficulty: string | null;
  instructions: { steps: string[] } | string[];
  totalCalories: number | null;
  totalProtein: number | null;
  totalCarbs: number | null;
  totalFat: number | null;
  category: {
    id: string;
    name: string;
  } | null;
  ingredients: {
    id: string;
    quantity: number;
    unit: string;
    foodProduct: {
      id: string;
      name: string;
    };
  }[];
}

function ServingsIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10 6.25V10L12.5 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { setPageTitle, setShowBackButton, setBackUrl } = usePageTitle();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userPlans, setUserPlans] = useState<{ id: string; name: string }[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedWeekday, setSelectedWeekday] = useState("");
  const [selectedMealName, setSelectedMealName] = useState("");
  const [existingMeals, setExistingMeals] = useState<string[]>([]);
  const [isLoadingMeals, setIsLoadingMeals] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const WEEKDAYS = [
    "Pirmadienis",
    "Antradienis",
    "Trečiadienis",
    "Ketvirtadienis",
    "Penktadienis",
    "Šeštadienis",
    "Sekmadienis",
  ];

  useEffect(() => {
    // Set back button and URL
    setShowBackButton(true);
    setBackUrl("/dashboard/mityba/receptai");

    return () => {
      setShowBackButton(false);
      setBackUrl(null);
      setPageTitle("");
    };
  }, [setShowBackButton, setBackUrl, setPageTitle]);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const response = await fetch(`/api/recipes/${id}`);
        if (response.ok) {
          const data = await response.json();
          setRecipe(data);
          setPageTitle(data.title);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [id, setPageTitle]);

  // Fetch user nutrition plans when modal opens
  useEffect(() => {
    async function fetchUserPlans() {
      try {
        const response = await fetch("/api/user-nutrition-plans");
        if (response.ok) {
          const data = await response.json();
          setUserPlans(data);
        }
      } catch (error) {
        console.error("Error fetching user nutrition plans:", error);
      }
    }

    if (isModalOpen) {
      fetchUserPlans();
      // Set defaults
      const today = new Date();
      const dayIndex = today.getDay();
      setSelectedWeekday(WEEKDAYS[dayIndex === 0 ? 6 : dayIndex - 1]);
      setSelectedMealName("");
      setExistingMeals([]);
    }
  }, [isModalOpen]);

  // Fetch existing meals when plan and weekday are selected
  useEffect(() => {
    async function fetchExistingMeals() {
      if (!selectedPlan || !selectedWeekday) {
        setExistingMeals([]);
        return;
      }

      setIsLoadingMeals(true);
      try {
        // Calculate date based on selected weekday
        // Get the current week's Monday
        const today = new Date();
        const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ...
        const daysFromMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
        const monday = new Date(today);
        monday.setDate(today.getDate() + daysFromMonday);

        // Add days based on selected weekday (WEEKDAYS: 0 = Pirmadienis, 6 = Sekmadienis)
        const targetDayIndex = WEEKDAYS.indexOf(selectedWeekday);
        const targetDate = new Date(monday);
        targetDate.setDate(monday.getDate() + targetDayIndex);

        // Use local date to avoid timezone issues
        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        console.log('Fetching meals for:', { selectedPlan, selectedWeekday, dateString });

        const response = await fetch(
          `/api/user-nutrition-plans/${selectedPlan}/meals?date=${dateString}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log('Received meals:', data);
          const mealNames = data.map((meal: { mealName: string }) => meal.mealName);
          setExistingMeals(mealNames);
          // Auto-select first existing meal or clear selection
          if (mealNames.length > 0) {
            setSelectedMealName(mealNames[0]);
          } else {
            setSelectedMealName("");
          }
        }
      } catch (error) {
        console.error("Error fetching existing meals:", error);
      } finally {
        setIsLoadingMeals(false);
      }
    }

    fetchExistingMeals();
  }, [selectedPlan, selectedWeekday]);

  const handleAddToPlan = async () => {
    if (!selectedPlan || !selectedWeekday || !selectedMealName || !recipe) return;

    setIsAdding(true);
    try {
      // Calculate date based on selected weekday
      // Get the current week's Monday
      const today = new Date();
      const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ...
      const daysFromMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
      const monday = new Date(today);
      monday.setDate(today.getDate() + daysFromMonday);

      // Add days based on selected weekday (WEEKDAYS: 0 = Pirmadienis, 6 = Sekmadienis)
      const targetDayIndex = WEEKDAYS.indexOf(selectedWeekday);
      const targetDate = new Date(monday);
      targetDate.setDate(monday.getDate() + targetDayIndex);

      // Use local date to avoid timezone issues
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const day = String(targetDate.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      // Add recipe ingredients to the plan
      const response = await fetch(`/api/user-nutrition-plans/${selectedPlan}/add-recipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeId: id,
          date: dateString,
          mealName: selectedMealName,
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setSelectedPlan("");
        setSelectedWeekday("");
        setSelectedMealName("");
      } else {
        console.error("Failed to add recipe to plan");
      }
    } catch (error) {
      console.error("Error adding recipe to plan:", error);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <p className="text-[#6B7280]">Receptas nerastas</p>
        <Link
          href="/dashboard/mityba/receptai"
          className="text-brand-green hover:underline mt-2 inline-block"
        >
          Grįžti į receptus
        </Link>
      </div>
    );
  }

  const totalTime =
    (recipe.preparationTime || 0) + (recipe.cookingTime || 0);

  const getDifficultyLabel = (difficulty: string | null) => {
    switch (difficulty) {
      case "easy":
        return "Lengvas";
      case "medium":
        return "Vidutinis";
      case "hard":
        return "Sudėtingas";
      default:
        return "Vidutinis";
    }
  };

  const DifficultyIcon = ({ difficulty }: { difficulty: string | null }) => {
    switch (difficulty) {
      case "easy":
        return <DifficultyLevel1Icon size={16} className="text-[#9FA4B0]" />;
      case "medium":
        return <DifficultyLevel2Icon size={16} className="text-[#9FA4B0]" />;
      case "hard":
        return <DifficultyLevel3Icon size={16} className="text-[#9FA4B0]" />;
      default:
        return <DifficultyLevel1Icon size={16} className="text-[#9FA4B0]" />;
    }
  };

  // Parse instructions
  const getInstructions = (): string[] => {
    if (Array.isArray(recipe.instructions)) {
      return recipe.instructions;
    }
    if (
      typeof recipe.instructions === "object" &&
      recipe.instructions?.steps
    ) {
      return recipe.instructions.steps;
    }
    return [];
  };

  const instructions = getInstructions();

  return (
    <div className="font-[Outfit] mt-3">
      {/* Top section with image and info */}
      <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative">
            <Image
              src={
                imageError || !recipe.image
                  ? "/placeholder.svg?height=400&width=600"
                  : recipe.image
              }
              alt={recipe.title}
              width={600}
              height={400}
              className="w-full h-[400px] object-cover rounded-2xl"
              onError={() => setImageError(true)}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-end">
            {/* Categories and favorite */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {recipe.category && (
                  <Tag>{recipe.category.name}</Tag>
                )}
              </div>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="rounded-full p-2 bg-[#F7F7F7] hover:bg-gray-200 transition-colors"
              >
                <HeartIcon
                  size={18}
                  className={isFavorite ? "text-red-500" : "text-[#9FA4B0]"}
                />
              </button>
            </div>

            {/* Title */}
            <h1 className="text-[36px] font-semibold text-[#101827] mb-4 leading-[90%]" style={{ fontFamily: 'mango, sans-serif' }}>
              {recipe.title}
            </h1>

            {/* Meta info */}
            <div className="flex items-center gap-6 text-sm text-[#9FA4B0] mb-6">
              <div className="flex items-center gap-1.5">
                <ClockIcon size={18} className="text-[#CCCED3]" />
                <span>{totalTime} min</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.66594 5.15626C8.1675 4.53189 8.29125 4.11001 8.23969 3.92439C8.20031 3.7847 8.01375 3.71251 8.01188 3.71251C7.84211 3.65672 7.69784 3.54214 7.60505 3.38942C7.51226 3.23669 7.47706 3.05585 7.50578 2.87947C7.5345 2.70309 7.62525 2.54276 7.76169 2.42736C7.89814 2.31196 8.0713 2.24906 8.25 2.25001C8.32564 2.2501 8.40084 2.26147 8.47312 2.28376C8.56687 2.31282 9.40219 2.59595 9.67219 3.48001C9.90281 4.23657 9.62063 5.11595 8.83406 6.0947C8.3325 6.71907 8.20875 7.14095 8.26031 7.32657C8.29969 7.46626 8.4825 7.53657 8.48438 7.53751C8.65383 7.59321 8.79789 7.70748 8.89069 7.85981C8.98349 8.01214 9.01896 8.19256 8.99074 8.36869C8.96251 8.54482 8.87244 8.70512 8.73668 8.82082C8.60092 8.93652 8.42837 9.00006 8.25 9.00001C8.17436 8.99992 8.09916 8.98855 8.02688 8.96626C7.93313 8.9372 7.09781 8.65407 6.82781 7.77001C6.59719 7.01345 6.87937 6.13407 7.66594 5.15626ZM10.5778 7.77095C10.8478 8.65501 11.6831 8.93814 11.7769 8.9672C11.8492 8.98917 11.9244 9.00023 12 9.00001C12.1784 9.00006 12.3509 8.93652 12.4867 8.82082C12.6224 8.70512 12.7125 8.54482 12.7407 8.36869C12.769 8.19256 12.7335 8.01214 12.6407 7.85981C12.5479 7.70748 12.4038 7.59321 12.2344 7.53751C12.2344 7.53751 12.0469 7.46626 12.0103 7.32657C11.9587 7.13907 12.0825 6.71907 12.5841 6.0947C13.3706 5.11595 13.6528 4.23657 13.4222 3.48001C13.1522 2.59595 12.3178 2.31282 12.2231 2.28376C12.1508 2.26147 12.0756 2.2501 12 2.25001C11.8218 2.24975 11.6493 2.31294 11.5135 2.42827C11.3776 2.5436 11.2873 2.70353 11.2587 2.87941C11.23 3.05528 11.2649 3.23562 11.3571 3.3881C11.4493 3.54059 11.5928 3.65526 11.7619 3.71157C11.7619 3.71157 11.9494 3.78376 11.9897 3.92345C12.0413 4.11095 11.9175 4.53095 11.4159 5.15532C10.6294 6.13407 10.3472 7.01345 10.5778 7.77001V7.77095ZM14.3278 7.77095C14.5978 8.65501 15.4331 8.93814 15.5269 8.9672C15.5992 8.98917 15.6744 9.00023 15.75 9.00001C15.9284 9.00006 16.1009 8.93652 16.2367 8.82082C16.3724 8.70512 16.4625 8.54482 16.4907 8.36869C16.519 8.19256 16.4835 8.01214 16.3907 7.85981C16.2979 7.70748 16.1538 7.59321 15.9844 7.53751C15.9844 7.53751 15.7969 7.46626 15.7603 7.32657C15.7087 7.13907 15.8325 6.71907 16.3341 6.0947C17.1206 5.11595 17.4028 4.23657 17.1722 3.48001C16.9022 2.59595 16.0678 2.31282 15.9731 2.28376C15.9008 2.26147 15.8256 2.2501 15.75 2.25001C15.5718 2.24975 15.3993 2.31294 15.2635 2.42827C15.1276 2.5436 15.0373 2.70353 15.0087 2.87941C14.98 3.05528 15.0149 3.23562 15.1071 3.3881C15.1993 3.54059 15.3428 3.65526 15.5119 3.71157C15.5119 3.71157 15.6994 3.78376 15.7397 3.92345C15.7913 4.11095 15.6675 4.53095 15.1659 5.15532C14.3794 6.13407 14.0972 7.01345 14.3278 7.77001V7.77095ZM21 10.5H3C2.80109 10.5 2.61032 10.579 2.46967 10.7197C2.32902 10.8603 2.25 11.0511 2.25 11.25C2.2533 13.0336 2.74415 14.7824 3.66948 16.3072C4.59481 17.832 5.9194 19.0748 7.5 19.9013V20.25C7.5 20.6478 7.65804 21.0294 7.93934 21.3107C8.22064 21.592 8.60218 21.75 9 21.75H15C15.3978 21.75 15.7794 21.592 16.0607 21.3107C16.342 21.0294 16.5 20.6478 16.5 20.25V19.9013C18.0806 19.0748 19.4052 17.832 20.3305 16.3072C21.2558 14.7824 21.7467 13.0336 21.75 11.25C21.75 11.0511 21.671 10.8603 21.5303 10.7197C21.3897 10.579 21.1989 10.5 21 10.5Z"
                    fill="#CCCED3"
                  />
                </svg>
                <span>{recipe.servings} Porcijos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DifficultyIcon difficulty={recipe.difficulty} />
                <span>{getDifficultyLabel(recipe.difficulty)}</span>
              </div>
            </div>

            {/* Add to meal plan button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="self-start bg-[#60988E] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#34786C] transition-colors"
            >
              Pridėti receptą į mitybos planą
            </button>
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - About and Ingredients */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
            <h2 className="text-[30px] font-semibold text-[#101827] mb-4 leading-[90%]" style={{ fontFamily: 'mango, sans-serif' }}>
              Apie patiekalą
            </h2>
            <p className="text-[#6B7280] text-sm leading-relaxed">
              {recipe.description || "Aprašymas nepateiktas."}
            </p>
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
            <h2 className="text-[30px] font-semibold text-[#101827] mb-4 leading-[90%]" style={{ fontFamily: 'mango, sans-serif' }}>
              Ingredientai
            </h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient) => (
                <li
                  key={ingredient.id}
                  className="flex items-start gap-2 text-sm text-[#101827]"
                >
                  <span className="text-[#9FA4B0]">•</span>
                  <span>
                    {ingredient.quantity} {ingredient.unit}{" "}
                    {ingredient.foodProduct.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
            <h2 className="text-[30px] font-semibold text-[#101827] mb-4 leading-[90%]" style={{ fontFamily: 'mango, sans-serif' }}>
              Gaminimo instrukcija
            </h2>
            <ol className="space-y-6">
              {instructions.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full border border-[#FAC64B] bg-[#FFF7DF] text-[#FAC64B] flex items-center justify-center text-[13px] font-semibold">
                    {index + 1}
                  </span>
                  <p className="text-[16px] text-[#555B65] leading-[140%] tracking-[-0.32px] pt-2.5">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right column - Nutrition */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="text-[30px] font-semibold text-[#101827] leading-[90%]" style={{ fontFamily: 'mango, sans-serif' }}>
                Maistinė vertė
              </h2>
              <span className="text-xs text-[#9FA4B0]">Vienai porcijai</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-[#E6E6E6]">
                <span className="text-sm text-[#101827]">Energinė vertė:</span>
                <span className="text-sm text-[#101827]">
                  {recipe.totalCalories
                    ? Math.round(recipe.totalCalories / recipe.servings)
                    : 0}{" "}
                  kcal
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#E6E6E6]">
                <span className="text-sm text-[#101827]">Baltymai</span>
                <span className="text-sm text-[#101827]">
                  {recipe.totalProtein
                    ? Math.round(recipe.totalProtein / recipe.servings)
                    : 0}{" "}
                  g
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#E6E6E6]">
                <span className="text-sm text-[#101827]">Angliavandeniai</span>
                <span className="text-sm text-[#101827]">
                  {recipe.totalCarbs
                    ? Math.round(recipe.totalCarbs / recipe.servings)
                    : 0}{" "}
                  g
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-[#101827]">Riebalai</span>
                <span className="text-sm text-[#101827]">
                  {recipe.totalFat
                    ? Math.round(recipe.totalFat / recipe.servings)
                    : 0}{" "}
                  g
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add to plan modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlan("");
          setSelectedWeekday("");
          setSelectedMealName("");
        }}
        title="Pridėti receptą į planą"
        footer={
          <ModalFooter
            onCancel={() => {
              setIsModalOpen(false);
              setSelectedPlan("");
              setSelectedWeekday("");
              setSelectedMealName("");
            }}
            onConfirm={handleAddToPlan}
            cancelText="Atšaukti"
            confirmText={isAdding ? "Pridedama..." : "Pridėti"}
            confirmDisabled={!selectedPlan || !selectedWeekday || !selectedMealName || isAdding}
          />
        }
      >
        <div className="space-y-4">
          <CustomSelect
            options={userPlans.map((plan) => ({
              id: plan.id,
              label: plan.name,
            }))}
            value={selectedPlan}
            onChange={setSelectedPlan}
            placeholder="Pasirinkite savo planą"
          />
          <CustomSelect
            options={WEEKDAYS.map((day) => ({
              id: day,
              label: day,
            }))}
            value={selectedWeekday}
            onChange={setSelectedWeekday}
            placeholder="Savaitės diena"
          />
          <MealSelectWithCreate
            existingMeals={existingMeals}
            value={selectedMealName}
            onChange={setSelectedMealName}
            isLoading={isLoadingMeals}
            disabled={!selectedPlan || !selectedWeekday}
          />
        </div>
      </Modal>
    </div>
  );
}

// Custom meal select with ability to create new meal
function MealSelectWithCreate({
  existingMeals,
  value,
  onChange,
  isLoading,
  disabled,
}: {
  existingMeals: string[];
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  disabled: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [newMealName, setNewMealName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsCreating(false);
        setNewMealName("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  const handleSelect = (mealName: string) => {
    onChange(mealName);
    setIsOpen(false);
    setIsCreating(false);
    setNewMealName("");
  };

  const handleCreateNew = () => {
    if (newMealName.trim()) {
      handleSelect(newMealName.trim());
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-3 py-3 border border-[#E6E6E6] rounded-lg text-[14px] text-left flex items-center justify-between transition-colors ${
          disabled
            ? "bg-gray-50 cursor-not-allowed text-[#9FA4B0]"
            : "hover:border-[#60988E] focus:outline-none focus:border-[#60988E]"
        }`}
      >
        <span className={value ? "text-[#101827]" : "text-[#9FA4B0]"}>
          {isLoading ? "Kraunama..." : value || "Pasirinkite valgymą"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#9FA4B0] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#E6E6E6] rounded-lg shadow-lg overflow-hidden">
          {/* Existing meals section */}
          {existingMeals.length > 0 && (
            <div>
              <div className="px-3 py-2 text-[11px] font-medium text-[#9FA4B0] uppercase tracking-wide bg-[#F7F7F7]">
                Esami valgymai
              </div>
              {existingMeals.map((meal) => (
                <button
                  key={meal}
                  type="button"
                  onClick={() => handleSelect(meal)}
                  className={`w-full px-3 py-2.5 text-left text-[14px] hover:bg-[#F7F7F7] transition-colors ${
                    value === meal ? "bg-[#FFF7DF] text-[#101827]" : "text-[#101827]"
                  }`}
                >
                  {meal}
                </button>
              ))}
            </div>
          )}

          {/* Create new meal section */}
          <div className={existingMeals.length > 0 ? "border-t border-[#E6E6E6]" : ""}>
            <div className="px-3 py-2 text-[11px] font-medium text-[#9FA4B0] uppercase tracking-wide bg-[#F7F7F7]">
              Sukurti naują valgymą
            </div>
            {isCreating ? (
              <div className="p-3">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newMealName}
                    onChange={(e) => setNewMealName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCreateNew();
                      } else if (e.key === "Escape") {
                        setIsCreating(false);
                        setNewMealName("");
                      }
                    }}
                    placeholder="Valgymo pavadinimas"
                    className="flex-1 px-3 py-2 border border-[#E6E6E6] rounded-lg text-[14px] text-[#101827] placeholder:text-[#9FA4B0] focus:outline-none focus:border-[#60988E]"
                  />
                  <button
                    type="button"
                    onClick={handleCreateNew}
                    disabled={!newMealName.trim()}
                    className="px-4 py-2 bg-[#60988E] text-white rounded-lg text-[14px] font-medium hover:bg-[#4d7a72] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Pridėti
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="w-full px-3 py-2.5 text-left text-[14px] hover:bg-[#F7F7F7] flex items-center gap-2 text-[#60988E] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Įrašyti pavadinimą...
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
