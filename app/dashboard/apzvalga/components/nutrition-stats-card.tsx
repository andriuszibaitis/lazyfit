"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

interface DayCalories {
  day: string;
  calories: number;
}

interface MacroData {
  label: string;
  value: number;
  perKg: number;
  color: string;
  percentage: number;
}

interface NutritionStatsCardProps {
  weeklyCalories?: DayCalories[] | null;
  macros?: MacroData[] | null;
  targetCalories?: number;
  period?: string;
  hasNutritionData?: boolean;
}

export default function NutritionStatsCard({
  weeklyCalories = null,
  macros = null,
  targetCalories = 2500,
  period = "Savaitė",
  hasNutritionData = false,
}: NutritionStatsCardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Default data for when there is nutrition data
  const defaultWeeklyCalories = [
    { day: "P", calories: 2400 },
    { day: "A", calories: 2600 },
    { day: "T", calories: 2200 },
    { day: "K", calories: 3200 },
    { day: "P", calories: 2500 },
    { day: "Š", calories: 2300 },
    { day: "S", calories: 2100 },
  ];

  const defaultMacros = [
    { label: "Angliavandeniai", value: 206, perKg: 1.6, color: "#60988E", percentage: 75 },
    { label: "Baltymai", value: 128, perKg: 1.8, color: "#F98466", percentage: 85 },
    { label: "Riebalai", value: 72, perKg: 1.0, color: "#334BA3", percentage: 65 },
  ];

  const emptyMacros = [
    { label: "Angliavandeniai", value: 0, perKg: 0, color: "#60988E", percentage: 0 },
    { label: "Baltymai", value: 0, perKg: 0, color: "#F98466", percentage: 0 },
    { label: "Riebalai", value: 0, perKg: 0, color: "#334BA3", percentage: 0 },
  ];

  // Empty state - no nutrition data
  if (!hasNutritionData) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#E6E6E6] h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-[30px] font-semibold text-[#101827]"
            style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
          >
            Savaitės mitybos statistika
          </h3>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 border border-[#E6E6E6] rounded-lg text-sm"
            >
              {selectedPeriod}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-8 flex-1">
          {/* Empty state message */}
          <div className="flex-1 flex items-center justify-center border border-dashed border-[#E6E6E6] rounded-xl">
            <p
              className="text-[14px] text-[#555B65] text-center px-4"
              style={{ fontFamily: "Outfit, sans-serif", lineHeight: "140%" }}
            >
              Pradėk žymėti savo mitybą ir stebėk statistiką čia.
            </p>
          </div>

          {/* Macros - empty state */}
          <div className="w-44">
            <p className="text-[13px] text-[#555B65] mb-3">Makroelementų vidurkis</p>

            <div className="space-y-3">
              {emptyMacros.map((macro, i) => (
                <div key={i} className="flex items-center gap-3">
                  {/* Circular progress - empty */}
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#E6E6E6"
                        strokeWidth="4"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] text-[#555B65]">{macro.label}</p>
                    <p className="text-[14px] font-semibold text-[#101827]">
                      - g{" "}
                      <span className="font-normal text-[#555B65]">
                        / {macro.perKg} g/kg
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/mityba/mitybos-planai"
          className="block w-full h-12 leading-[48px] bg-[#60988E] text-white text-[14px] font-medium rounded-lg hover:bg-[#4d7a72] transition-colors text-center mt-4"
        >
          Peržiūrėti mitybos planus
        </Link>
      </div>
    );
  }

  const displayWeeklyCalories = weeklyCalories || defaultWeeklyCalories;
  const displayMacros = macros || defaultMacros;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E6E6E6]">
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-[30px] font-semibold text-[#101827]"
          style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
        >
          Savaitės mitybos statistika
        </h3>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 border border-[#E6E6E6] rounded-lg text-sm"
          >
            {selectedPeriod}
            <ChevronDown className="w-4 h-4" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-[#E6E6E6] rounded-lg shadow-lg z-10">
              {["Savaitė", "Mėnuo"].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setSelectedPeriod(p);
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-[#F5F5F5]"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-8">
        {/* Bar chart */}
        <div className="flex-1">
          <p className="text-[13px] text-[#555B65] mb-3">kalorijas per savaitę (kcal)</p>

          {/* Y-axis labels and chart */}
          <div className="flex">
            <div className="flex flex-col justify-between text-[12px] text-[#555B65] pr-2 h-32">
              <span>4000</span>
              <span>3000</span>
              <span>2000</span>
              <span>1000</span>
              <span>0</span>
            </div>

            {/* Chart area */}
            <div className="flex-1 relative">
              {/* Target line (dashed) */}
              <div
                className="absolute left-0 right-0 border-t-2 border-dashed border-[#555B65]"
                style={{ top: `${100 - (targetCalories / 4000) * 100}%` }}
              />

              {/* Bars with labels */}
              <div className="flex justify-between h-32 px-2">
                {displayWeeklyCalories.map((d, i) => {
                  const height = (d.calories / 4000) * 100;
                  return (
                    <div key={i} className="flex flex-col items-center flex-1">
                      <div className="h-full flex items-end justify-center">
                        <div
                          className="w-2 bg-[#BBB1FC] rounded-full transition-all duration-300"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span className="text-[12px] text-[#555B65] mt-2">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Macros */}
        <div className="w-44">
          <p className="text-[13px] text-[#555B65] mb-3">Makroelementų vidurkis</p>

          <div className="space-y-3">
            {displayMacros.map((macro, i) => (
              <div key={i} className="flex items-center gap-3">
                {/* Circular progress */}
                <div className="relative w-10 h-10 flex-shrink-0">
                  <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#E6E6E6"
                      strokeWidth="4"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke={macro.color}
                      strokeWidth="4"
                      strokeDasharray={`${macro.percentage * 0.88} 88`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[12px] text-[#555B65]">{macro.label}</p>
                  <p className="text-[14px] font-semibold text-[#101827]">
                    {macro.value} g{" "}
                    <span className="font-normal text-[#555B65]">
                      / {macro.perKg} g/kg
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
