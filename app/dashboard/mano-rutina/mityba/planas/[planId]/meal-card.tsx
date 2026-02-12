"use client";

import { useState, useRef, useEffect } from "react";
import { Trash2, ChevronUp, ChevronDown, GripVertical, Plus } from "lucide-react";
import FoodProductSelect from "./food-product-select";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Modal, ModalFooter, SuccessModal } from "@/components/ui/modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";

const CopyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.8125 14.8125H18.1875V5.8125H9.1875V9.1875" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.8125 9.1875H5.8125V18.1875H14.8125V9.1875Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PasteIcon = () => (
  <svg width="24" height="24" viewBox="-5 -5 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.59836 1.28255H9.33911C10.0374 1.28255 10.3866 1.28255 10.6036 1.50222C10.8205 1.72189 10.8205 2.07544 10.8205 2.78255V5.44922M8.59836 1.28255V1.94922C8.59836 2.30277 8.59836 2.47955 8.48986 2.58939C8.38136 2.69922 8.20678 2.69922 7.85761 2.69922H3.41316C3.06397 2.69922 2.88938 2.69922 2.7809 2.58939C2.67242 2.47955 2.67242 2.30277 2.67242 1.94922V1.28255M8.59836 1.28255C8.59836 0.929002 8.59836 0.668886 8.48986 0.559052C8.38136 0.449219 8.20678 0.449219 7.85761 0.449219H3.41316C3.06397 0.449219 2.88938 0.449219 2.7809 0.559052C2.67242 0.668886 2.67242 0.929002 2.67242 1.28255M2.67242 1.28255H1.93168C1.2333 1.28255 0.884112 1.28255 0.667154 1.50222C0.450196 1.72189 0.450195 2.07544 0.450195 2.78255V11.4458C0.450195 12.153 0.450196 12.5065 0.667154 12.7261C0.884112 12.9458 1.2333 12.9458 1.93168 12.9458H5.26501M8.78353 13.7826H12.1169C12.9025 13.7826 13.2954 13.7826 13.5394 13.5385C13.7835 13.2944 13.7835 12.9016 13.7835 12.1159V8.78255C13.7835 7.99688 13.7835 7.60405 13.5394 7.35997C13.2954 7.11588 12.9025 7.11588 12.1169 7.11588H8.78353C7.99786 7.11588 7.60503 7.11588 7.36094 7.35997C7.11686 7.60405 7.11686 7.99688 7.11686 8.78255V12.1159C7.11686 12.9016 7.11686 13.2944 7.36094 13.5385C7.60503 13.7826 7.99786 13.7826 8.78353 13.7826Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.65215 18H6.52174C6.38336 18 6.25066 17.945 6.15281 17.8472C6.05497 17.7493 6 17.6166 6 17.4783V14.5637C6.00006 14.4255 6.05495 14.293 6.15261 14.1952L14.1952 6.15269C14.293 6.05492 14.4256 6 14.564 6C14.7023 6 14.8349 6.05492 14.9328 6.15269L17.8473 9.06528C17.9451 9.16311 18 9.29577 18 9.43408C18 9.57239 17.9451 9.70505 17.8473 9.80288L9.65215 18Z" stroke="currentColor" strokeWidth="1.28" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.4764 18H9.65039" stroke="currentColor" strokeWidth="1.28" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.2588 8.08594L15.9109 11.7381" stroke="currentColor" strokeWidth="1.28" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RecipeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.25 19.4344C6.683 18.7162 5.35534 17.5631 4.42462 16.1122C3.4939 14.6613 2.99951 12.9737 3 11.25H21C21.0005 12.9737 20.5061 14.6613 19.5754 16.1122C18.6447 17.5631 17.317 18.7162 15.75 19.4344V20.25C15.75 20.4489 15.671 20.6397 15.5303 20.7803C15.3897 20.921 15.1989 21 15 21H9C8.80109 21 8.61032 20.921 8.46967 20.7803C8.32902 20.6397 8.25 20.4489 8.25 20.25V19.4344Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.75 8.25C15.75 8.25 14.0625 7.725 15.75 5.625C17.4375 3.525 15.75 3 15.75 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8.25C12 8.25 10.3125 7.725 12 5.625C13.6875 3.525 12 3 12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.25 8.25C8.25 8.25 6.5625 7.725 8.25 5.625C9.9375 3.525 8.25 3 8.25 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ProductIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.75C16.1421 21.75 19.5 18.3921 19.5 14.25C19.5 10.1079 16.1421 6.75 12 6.75C7.85786 6.75 4.5 10.1079 4.5 14.25C4.5 18.3921 7.85786 21.75 12 21.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 6.75C12 5.35761 12.5531 4.02226 13.5377 3.03769C14.5223 2.05312 15.8576 1.5 17.25 1.5H18C18 2.89239 17.4469 4.22774 16.4623 5.21231C15.4777 6.19688 14.1424 6.75 12.75 6.75H12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 6.75C12 5.35761 11.4469 4.02226 10.4623 3.03769C9.47774 2.05312 8.14239 1.5 6.75 1.5H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.5 15C16.3326 15.9332 15.8836 16.7928 15.2132 17.4632C14.5428 18.1336 13.6832 18.5826 12.75 18.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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

interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodProduct {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: number;
  servingUnit: string;
}

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

interface ClipboardData {
  sourceMealId: string;
  items: ClipboardItem[];
}

interface MealCardProps {
  meal: MealLog;
  macroTargets: MacroTargets;
  onAddItem: (product: FoodProduct, quantity: number) => void;
  onUpdateItemQuantity: (itemId: string, quantity: number) => void;
  onDeleteItem: (itemId: string) => void;
  onDeleteMeal: () => void;
  onRenameMeal: (newName: string) => void;
  clipboard: ClipboardData | null;
  onCopy: (mealId: string, mealName: string, items: ClipboardItem[]) => void;
  onPaste: () => void;
}

export default function MealCard({
  meal,
  macroTargets,
  onAddItem,
  onUpdateItemQuantity,
  onDeleteItem,
  onDeleteMeal,
  onRenameMeal,
  clipboard,
  onCopy,
  onPaste,
}: MealCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showProductSelect, setShowProductSelect] = useState(false);
  const [showRecipeSelect, setShowRecipeSelect] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);

  // Recipe state
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isAddingRecipe, setIsAddingRecipe] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [addedRecipeName, setAddedRecipeName] = useState("");
  const [servingCount, setServingCount] = useState(1);

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Edit meal name state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMealName, setEditMealName] = useState(meal.mealName);


  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setShowAddMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: meal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // When product is selected, immediately add it with default quantity (100g)
  const handleProductSelect = (product: FoodProduct) => {
    onAddItem(product, 100);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-[#EFEFEF] rounded-xl overflow-visible bg-white"
    >
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b-2 border-[#EFEFEF] rounded-t-xl">
        <div className="flex items-center gap-3">
          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            className="flex flex-col items-center gap-[2px] text-[#9FA4B0] cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-5 h-5" />
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-6 h-6 flex items-center justify-center text-[#6B7280] hover:text-[#101827]"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <div>
            <h3 className="text-[16px] font-semibold text-[#101827]">{meal.mealName}</h3>
            {/* Macro info under title */}
            <div className="flex items-center gap-3 text-[13px] text-[#6B7280]">
              <span>Kalorijos - {Math.round(meal.totalCalories)} kcal</span>
              <span className="text-[#E6E6E6]">|</span>
              <span>Angliavandeniai - {Math.round(meal.totalCarbs)} g</span>
              <span className="text-[#E6E6E6]">|</span>
              <span>Baltymai - {Math.round(meal.totalProtein)} g</span>
              <span className="text-[#E6E6E6]">|</span>
              <span>Riebalai - {Math.round(meal.totalFat)} g</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setEditMealName(meal.mealName);
              setShowEditModal(true);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-[#101827]"
            title="Redaguoti"
          >
            <EditIcon />
          </button>
          {/* Copy button - only show if has items */}
          {meal.items.length > 0 && (
            <button
              onClick={() => {
                const itemsToCopy = meal.items.map((item) => ({
                  foodProductId: item.foodProductId,
                  foodProductName: item.foodProductName,
                  quantity: item.quantity,
                  unit: item.unit,
                  calories: item.calories,
                  protein: item.protein,
                  carbs: item.carbs,
                  fat: item.fat,
                }));
                onCopy(meal.id, meal.mealName, itemsToCopy);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-[#101827]"
              title="Kopijuoti produktus"
            >
              <CopyIcon />
            </button>
          )}
          {/* Paste button - show if clipboard has items and not from this meal */}
          {clipboard && clipboard.sourceMealId !== meal.id && (
            <button
              onClick={onPaste}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-[#101827]"
              title="Įklijuoti produktus"
            >
              <PasteIcon />
            </button>
          )}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-[#E74043] hover:text-[#E74043]"
            title="Ištrinti"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 overflow-visible">
          {/* Table */}
          <table className="w-full overflow-visible">
            <thead>
              <tr className="text-[13px] text-[#6B7280]">
                <th className="text-left font-normal pb-3">Produktai</th>
                <th className="text-center font-normal pb-3 w-[120px]">Kiekis</th>
                <th className="text-center font-normal pb-3 w-[88px]">Kalorijos</th>
                <th className="text-center font-normal pb-3 w-[88px]">Angliav(g)</th>
                <th className="text-center font-normal pb-3 w-[88px]">Baltymai (g)</th>
                <th className="text-center font-normal pb-3 w-[88px]">Riebalai (g)</th>
                <th className="w-[40px]"></th>
              </tr>
            </thead>
            <tbody>
              {/* Existing Items */}
              {meal.items.map((item) => (
                <tr key={item.id} className="border-t border-[#EFEFEF]">
                  <td className="py-3 pr-4">
                    <div className="flex items-center justify-between px-3 py-3 border border-[#E6E6E6] rounded-lg text-[14px] text-[#101827]">
                      <span>{item.foodProductName}</span>
                      <ChevronDown className="w-4 h-4 text-[#9FA4B0]" />
                    </div>
                  </td>
                  <td className="py-3 px-1">
                    <div className="relative">
                      <input
                        type="text"
                        defaultValue={item.quantity}
                        onBlur={(e) => {
                          const newQty = Math.max(1, parseInt(e.target.value) || 1);
                          e.target.value = newQty.toString();
                          if (newQty !== item.quantity) {
                            onUpdateItemQuantity(item.id, newQty);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        className="w-[120px] px-2 py-3 pr-10 text-center border border-[#E6E6E6] rounded-lg text-[14px]"
                      />
                      <div className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center border-l border-[#E6E6E6]">
                        <span className="text-[13px] text-[#6B7280] px-2">{item.unit}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-1">
                    <input
                      type="text"
                      value={Math.round(item.calories)}
                      className="w-[88px] px-2 py-3 text-center border border-[#E6E6E6] rounded-lg text-[14px]"
                      readOnly
                    />
                  </td>
                  <td className="py-3 px-1">
                    <input
                      type="text"
                      value={Math.round(item.carbs)}
                      className="w-[88px] px-2 py-3 text-center bg-[#F5F5F5] border border-[#E6E6E6] rounded-lg text-[14px]"
                      readOnly
                    />
                  </td>
                  <td className="py-3 px-1">
                    <input
                      type="text"
                      value={Math.round(item.protein)}
                      className="w-[88px] px-2 py-3 text-center bg-[#F5F5F5] border border-[#E6E6E6] rounded-lg text-[14px]"
                      readOnly
                    />
                  </td>
                  <td className="py-3 px-1">
                    <input
                      type="text"
                      value={Math.round(item.fat)}
                      className="w-[88px] px-2 py-3 text-center bg-[#F5F5F5] border border-[#E6E6E6] rounded-lg text-[14px]"
                      readOnly
                    />
                  </td>
                  <td className="py-3 pl-1">
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="w-8 h-8 flex items-center justify-center text-[#E74043] hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Totals row */}
              <tr className="border-t border-[#EFEFEF]">
                <td className="py-3"></td>
                <td className="py-3 px-1 text-right">
                  <span className="text-[14px] font-medium text-[#6B7280]">Viso:</span>
                </td>
                <td className="py-3 px-1 text-center text-[14px] font-medium text-[#101827]">
                  {Math.round(meal.totalCalories)}
                </td>
                <td className="py-3 px-1 text-center text-[14px] font-medium text-[#101827]">
                  {Math.round(meal.totalCarbs)}
                </td>
                <td className="py-3 px-1 text-center text-[14px] font-medium text-[#101827]">
                  {Math.round(meal.totalProtein)}
                </td>
                <td className="py-3 px-1 text-center text-[14px] font-medium text-[#101827]">
                  {Math.round(meal.totalFat)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>

          {/* Add Button */}
          <div ref={addMenuRef} className="relative mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-2 px-4 py-2 text-[14px] text-[#6B7280] hover:text-[#101827] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Pridėti</span>
            </button>

            {/* Add Menu Dropdown */}
            {showAddMenu && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border border-[#E6E6E6] rounded-lg shadow-lg overflow-hidden z-50 min-w-[180px]">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMenu(false);
                    setSelectedRecipe(null);
                    setShowRecipeSelect(true);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-[#F7F7F7] flex items-center gap-3 text-[#101827] transition-colors"
                >
                  <RecipeIcon />
                  <span className="text-[14px]">Receptą</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMenu(false);
                    setShowProductSelect(true);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-[#F7F7F7] flex items-center gap-3 text-[#101827] transition-colors border-t border-[#E6E6E6]"
                >
                  <ProductIcon />
                  <span className="text-[14px]">Produktą</span>
                </button>
              </div>
            )}
          </div>

          {/* Product Select Modal */}
          {showProductSelect && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[18px] font-semibold text-[#101827]">Pasirinkite produktą</h2>
                  <button
                    onClick={() => setShowProductSelect(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-[#6B7280]"
                  >
                    ✕
                  </button>
                </div>
                <FoodProductSelect
                  value={null}
                  onChange={(product) => {
                    handleProductSelect(product);
                    setShowProductSelect(false);
                  }}
                />
              </div>
            </div>
          )}

          {/* Recipe Select Modal - simplified, just pick recipe */}
          {showRecipeSelect && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[18px] font-semibold text-[#101827]">Pasirinkite receptą</h2>
                  <button
                    onClick={() => {
                      setShowRecipeSelect(false);
                      setSelectedRecipe(null);
                      setServingCount(1);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-[#6B7280]"
                  >
                    ✕
                  </button>
                </div>

                <RecipeDropdown
                  value={selectedRecipe}
                  onChange={(recipe) => {
                    setSelectedRecipe(recipe);
                    setServingCount(1);
                  }}
                />

                {/* Serving count selector - shown after recipe is selected */}
                {selectedRecipe && (
                  <div className="mt-4 pt-4 border-t border-[#E6E6E6]">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[14px] text-[#6B7280]">Porcijų skaičius</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setServingCount(Math.max(1, servingCount - 1))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6E6E6] text-[#6B7280] hover:bg-[#F7F7F7] transition-colors"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={servingCount}
                          onChange={(e) => setServingCount(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-12 h-8 text-center border border-[#E6E6E6] rounded-lg text-[14px] text-[#101827] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          onClick={() => setServingCount(servingCount + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6E6E6] text-[#6B7280] hover:bg-[#F7F7F7] transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Calories info for selected servings */}
                    <div className="text-[13px] text-[#9FA4B0] mb-4">
                      {Math.round((selectedRecipe.calories / selectedRecipe.servings) * servingCount)} kcal • {servingCount} {servingCount === 1 ? "porcija" : servingCount < 10 ? "porcijos" : "porcijų"}
                    </div>

                    {/* Add button */}
                    <button
                      type="button"
                      disabled={isAddingRecipe}
                      onClick={async () => {
                        setIsAddingRecipe(true);
                        try {
                          // Fetch recipe with ingredients
                          const response = await fetch(`/api/recipes/${selectedRecipe.id}`);
                          if (!response.ok) throw new Error("Failed to fetch recipe");

                          const recipeData = await response.json();

                          // Add each ingredient
                          if (recipeData.ingredients && recipeData.ingredients.length > 0) {
                            const totalServings = recipeData.servings || selectedRecipe.servings || 1;

                            for (const ingredient of recipeData.ingredients) {
                              const product = ingredient.foodProduct;
                              const foodProduct: FoodProduct = {
                                id: product.id,
                                name: product.name,
                                category: product.category || "Kita",
                                calories: product.calories || 0,
                                protein: product.protein || 0,
                                carbs: product.carbs || 0,
                                fat: product.fat || 0,
                                serving: product.serving || 100,
                                servingUnit: product.servingUnit || "g",
                              };

                              // Calculate quantity for selected servings
                              const totalQuantity = ingredient.quantity || 100;
                              const quantityPerServing = totalQuantity / totalServings;
                              const quantity = Math.round(quantityPerServing * servingCount);

                              onAddItem(foodProduct, quantity);
                            }
                          }

                          setShowRecipeSelect(false);
                          setAddedRecipeName(selectedRecipe.title);
                          setSelectedRecipe(null);
                          setServingCount(1);
                          setShowSuccessModal(true);
                        } catch (error) {
                          console.error("Error adding recipe ingredients:", error);
                        } finally {
                          setIsAddingRecipe(false);
                        }
                      }}
                      className="w-full py-3 rounded-lg bg-[#60988E] text-white font-medium hover:bg-[#4A7A70] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isAddingRecipe ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          <span>Pridedama...</span>
                        </>
                      ) : (
                        "Pridėti"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Success Modal */}
          <SuccessModal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            title={`Receptas ${addedRecipeName} sėkmingai pridėtas!`}
            highlightText={addedRecipeName}
            buttonText="Į planą"
            onButtonClick={() => setShowSuccessModal(false)}
          />

          {/* Delete Confirmation Modal */}
          <ConfirmModal
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={() => {
              setShowDeleteConfirm(false);
              onDeleteMeal();
            }}
            title="Ištrinti valgymą"
            description="Ar tikrai norite ištrinti šį valgymą?"
            confirmText="Ištrinti"
            cancelText="Atšaukti"
            variant="danger"
          />

          {/* Edit Meal Name Modal */}
          <Modal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            title="Keisti valgymo pavadinimą"
            footer={
              <ModalFooter
                onCancel={() => setShowEditModal(false)}
                onConfirm={() => {
                  if (editMealName.trim() && editMealName.trim() !== meal.mealName) {
                    onRenameMeal(editMealName.trim());
                  }
                  setShowEditModal(false);
                }}
                cancelText="Atšaukti"
                confirmText="Išsaugoti"
                confirmDisabled={!editMealName.trim()}
              />
            }
          >
            <div>
              <label className="block text-[14px] text-[#6B7280] mb-2">Pavadinimas</label>
              <input
                type="text"
                value={editMealName}
                onChange={(e) => setEditMealName(e.target.value)}
                placeholder="Įveskite valgymo pavadinimą"
                className="w-full px-3 py-3 border border-[#E6E6E6] rounded-lg text-[14px] text-[#101827] placeholder:text-[#9FA4B0] hover:border-[#60988E] focus:outline-none focus:border-[#60988E] transition-colors"
                autoFocus
              />
            </div>
          </Modal>

        </div>
      )}
    </div>
  );
}

// Recipe interface
interface Recipe {
  id: string;
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servings: number;
  image?: string | null;
}

// Recipe Dropdown Component
function RecipeDropdown({
  value,
  onChange
}: {
  value: Recipe | null;
  onChange: (recipe: Recipe) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`/api/recipes?all=true`);
      if (response.ok) {
        const data = await response.json();
        setAllRecipes(data);
        setRecipes(data);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (query.length === 0) {
      setRecipes(allRecipes);
    } else {
      const filtered = allRecipes.filter((r) =>
        r.title.toLowerCase().includes(query.toLowerCase())
      );
      setRecipes(filtered);
    }
  }, [query, allRecipes]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const displayValue = isOpen ? query : value ? value.title : query;

  return (
    <div ref={dropdownRef} className="relative">
      {/* Search input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Ieškoti recepto..."
          className="w-full px-3 py-3 pr-8 border border-[#E6E6E6] rounded-lg text-[14px] text-[#101827] placeholder:text-[#9FA4B0] hover:border-[#60988E] focus:outline-none focus:border-[#60988E] transition-colors"
        />
        <ChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9FA4B0] transition-transform pointer-events-none ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#E6E6E6] rounded-lg shadow-lg">
          {/* Recipes list */}
          <div className="max-h-[250px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#60988E]" />
              </div>
            ) : recipes.length > 0 ? (
              recipes.map((recipe) => (
                <button
                  key={recipe.id}
                  type="button"
                  onClick={() => {
                    onChange(recipe);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className={`w-full px-3 py-2.5 text-left hover:bg-[#F7F7F7] flex items-center gap-3 transition-colors ${
                    value?.id === recipe.id ? "bg-[#FFF7DF]" : ""
                  }`}
                >
                  {/* Recipe image */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-[#F5F5F5]">
                    {recipe.image ? (
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#9FA4B0]">
                        <RecipeIcon />
                      </div>
                    )}
                  </div>
                  {/* Recipe info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#101827] truncate">{recipe.title}</p>
                    <p className="text-[11px] text-[#9FA4B0]">{Math.round(recipe.calories / recipe.servings)} kcal / porcijai</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="py-4 px-3 text-center">
                <p className="text-[13px] text-[#9FA4B0]">Receptų nerasta...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
