"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search as SearchIcon, X, ArrowLeft } from "lucide-react";
import { TabItem } from "@/components/ui/custom-tabs";
import { TabDropdown } from "@/components/ui/tab-dropdown";
import { SortDropdown } from "@/components/ui/sort-dropdown";
import { Button } from "@/components/ui/button";
import TrainingCard from "../components/training-card";
import PageTitleBar from "../components/page-title-bar";
import EmptyState from "../components/empty-state";
import { SportsFilterPanel, SportsFilterState } from "./sports-filter-panel";

interface Training {
  id: string;
  title: string;
  image: string;
  duration: number;
  level: string;
  isFavorite: boolean;
  videoUrl: string;
  membershipId: string | null;
  membershipName: string | undefined;
  createdAt: string;
  muscleGroups: string[];
}

interface SportsTabsProps {
  trainings: Training[];
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function groupByMuscle(
  trainings: Training[]
): { group: string; items: Training[] }[] {
  const map = new Map<string, Training[]>();
  for (const t of trainings) {
    for (const g of t.muscleGroups) {
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(t);
    }
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b, "lt"))
    .map(([group, items]) => ({ group, items }));
}

export default function SportsTabs({ trainings }: SportsTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState("treneruotes");
  const [resultsTab, setResultsTab] = useState<"programos" | "treneruotes">(
    "treneruotes"
  );
  const [sortBy, setSortBy] = useState(
    () => searchParams.get("sort") || "newest"
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("q") || ""
  );
  const [viewAllCategory, setViewAllCategory] = useState<string | null>(
    () => searchParams.get("category") || null
  );
  const [activeFilters, setActiveFilters] = useState<SportsFilterState>(() => ({
    muscleGroup: searchParams.get("muscle"),
    difficulty: searchParams.get("difficulty"),
    duration: searchParams.get("duration"),
    equipment: searchParams.get("equipment"),
  }));

  // Sync state -> URL so the back button restores filters/search.
  // Uses replace so each keystroke doesn't add a history entry — when the user
  // navigates to a training and presses back, they return to the latest URL.
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (activeFilters.muscleGroup)
      params.set("muscle", activeFilters.muscleGroup);
    if (activeFilters.difficulty)
      params.set("difficulty", activeFilters.difficulty);
    if (activeFilters.duration) params.set("duration", activeFilters.duration);
    if (activeFilters.equipment)
      params.set("equipment", activeFilters.equipment);
    if (sortBy && sortBy !== "newest") params.set("sort", sortBy);
    if (viewAllCategory) params.set("category", viewAllCategory);

    const qs = params.toString();
    const next = qs ? `${pathname}?${qs}` : pathname;
    router.replace(next, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchQuery,
    activeFilters.muscleGroup,
    activeFilters.difficulty,
    activeFilters.duration,
    activeFilters.equipment,
    sortBy,
    viewAllCategory,
  ]);

  // Sync URL -> state (e.g. when user presses back/forward)
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
    setActiveFilters({
      muscleGroup: searchParams.get("muscle"),
      difficulty: searchParams.get("difficulty"),
      duration: searchParams.get("duration"),
      equipment: searchParams.get("equipment"),
    });
    setSortBy(searchParams.get("sort") || "newest");
    setViewAllCategory(searchParams.get("category") || null);
  }, [searchParams]);

  const tabs: TabItem[] = [
    { id: "treneruotes", label: "Treneruotės" },
    { id: "sporto-issukiai", label: "Sporto iššūkiai" },
    { id: "sporto-programos", label: "Sporto programos" },
  ];

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  const handleApplyFilters = (filters: SportsFilterState) => {
    setActiveFilters(filters);
  };

  // Filter trainings based on active filters
  const filteredTrainings = trainings.filter((training) => {
    if (
      searchQuery &&
      !training.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (activeFilters.muscleGroup) {
      const selected = activeFilters.muscleGroup.toLowerCase();
      const matches = training.muscleGroups.some(
        (g) => g.toLowerCase() === selected
      );
      if (!matches) return false;
    }
    if (activeFilters.difficulty && training.level !== activeFilters.difficulty) {
      return false;
    }
    if (activeFilters.duration) {
      const duration = training.duration;
      switch (activeFilters.duration) {
        case "15min":
          if (duration > 15) return false;
          break;
        case "30min":
          if (duration > 30) return false;
          break;
        case "45min":
          if (duration > 45) return false;
          break;
        case "60min+":
          if (duration < 60) return false;
          break;
      }
    }
    return true;
  });

  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(activeFilters.muscleGroup) ||
    Boolean(activeFilters.difficulty) ||
    Boolean(activeFilters.duration) ||
    Boolean(activeFilters.equipment);

  const filterChips: { key: string; label: string }[] = [];
  if (searchQuery) filterChips.push({ key: "search", label: searchQuery });
  if (activeFilters.muscleGroup)
    filterChips.push({
      key: "muscleGroup",
      label: capitalize(activeFilters.muscleGroup),
    });
  if (activeFilters.difficulty)
    filterChips.push({ key: "difficulty", label: activeFilters.difficulty });
  if (activeFilters.duration)
    filterChips.push({ key: "duration", label: activeFilters.duration });
  if (activeFilters.equipment)
    filterChips.push({ key: "equipment", label: activeFilters.equipment });

  const removeFilter = (key: string) => {
    if (key === "search") {
      setSearchQuery("");
      return;
    }
    setActiveFilters((prev) => ({ ...prev, [key]: null }));
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setActiveFilters({
      muscleGroup: null,
      difficulty: null,
      duration: null,
      equipment: null,
    });
    setIsSearchOpen(false);
  };

  const resultsSortOptions = [
    { value: "newest", label: "Naujausi" },
    { value: "oldest", label: "Seniausi" },
    { value: "popular", label: "Populiariausi" },
    { value: "duration-short", label: "Trumpiausi" },
    { value: "duration-long", label: "Ilgiausi" },
  ];

  // Sort trainings
  const sortedTrainings = [...filteredTrainings].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "popular":
        // Kol kas rūšiuojame pagal naujumą (ateityje galima pridėti peržiūrų skaičių)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "duration-short":
        return a.duration - b.duration;
      case "duration-long":
        return b.duration - a.duration;
      default:
        return 0;
    }
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case "treneruotes":
        return (
          <>
            <SportsFilterPanel
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
              onClose={() => setIsFilterOpen(false)}
              onApply={handleApplyFilters}
              sortValue={sortBy}
              onSortChange={setSortBy}
              activeFilterCount={activeFilterCount > 0 ? activeFilterCount : undefined}
              totalCount={sortedTrainings.length}
            />

            {viewAllCategory ? (
              (() => {
                const categoryTrainings =
                  viewAllCategory === "naujausios"
                    ? sortedTrainings
                    : sortedTrainings.filter((t) =>
                        t.muscleGroups.some(
                          (g) => g.toLowerCase() === viewAllCategory.toLowerCase()
                        )
                      );
                const categoryTitle =
                  viewAllCategory === "naujausios"
                    ? "Naujausios"
                    : capitalize(viewAllCategory);

                return (
                  <div className="mb-8 lg:mb-12">
                    <div className="lg:hidden">
                      <div className="flex items-center justify-center relative mb-2">
                        <button
                          type="button"
                          onClick={() => setViewAllCategory(null)}
                          aria-label="Atgal"
                          className="absolute left-0 p-1"
                        >
                          <ArrowLeft className="h-5 w-5 text-[#101827]" />
                        </button>
                        <h2
                          className="text-[22px] font-semibold text-[#101827] italic"
                          style={{ fontFamily: "mango, sans-serif" }}
                        >
                          {categoryTitle}
                        </h2>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-[#6B7280]">
                          {categoryTrainings.length} video įrašai
                        </span>
                        <SortDropdown
                          options={resultsSortOptions}
                          value={sortBy}
                          onChange={setSortBy}
                          label="Rikiavimas"
                          variant="inline"
                        />
                      </div>

                      {categoryTrainings.length > 0 ? (
                        <div className="flex flex-col gap-3">
                          {categoryTrainings.map((training) => (
                            <TrainingCard
                              key={training.id}
                              training={training}
                              variant="list"
                            />
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          title="Nerasta jokių treneruočių"
                          description="Šioje kategorijoje treniruočių nėra"
                        />
                      )}
                    </div>

                    <div className="hidden lg:block">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-[40px] font-[mango] text-[#101827]">
                          {categoryTitle}
                        </h2>
                        <button
                          type="button"
                          onClick={() => setViewAllCategory(null)}
                          className="text-sm font-medium text-[#101827] underline underline-offset-4 hover:text-[#60988E] transition-colors"
                        >
                          Grįžti
                        </button>
                      </div>
                      {categoryTrainings.length > 0 ? (
                        <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                          {categoryTrainings.map((training) => (
                            <TrainingCard key={training.id} training={training} />
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          title="Nerasta jokių treneruočių"
                          description="Šioje kategorijoje treniruočių nėra"
                        />
                      )}
                    </div>
                  </div>
                );
              })()
            ) : hasActiveFilters ? (
              <div className="mb-8 lg:mb-12">
                {/* Mobile: back + search input */}
                <div className="lg:hidden flex items-center gap-3 mb-4">
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    aria-label="Grįžti"
                    className="shrink-0 p-2 -ml-2"
                  >
                    <ArrowLeft className="h-5 w-5 text-[#101827]" />
                  </button>
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={
                        searchQuery ||
                        filterChips.find((c) => c.key === "muscleGroup")
                          ?.label ||
                        filterChips[0]?.label ||
                        ""
                      }
                      onChange={(e) => {
                        setActiveFilters((prev) => ({
                          ...prev,
                          muscleGroup: null,
                          difficulty: null,
                          duration: null,
                          equipment: null,
                        }));
                        setSearchQuery(e.target.value);
                      }}
                      placeholder="Ieškoti..."
                      className="w-full pl-10 pr-10 py-2.5 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#60988E]"
                    />
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      aria-label="Išvalyti"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                      <X className="h-3.5 w-3.5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Mobile: Programos / Treneruotės sub-tabs */}
                <div className="lg:hidden flex border-b border-gray-200 mb-4">
                  <button
                    type="button"
                    onClick={() => setResultsTab("programos")}
                    className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                      resultsTab === "programos"
                        ? "text-[#101827] border-[#101827]"
                        : "text-[#9FA4B0] border-transparent"
                    }`}
                  >
                    Programos
                  </button>
                  <button
                    type="button"
                    onClick={() => setResultsTab("treneruotes")}
                    className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                      resultsTab === "treneruotes"
                        ? "text-[#101827] border-[#101827]"
                        : "text-[#9FA4B0] border-transparent"
                    }`}
                  >
                    Treneruotės
                  </button>
                </div>

                {/* Desktop: title */}
                <h2 className="hidden lg:block text-[40px] font-[mango] text-[#101827] mb-4">
                  Rezultatai
                </h2>

                {/* Count + sort */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[#6B7280]">
                    {sortedTrainings.length} video įrašai
                  </span>
                  <SortDropdown
                    options={resultsSortOptions}
                    value={sortBy}
                    onChange={setSortBy}
                    label="Rikiavimas"
                    variant="inline"
                  />
                </div>

                {sortedTrainings.length > 0 ? (
                  <>
                    {/* Mobile: list view */}
                    <div className="lg:hidden flex flex-col gap-3">
                      {resultsTab === "treneruotes" ? (
                        sortedTrainings.map((training) => (
                          <TrainingCard
                            key={training.id}
                            training={training}
                            variant="list"
                          />
                        ))
                      ) : (
                        <div className="py-8 text-center text-sm text-[#6B7280]">
                          Programų pagal šią paiešką nėra
                        </div>
                      )}
                    </div>
                    {/* Desktop: grid */}
                    <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                      {sortedTrainings.map((training) => (
                        <TrainingCard key={training.id} training={training} />
                      ))}
                    </div>
                  </>
                ) : (
                  <EmptyState
                    title="Nerasta jokių treneruočių"
                    description="Pabandykite ieškoti naudodami skirtingus raktinius žodžius"
                  />
                )}
              </div>
            ) : (
              <>
                <div className="mb-8 lg:mb-12">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[28px] lg:text-[40px] font-[mango] text-[#101827]">
                      Naujausios treniruotės
                    </h2>
                    <button
                      type="button"
                      onClick={() => setViewAllCategory("naujausios")}
                      className="text-sm font-medium text-[#101827] underline underline-offset-4 hover:text-[#60988E] transition-colors whitespace-nowrap"
                    >
                      Visi įrašai
                    </button>
                  </div>
                  {sortedTrainings.length > 0 ? (
                    <>
                      {/* Mobile: horizontal scrolling carousel with one card visible */}
                      <div className="lg:hidden -mx-4 px-4">
                        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide">
                          {sortedTrainings.map((training) => (
                            <div
                              key={training.id}
                              className="shrink-0 w-[85%] snap-start"
                            >
                              <TrainingCard training={training} />
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Desktop: grid */}
                      <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                        {sortedTrainings.map((training) => (
                          <TrainingCard key={training.id} training={training} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <EmptyState
                      title="Nerasta jokių treneruočių"
                      description="Pabandykite ieškoti naudodami skirtingus raktinius žodžius"
                    />
                  )}
                </div>

                {groupByMuscle(sortedTrainings).map(({ group, items }) => (
                  <MuscleGroupSection
                    key={group}
                    muscleGroup={group}
                    trainings={items}
                    onViewAll={() => setViewAllCategory(group)}
                  />
                ))}
              </>
            )}
          </>
        );
      case "sporto-issukiai":
        return (
          <div className="p-8 text-center">
            <h3 className="text-xl font-medium">
              Sporto iššūkiai bus prieinami netrukus
            </h3>
          </div>
        );
      case "sporto-programos":
        return (
          <div className="p-8 text-center">
            <h3 className="text-xl font-medium">
              Sporto programos bus prieinamos netrukus
            </h3>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <PageTitleBar
        title="Sportas"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hideMobileTabs
        hideMobileHeader
      />
      <div className="flex-1 px-4 py-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className={`lg:hidden mb-4 ${viewAllCategory ? 'hidden' : ''}`}>
            <div className="flex items-center justify-between gap-3">
              <TabDropdown
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen((v) => !v)}
                  aria-label="Filtrai"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#filter-icon-clip)">
                      <path
                        d="M7.07812 11.6875H16.9243"
                        stroke="#101827"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 8H20"
                        stroke="#101827"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.1484 15.3828H13.8407"
                        stroke="#101827"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {activeFilterCount > 0 && (
                        <circle cx="18" cy="6" r="4" fill="#E74043" />
                      )}
                    </g>
                    <defs>
                      <clipPath id="filter-icon-clip">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen((v) => !v)}
                  aria-label="Paieška"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <SearchIcon className="h-5 w-5 text-[#101827]" />
                </button>
              </div>
            </div>
            {isSearchOpen && (
              <div className="mt-3 relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ieškoti treniruočių..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#60988E]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Išvalyti paiešką"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                )}
              </div>
            )}
          </div>
          {renderTabContent()}
        </div>
      </div>
    </>
  );
}

function MuscleGroupSection({
  muscleGroup,
  trainings,
  onViewAll,
}: {
  muscleGroup: string;
  trainings: Training[];
  onViewAll: () => void;
}) {
  if (trainings.length === 0) return null;

  return (
    <div className="mb-8 lg:mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl lg:text-2xl font-bold text-[#101827]">{muscleGroup}</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="text-sm font-medium text-[#101827] underline underline-offset-4 hover:text-[#60988E] transition-colors whitespace-nowrap"
        >
          Visi įrašai
        </button>
      </div>
      {/* Mobile: horizontal scroll */}
      <div className="lg:hidden -mx-4 px-4">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide">
          {trainings.map((training) => (
            <div
              key={training.id}
              className="shrink-0 w-[85%] snap-start"
            >
              <TrainingCard training={training} />
            </div>
          ))}
        </div>
      </div>
      {/* Desktop: grid */}
      <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {trainings.map((training) => (
          <TrainingCard key={training.id} training={training} />
        ))}
      </div>
    </div>
  );
}
