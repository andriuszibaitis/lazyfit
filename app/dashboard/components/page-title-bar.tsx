"use client";

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { getCache, setCache } from "@/app/lib/cache-utils";
import { useRouter } from "next/navigation";
import Tabs, { TabItem } from "../../components/tabs";
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
  const [pageTitle, setPageTitle] = useState<string>(title || "Treniruotės");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { setPageTitle: setHeaderTitle } = usePageTitle();

  useEffect(() => {
    const fetchWorkoutTitle = async () => {
      if (workoutId) {
        setIsLoading(true);

        const cacheKey = `workout_title_${workoutId}`;
        const cachedTitle = getCache<string>(cacheKey);

        if (workoutTitle) {
          setPageTitle(workoutTitle);
          setHeaderTitle(workoutTitle);
          setCache(cacheKey, workoutTitle);
          setIsLoading(false);
          return;
        }

        if (cachedTitle) {
          console.log("Naudojamas cache treniruotės pavadinimui:", workoutId);
          setPageTitle(cachedTitle);
          setHeaderTitle(cachedTitle);
        }

        try {
          console.log("Kraunamas treniruotės pavadinimas iš API:", workoutId);
          const response = await fetch(`/api/workouts/${workoutId}`);

          if (response.ok) {
            const data = await response.json();

            if (data.name) {
              if (!cachedTitle || data.name !== cachedTitle) {
                console.log("Atnaujinamas treniruotės pavadinimas:", data.name);
                setPageTitle(data.name);
                setHeaderTitle(data.name);

                setCache(cacheKey, data.name);
              }
            }
          }
        } catch (error) {
          console.error("Klaida gaunant treniruotės pavadinimą:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (title) {
        setPageTitle(title);
        setHeaderTitle(title);
      }
    };

    fetchWorkoutTitle();
  }, [workoutId, workoutTitle, title]);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div>
      {/* Back button only for workout pages */}
      {workoutId && (
        <div className="flex items-center px-6 py-3">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center border border-gray-200 bg-gray-50 rounded-md w-12 h-12 transition-colors hover:bg-gray-100"
            aria-label="Grįžti atgal"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      )}

      {/* Tabs Section */}
      {tabs && tabs.length > 0 && (
        <div className="px-6">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`px-6 py-3 text-base font-medium transition-all duration-200 border-b-2 ${
                  activeTab === tab.id || (!activeTab && tab.id === tabs[0]?.id)
                    ? "text-black border-black"
                    : "text-gray-400 border-transparent hover:text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
