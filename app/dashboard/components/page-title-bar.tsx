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
  hideMobileTabs?: boolean;
  hideMobileHeader?: boolean;
  showBack?: boolean;
  backUrl?: string;
}

export default function PageTitleBar({
  title,
  workoutId,
  workoutTitle,
  tabs,
  activeTab,
  onTabChange,
  hideMobileTabs = false,
  hideMobileHeader = false,
  showBack = false,
  backUrl,
}: PageTitleBarProps) {
  const { setPageTitle: setHeaderTitle, setShowBackButton, setBackUrl, setHideMobileHeader } = usePageTitle();

  useEffect(() => {
    setHideMobileHeader(hideMobileHeader);
    return () => {
      setHideMobileHeader(false);
    };
  }, [hideMobileHeader, setHideMobileHeader]);

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
        setHeaderTitle(title);
        if (showBack) {
          setShowBackButton(true);
          setBackUrl(backUrl || null);
        }
      }
    };

    fetchWorkoutTitle();

    return () => {
      if (showBack) {
        setShowBackButton(false);
        setBackUrl(null);
      }
    };
  }, [workoutId, workoutTitle, title, setHeaderTitle, setShowBackButton, showBack, backUrl, setBackUrl]);

  return (
    <div>
      {/* Tabs Section */}
      {tabs && tabs.length > 0 && activeTab && onTabChange && (
        <div className={`max-w-7xl mx-auto mt-2 lg:mt-4 px-4 lg:px-6 ${hideMobileTabs ? 'hidden lg:block' : ''}`}>
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
