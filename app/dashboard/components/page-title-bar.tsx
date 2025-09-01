"use client";

import { useState, useEffect } from "react";
import { Search, ChevronLeft } from "lucide-react";
import { getCache, setCache } from "@/app/lib/cache-utils";
import { useRouter } from "next/navigation";

interface PageTitleBarProps {
  title?: string;
  workoutId?: string;
  workoutTitle?: string;
}

export default function PageTitleBar({
  title,
  workoutId,
  workoutTitle,
}: PageTitleBarProps) {
  const [pageTitle, setPageTitle] = useState<string>(title || "Treniruotės");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkoutTitle = async () => {
      if (workoutId) {
        setIsLoading(true);

        const cacheKey = `workout_title_${workoutId}`;
        const cachedTitle = getCache<string>(cacheKey);

        if (workoutTitle) {
          setPageTitle(workoutTitle);
          setCache(cacheKey, workoutTitle);
          setIsLoading(false);
          return;
        }

        if (cachedTitle) {
          console.log("Naudojamas cache treniruotės pavadinimui:", workoutId);
          setPageTitle(cachedTitle);
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
      }
    };

    fetchWorkoutTitle();
  }, [workoutId, workoutTitle, title]);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="border-b">
      <div className="flex items-center px-6 p-5 mx-auto">
        <div className="flex items-center">
          {workoutId ? (
            <>
              <button
                onClick={handleGoBack}
                className="mr-4 flex items-center justify-center border border-gray-200 bg-gray-50 rounded-md w-12 h-12 transition-colors hover:bg-gray-100"
                aria-label="Grįžti atgal"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              <span className="font-[mango] text-[40px]">
                {isLoading && !pageTitle ? "Kraunama..." : pageTitle}
              </span>
            </>
          ) : (
            <span className="text-[50px] font-[mango]">{pageTitle}</span>
          )}
        </div>
        <div className="ml-auto">
          <div className="relative">
            <input
              type="search"
              placeholder="Paieška"
              className="pl-8 pr-4 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
