"use client";

import { useState } from "react";
import { FilterButton } from "./filter-button";
import { SortDropdown, SortOption } from "./sort-dropdown";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  categories?: FilterOption[];
  sortOptions: SortOption[];
  sortValue: string;
  onSortChange: (value: string) => void;
  activeFilterCount?: number;
  totalCount?: number;
  itemLabel?: string;
}

export interface FilterState {
  category: string | null;
  priority: string | null;
  restriction: string | null;
  time: string | null;
}

const priorityOptions: FilterOption[] = [
  { id: "high-protein", label: "Daugiau baltymų" },
  { id: "low-fat", label: "Mažiau riebalų" },
  { id: "low-carb", label: "Mažiau angliavandenių" },
  { id: "low-sugar", label: "Mažiau cukraus" },
];

const restrictionOptions: FilterOption[] = [
  { id: "vegetarian", label: "Vegetariška" },
  { id: "vegan", label: "Veganiška" },
  { id: "sugar-free", label: "Be cukraus" },
  { id: "gluten-free", label: "Be glitimo" },
  { id: "lactose-free", label: "Be laktozės" },
];

const timeOptions: FilterOption[] = [
  { id: "10min", label: "10min ar mažiau" },
  { id: "30min", label: "30min ar mažiau" },
  { id: "30min+", label: "30min +" },
];

const defaultCategories: FilterOption[] = [
  { id: "breakfast", label: "Pusryčiai" },
  { id: "lunch-dinner", label: "Pietus/Vakarienė" },
  { id: "hot-dishes", label: "Karšti patiekalai" },
  { id: "salads", label: "Salotos" },
  { id: "snacks", label: "Užkandžiai" },
];

