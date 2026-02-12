"use client";

import { useState, useEffect } from "react";
import { usePageTitle } from "@/app/dashboard/contexts/page-title-context";
import { Check, ChevronDown } from "lucide-react";

interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  iconUrl: string | null;
  iconSvg: string | null;
  isUnlocked: boolean;
  unlockedAt: string | null;
}

type FilterType = "all" | "unlocked" | "locked";
type SortType = "newest" | "oldest" | "alphabetical";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

// Achievement icon component
const AchievementIcon = ({ iconSvg }: { iconSvg: string | null }) => {
  const circleSize = 120;

  return (
    <div
      className="rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden bg-[#60988E]"
      style={{
        width: circleSize,
        height: circleSize,
      }}
    >
      {iconSvg ? (
        <div
          className="w-[60px] h-[60px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
          dangerouslySetInnerHTML={{ __html: iconSvg }}
        />
      ) : (
        <svg width={60} height={60} viewBox="0 0 60 60" fill="none">
          <circle cx="30" cy="30" r="20" fill="white" />
          <path d="M25 30 L28 33 L35 26" stroke="#60988E" strokeWidth="3" fill="none" />
        </svg>
      )}
    </div>
  );
};

export default function PasiekimaiPage() {
  const { setPageTitle, setShowBackButton } = usePageTitle();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  useEffect(() => {
    setPageTitle("Pasiekimai");
    setShowBackButton(false);
  }, [setPageTitle, setShowBackButton]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch("/api/achievements");
        if (response.ok) {
          const data = await response.json();
          setAchievements(data.achievements || []);
        }
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  // Filter achievements
  const filteredAchievements = achievements.filter((a) => {
    if (filter === "unlocked") return a.isUnlocked;
    if (filter === "locked") return !a.isUnlocked;
    return true;
  });

  // Sort achievements
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    if (sort === "newest") {
      if (a.isUnlocked && b.isUnlocked) {
        return new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime();
      }
      return a.isUnlocked ? -1 : 1;
    }
    if (sort === "oldest") {
      if (a.isUnlocked && b.isUnlocked) {
        return new Date(a.unlockedAt!).getTime() - new Date(b.unlockedAt!).getTime();
      }
      return a.isUnlocked ? -1 : 1;
    }
    if (sort === "alphabetical") {
      return a.title.localeCompare(b.title, "lt");
    }
    return 0;
  });

  const sortLabels: Record<SortType, string> = {
    newest: "Naujausi",
    oldest: "Seniausi",
    alphabetical: "Pagal abėcėlę",
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#60988E]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        {/* Filters and Sort */}
        <div className="flex items-center justify-between mb-6">
          {/* Filter tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-[14px] font-medium rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-[#FFF4D6] text-[#101827] border border-[#E6D9A8]"
                  : "bg-white text-[#555B65] border border-[#E6E6E6] hover:border-[#60988E]"
              }`}
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Visi Pasiekimai
            </button>
            <button
              onClick={() => setFilter("unlocked")}
              className={`px-4 py-2 text-[14px] font-medium rounded-lg transition-colors ${
                filter === "unlocked"
                  ? "bg-[#FFF4D6] text-[#101827] border border-[#E6D9A8]"
                  : "bg-white text-[#555B65] border border-[#E6E6E6] hover:border-[#60988E]"
              }`}
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Gauti
            </button>
            <button
              onClick={() => setFilter("locked")}
              className={`px-4 py-2 text-[14px] font-medium rounded-lg transition-colors ${
                filter === "locked"
                  ? "bg-[#FFF4D6] text-[#101827] border border-[#E6D9A8]"
                  : "bg-white text-[#555B65] border border-[#E6E6E6] hover:border-[#60988E]"
              }`}
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Užrakinti
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E6E6E6] rounded-lg hover:border-[#60988E] transition-colors"
            >
              <span
                className="text-[14px] text-[#101827]"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                {sortLabels[sort]}
              </span>
              <ChevronDown className="w-4 h-4 text-[#9FA4B0]" />
            </button>
            {isSortDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-[#E6E6E6] rounded-lg shadow-lg z-10 min-w-[150px]">
                {(Object.keys(sortLabels) as SortType[]).map((sortKey) => (
                  <button
                    key={sortKey}
                    onClick={() => {
                      setSort(sortKey);
                      setIsSortDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-[14px] text-[#101827] hover:bg-[#F5F5F5] transition-colors first:rounded-t-lg last:rounded-b-lg"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    {sortLabels[sortKey]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-white rounded-2xl p-6 border border-[#E6E6E6] text-center ${
                !achievement.isUnlocked ? "opacity-60" : ""
              }`}
            >
              {/* Icon */}
              <AchievementIcon iconSvg={achievement.iconSvg} />

              {/* Title */}
              <h3
                className="text-[18px] font-semibold text-[#101827] mb-2"
                style={{ fontFamily: "mango, sans-serif" }}
              >
                {achievement.title}
              </h3>

              {/* Description */}
              <p
                className="text-[13px] text-[#555B65] mb-4 leading-[140%]"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                {achievement.description}
              </p>

              {/* Unlocked date or locked status */}
              {achievement.isUnlocked ? (
                <div className="flex items-center justify-center gap-1 text-[#60988E]">
                  <Check className="w-4 h-4" />
                  <span
                    className="text-[13px]"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    {formatDate(achievement.unlockedAt!)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span
                    className="text-[13px] text-[#9FA4B0]"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    Užrakinta
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {sortedAchievements.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p
              className="text-[16px] text-[#555B65]"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {filter === "unlocked"
                ? "Dar neturite gautų pasiekimų."
                : filter === "locked"
                ? "Visi pasiekimai jau atrakinti!"
                : "Pasiekimų nerasta."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
