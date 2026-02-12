"use client";

import { useState } from "react";
import { FilterButton } from "@/components/ui/filter-button";
import { SortDropdown, SortOption } from "@/components/ui/sort-dropdown";

interface FilterOption {
  id: string;
  label: string;
}

interface SportsFilterPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onApply: (filters: SportsFilterState) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
  activeFilterCount?: number;
  totalCount?: number;
}

export interface SportsFilterState {
  muscleGroup: string | null;
  difficulty: string | null;
  duration: string | null;
  equipment: string | null;
}

const sortOptions: SortOption[] = [
  { value: "newest", label: "Naujausi" },
  { value: "oldest", label: "Seniausi" },
  { value: "popular", label: "Populiariausi" },
  { value: "duration-short", label: "Trumpiausi" },
  { value: "duration-long", label: "Ilgiausi" },
];

const muscleGroupOptions: FilterOption[] = [
  { id: "presas", label: "Presas" },
  { id: "nugara", label: "Nugara" },
  { id: "kojos", label: "Kojos" },
  { id: "rankos", label: "Rankos" },
  { id: "krutine", label: "Krūtinė" },
  { id: "viso-kuno", label: "Viso kūno" },
];

const difficultyOptions: FilterOption[] = [
  { id: "Pradedantiesiems", label: "Pradedantiesiems" },
  { id: "Vidutinis", label: "Vidutinis" },
  { id: "Pažengusiems", label: "Pažengusiems" },
];

const durationOptions: FilterOption[] = [
  { id: "15min", label: "15 min ar mažiau" },
  { id: "30min", label: "30 min ar mažiau" },
  { id: "45min", label: "45 min ar mažiau" },
  { id: "60min+", label: "60 min +" },
];

const equipmentOptions: FilterOption[] = [
  { id: "be-inventoriaus", label: "Be inventoriaus" },
  { id: "su-svarmenimis", label: "Su svarmenimis" },
  { id: "su-gumomis", label: "Su gumomis" },
  { id: "su-treniruokliais", label: "Su treniruokliais" },
];

export function SportsFilterPanel({
  isOpen,
  onToggle,
  onClose,
  onApply,
  sortValue,
  onSortChange,
  activeFilterCount,
  totalCount,
}: SportsFilterPanelProps) {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

  const clearFilters = () => {
    setSelectedMuscleGroup(null);
    setSelectedDifficulty(null);
    setSelectedDuration(null);
    setSelectedEquipment(null);
  };

  const handleApply = () => {
    onApply({
      muscleGroup: selectedMuscleGroup,
      difficulty: selectedDifficulty,
      duration: selectedDuration,
      equipment: selectedEquipment,
    });
    onClose();
  };

  const hasActiveFilters =
    selectedMuscleGroup || selectedDifficulty || selectedDuration || selectedEquipment;

  const getActiveFilterLabels = () => {
    const labels: { key: string; label: string }[] = [];

    if (selectedMuscleGroup) {
      const opt = muscleGroupOptions.find((o) => o.id === selectedMuscleGroup);
      if (opt) labels.push({ key: "muscleGroup", label: opt.label });
    }
    if (selectedDifficulty) {
      const opt = difficultyOptions.find((o) => o.id === selectedDifficulty);
      if (opt) labels.push({ key: "difficulty", label: opt.label });
    }
    if (selectedDuration) {
      const opt = durationOptions.find((o) => o.id === selectedDuration);
      if (opt) labels.push({ key: "duration", label: opt.label });
    }
    if (selectedEquipment) {
      const opt = equipmentOptions.find((o) => o.id === selectedEquipment);
      if (opt) labels.push({ key: "equipment", label: opt.label });
    }

    return labels;
  };

  const removeFilter = (key: string) => {
    switch (key) {
      case "muscleGroup":
        setSelectedMuscleGroup(null);
        break;
      case "difficulty":
        setSelectedDifficulty(null);
        break;
      case "duration":
        setSelectedDuration(null);
        break;
      case "equipment":
        setSelectedEquipment(null);
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
          <FilterButton onClick={onToggle} badgeCount={activeFilterCount} />
          {totalCount !== undefined && (
            <span className="text-sm text-[#9FA4B0]">{totalCount} treniruočių</span>
          )}
        </div>
        <SortDropdown options={sortOptions} value={sortValue} onChange={onSortChange} />
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
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-shrink-0"
                >
                  <path
                    d="M7.35 7.35L0.6 0.6"
                    stroke="#101827"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M0.6 7.35L7.35 0.6"
                    stroke="#101827"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
          isOpen ? "max-h-[800px] lg:max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-[#E6E6E6]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 py-6 lg:py-8">
            {/* RAUMENŲ GRUPĖ */}
            <div>
              <h3 className="text-xs font-medium text-[#9FA4B0] uppercase tracking-wider mb-4">
                RAUMENŲ GRUPĖ
              </h3>
              <div className="flex flex-col gap-3">
                {muscleGroupOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() =>
                      setSelectedMuscleGroup(
                        selectedMuscleGroup === option.id ? null : option.id
                      )
                    }
                    className={`text-left text-sm transition-colors ${
                      selectedMuscleGroup === option.id
                        ? "text-[#101827] font-medium"
                        : "text-[#101827] hover:text-[#6B7280]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SUDĖTINGUMAS */}
            <div>
              <h3 className="text-xs font-medium text-[#9FA4B0] uppercase tracking-wider mb-4">
                SUDĖTINGUMAS
              </h3>
              <div className="flex flex-col gap-3">
                {difficultyOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() =>
                      setSelectedDifficulty(
                        selectedDifficulty === option.id ? null : option.id
                      )
                    }
                    className={`text-left text-sm transition-colors ${
                      selectedDifficulty === option.id
                        ? "text-[#101827] font-medium"
                        : "text-[#101827] hover:text-[#6B7280]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TRUKMĖ */}
            <div>
              <h3 className="text-xs font-medium text-[#9FA4B0] uppercase tracking-wider mb-4">
                TRUKMĖ
              </h3>
              <div className="flex flex-col gap-3">
                {durationOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() =>
                      setSelectedDuration(selectedDuration === option.id ? null : option.id)
                    }
                    className={`text-left text-sm transition-colors ${
                      selectedDuration === option.id
                        ? "text-[#101827] font-medium"
                        : "text-[#101827] hover:text-[#6B7280]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* INVENTORIUS */}
            <div>
              <h3 className="text-xs font-medium text-[#9FA4B0] uppercase tracking-wider mb-4">
                INVENTORIUS
              </h3>
              <div className="flex flex-col gap-3">
                {equipmentOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() =>
                      setSelectedEquipment(selectedEquipment === option.id ? null : option.id)
                    }
                    className={`text-left text-sm transition-colors ${
                      selectedEquipment === option.id
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-6 border-t border-[#E6E6E6]">
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
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={onClose}
                className="text-sm text-[#9FA4B0] hover:text-[#6B7280] transition-colors"
              >
                Atšaukti
              </button>
              <button
                onClick={handleApply}
                className="bg-[#60988E] text-white text-sm font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-[#34786C] transition-colors flex-1 sm:flex-none"
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