export function FilterPanel({
  isOpen,
  onToggle,
  onClose,
  onApply,
  categories = defaultCategories,
  sortOptions,
  sortValue,
  onSortChange,
  activeFilterCount,
  totalCount,
  itemLabel = "receptų",
}: FilterPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedRestriction, setSelectedRestriction] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedPriority(null);
    setSelectedRestriction(null);
    setSelectedTime(null);
  };

  const handleApply = () => {
    onApply({
      category: selectedCategory,
      priority: selectedPriority,
      restriction: selectedRestriction,
      time: selectedTime,
    });
    onClose();
  };

  const hasActiveFilters =
    selectedCategory || selectedPriority || selectedRestriction || selectedTime;

  // Get labels for active filters
  const getActiveFilterLabels = () => {
    const labels: { key: string; label: string }[] = [];

    if (selectedCategory) {
      const cat = categories.find(c => c.id === selectedCategory);
      if (cat) labels.push({ key: 'category', label: cat.label });
    }
    if (selectedPriority) {
      const pri = priorityOptions.find(p => p.id === selectedPriority);
      if (pri) labels.push({ key: 'priority', label: pri.label });
    }
    if (selectedRestriction) {
      const res = restrictionOptions.find(r => r.id === selectedRestriction);
      if (res) labels.push({ key: 'restriction', label: res.label });
    }
    if (selectedTime) {
      const time = timeOptions.find(t => t.id === selectedTime);
      if (time) labels.push({ key: 'time', label: time.label });
    }

    return labels;
  };

  const removeFilter = (key: string) => {
    switch (key) {
      case 'category':
        setSelectedCategory(null);
        break;
      case 'priority':
        setSelectedPriority(null);
        break;
      case 'restriction':
        setSelectedRestriction(null);
        break;
      case 'time':
        setSelectedTime(null);
        break;
    }
  };

  const activeFilterLabels = getActiveFilterLabels();

  const wrapperClass = isOpen
    ? "relative before:absolute before:inset-0 before:bg-white before:-left-[50vw] before:-right-[50vw] before:w-[200vw] before:border-b before:border-[#E6E6E6]"
    : "";

  return (
    <div className={`font-[Outfit] mb-8 ${wrapperClass}`}>
      {/* Header with Filter button, count, and Sort dropdown */}
      <div className="relative flex items-center justify-between py-6">
        <div className="flex items-center gap-4">
          <FilterButton
            onClick={onToggle}
            badgeCount={activeFilterCount}
          />
          {totalCount !== undefined && (
            <span className="text-sm text-[#9FA4B0]">{totalCount} {itemLabel}</span>
          )}
        </div>
        <SortDropdown
          options={sortOptions}
          value={sortValue}
          onChange={onSortChange}
        />
      </div>

      {/* Active filters display */}
      {activeFilterLabels.length > 0 && !isOpen && (
        <div className="relative flex items-center gap-3">
          <span className="text-sm text-[#6B7280]">Pasirinkti filtrai:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {activeFilterLabels.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => removeFilter(key)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E6E6E6] rounded-full text-sm text-[#101827] hover:bg-gray-50 transition-colors"
              >
                {label}
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                  <path d="M7.35 7.35L0.6 0.6" stroke="#101827" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M0.6 7.35L7.35 0.6" stroke="#101827" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-[#E74043] hover:text-[#BA1E21] transition-colors"
          >
            Pašalinti visus filtrus
          </button>
        </div>
      )}

      {/* Filter content - only shown when open */}
      <div
        className={`relative overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-[#E6E6E6]">
          <div className="grid grid-cols-4 gap-8 py-8">
              {/* KATEGORIJA */}
              <div>
                <h3 className="text-xs font-medium text-[#9FA4B0] uppercase tracking-wider mb-4">
                  KATEGORIJA
                </h3>
                <div className="flex flex-col gap-3">
                  {categories.map((option) => (
                    <button
                      key={option.id}
                      onClick={() =>
                        setSelectedCategory(
                          selectedCategory === option.id ? null : option.id
                        )
                      }
                      className={`text-left text-sm transition-colors ${
                        selectedCategory === option.id
                          ? "text-[#101827] font-medium"
                          : "text-[#101827] hover:text-[#6B7280]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* PIRMENYBĖ */}
              <div>
                <h3 className="text-xs font-medium text-[#9FA4B0] uppercase tracking-wider mb-4">
                  PIRMENYBĖ
                </h3>
                <div className="flex flex-col gap-3">
                  {priorityOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() =>
                        setSelectedPriority(
                          selectedPriority === option.id ? null : option.id
                        )
                      }
                      className={`text-left text-sm transition-colors ${
                        selectedPriority === option.id
                          ? "text-[#101827] font-medium"
                          : "text-[#101827] hover:text-[#6B7280]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* APRIBOJIMAI */}
              <div>
                <h3 className="text-xs font-medium text-[#9FA4B0] uppercase tracking-wider mb-4">
                  APRIBOJIMAI
                </h3>
                <div className="flex flex-col gap-3">
                  {restrictionOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() =>
                        setSelectedRestriction(
                          selectedRestriction === option.id ? null : option.id
                        )
                      }
                      className={`text-left text-sm transition-colors ${
                        selectedRestriction === option.id
                          ? "text-[#101827] font-medium"
                          : "text-[#101827] hover:text-[#6B7280]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* LAIKAS */}
              <div>
                <h3 className="text-xs font-medium text-[#9FA4B0] uppercase tracking-wider mb-4">
                  LAIKAS
                </h3>
                <div className="flex flex-col gap-3">
                  {timeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() =>
                        setSelectedTime(selectedTime === option.id ? null : option.id)
                      }
                      className={`text-left text-sm transition-colors ${
                        selectedTime === option.id
                          ? "text-[#101827] font-medium"
                          : "text-[#101827] hover:text-[#6B7280]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          {/* Footer */}
          <div className="flex items-center justify-between py-6 border-t border-[#E6E6E6]">
            <button
              onClick={clearFilters}
              className={`text-sm transition-colors ${
                hasActiveFilters
                  ? "text-[#101827] hover:text-[#6B7280]"
                  : "text-[#9FA4B0] cursor-default"
              }`}
              disabled={!hasActiveFilters}
            >
              Išvalyti filtrus
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="text-sm text-[#9FA4B0] hover:text-[#6B7280] transition-colors"
              >
                Atšaukti
              </button>
              <button
                onClick={handleApply}
                className="bg-[#60988E] text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-[#34786C] transition-colors"
              >
                Taikyti filtrus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
