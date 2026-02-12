"use client";

import { useState } from "react";
import { SortOption } from "@/components/ui/sort-dropdown";
import { FilterPanel, FilterState } from "@/components/ui/filter-panel";
import RecipeCard from "../recipe-card";

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  image: string;
  preparationTime: number;
  cookingTime: number;
  servings: number;
  difficulty: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string | null;
}

interface Category {
  id: string;
  name: string;
}

interface RecipesContentProps {
  recipes: Recipe[];
  categories: Category[];
}

const sortOptions: SortOption[] = [
  { value: "newest", label: "Naujausi" },
  { value: "oldest", label: "Seniausi" },
  { value: "popular", label: "Populiariausi" },
  { value: "calories-low", label: "Mažiausiai kalorijų" },
  { value: "calories-high", label: "Daugiausiai kalorijų" },
];

export default function RecipesContent({
  recipes,
  categories,
}: RecipesContentProps) {
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    category: null,
    priority: null,
    restriction: null,
    time: null,
  });

  const filterCategories = categories.map((cat) => ({
    id: cat.id,
    label: cat.name,
  }));

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
  };

  return (
    <>
      <FilterPanel
        isOpen={isFilterOpen}
        onToggle={() => setIsFilterOpen(!isFilterOpen)}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        categories={filterCategories.length > 0 ? filterCategories : undefined}
        sortOptions={sortOptions}
        sortValue={sortBy}
        onSortChange={setSortBy}
        activeFilterCount={activeFilterCount > 0 ? activeFilterCount : undefined}
        totalCount={recipes.length}
      />

      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-muted-foreground">Nėra prieinamų receptų</p>
              <p className="text-sm text-gray-500 mt-2">
                Patikrinkite, ar turite aktyvią narystę arba ar yra sukurtų
                receptų.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
