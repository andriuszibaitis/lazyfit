"use client";

import { useEffect } from "react";
import { getCache, setCache } from "@/app/lib/cache-utils";
import { CustomTabs, TabItem } from "@/components/ui/custom-tabs";
import { usePageTitle } from "../contexts/page-title-context";

interface PageTitleBarProps {
  title?: string;
  workoutId?: string;
  workoutTitle?: string;
  tabs?: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export default function PageTitleBar({
  title,
  workoutId,
  workoutTitle,
  tabs,
  activeTab,
  onTabChange,
}: PageTitleBarProps) {
  const { setPageTitle: setHeaderTitle, setShowBackButton } = usePageTitle();

  useEffect(() => {
    const fetchWorkoutTitle = async () => {
      if (workoutId) {
        setShowBackButton(true);

        const cacheKey = `workout_title_${workoutId}`;
        const cachedTitle = getCache<string>(cacheKey);

        if (workoutTitle) {
          setHeaderTitle(workoutTitle);
          setCache(cacheKey, workoutTitle);
          return;
        }

        if (cachedTitle) {
          setHeaderTitle(cachedTitle);
        }

        try {
          const response = await fetch(`/api/workouts/${workoutId}`);

          if (response.ok) {
            const data = await response.json();

            if (data.name) {
              if (!cachedTitle || data.name !== cachedTitle) {
                setHeaderTitle(data.name);
                setCache(cacheKey, data.name);
              }
            }
          }
        } catch (error) {
          console.error("Klaida gaunant treniruotės pavadinimą:", error);
        }
      } else if (title) {
        // Always set the title when this component mounts with a title prop
        setHeaderTitle(title);
        setShowBackButton(false);
      }
    };

    fetchWorkoutTitle();
  }, [workoutId, workoutTitle, title, setHeaderTitle, setShowBackButton]);

  return (
    <div>
      {/* Tabs Section */}
      {tabs && tabs.length > 0 && activeTab && onTabChange && (
        <div className="max-w-7xl mx-auto mt-4 px-4 lg:px-6">
          <CustomTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
        </div>
      )}
    </div>
  );
}
