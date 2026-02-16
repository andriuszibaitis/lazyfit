"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";

interface WeightData {
  date: string;
  weight: number;
}

interface WeightTrackingCardProps {
  startWeight?: number;
  currentWeight?: number;
  goalWeight?: number;
  weightHistory?: WeightData[];
  period?: string;
}

const periodMap: Record<string, string> = {
  "Savaitė": "week",
  "Mėnuo": "month",
  "3 mėnesiai": "3months",
};

export default function WeightTrackingCard({
  startWeight: initialStartWeight,
  currentWeight: initialCurrentWeight,
  goalWeight: initialGoalWeight,
  weightHistory: initialWeightHistory,
  period = "Savaitė",
}: WeightTrackingCardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputWeight, setInputWeight] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [displayStartWeight, setDisplayStartWeight] = useState(initialStartWeight || 0);
  const [displayCurrentWeight, setDisplayCurrentWeight] = useState(initialCurrentWeight || 0);
  const [displayGoalWeight, setDisplayGoalWeight] = useState(initialGoalWeight || 0);
  const [displayHistory, setDisplayHistory] = useState<WeightData[]>(initialWeightHistory || []);

  const fetchWeightData = useCallback(async () => {
    try {
      const apiPeriod = periodMap[selectedPeriod] || "week";
      const response = await fetch(`/api/body-measurements?period=${apiPeriod}`);
      if (response.ok) {
        const data = await response.json();
        if (data.measurements && data.measurements.length > 0) {
          const history: WeightData[] = data.measurements
            .filter((m: any) => m.weight !== null)
            .reverse()
            .map((m: any) => {
              const d = new Date(m.date);
              return {
                date: `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`,
                weight: m.weight,
              };
            });

          if (history.length > 0) {
            setDisplayHistory(history);
            setDisplayStartWeight(history[0].weight);
            setDisplayCurrentWeight(history[history.length - 1].weight);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching weight data:", error);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchWeightData();
  }, [fetchWeightData]);

  const handleSaveWeight = async () => {
    if (!inputWeight || isSaving) return;

    const weight = parseFloat(inputWeight);
    if (isNaN(weight) || weight <= 0) return;

    setIsSaving(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const response = await fetch("/api/body-measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: today.toISOString(),
          weight,
        }),
      });

      if (response.ok) {
        setInputWeight("");
        await fetchWeightData();
      }
    } catch (error) {
      console.error("Error saving weight:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const weightHistory = displayHistory.length > 0
    ? displayHistory
    : [{ date: "-", weight: 0 }];

  // Calculate Y-axis values
  const weights = weightHistory.map((d) => d.weight);
  const dataMax = Math.max(...weights);
  const dataMin = Math.min(...weights);

  // Round to nice values for Y-axis (add padding)
  const yMax = Math.ceil(dataMax) || 80;
  const yMin = Math.floor(dataMin) - 1 || 70;
  const yRange = (yMax - yMin) || 10;

  // Goal line position
  const goalLineWeight = displayGoalWeight > 0 ? displayCurrentWeight - displayGoalWeight : 0;

  // Convert weight to Y position (0-100 scale for SVG viewBox)
  const getY = (weight: number) => {
    return ((yMax - weight) / yRange) * 100;
  };

  // Convert index to X position (0-100 scale)
  const getX = (index: number) => {
    return weightHistory.length > 1 ? (index / (weightHistory.length - 1)) * 100 : 50;
  };

  // Generate points string for polyline
  const points = weightHistory
    .map((d, i) => `${getX(i)},${getY(d.weight)}`)
    .join(" ");

  // Y-axis labels (from max to min)
  const yLabels = Array.from({ length: yRange + 1 }, (_, i) => yMax - i);

  const startWeight = displayStartWeight;
  const currentWeight = displayCurrentWeight;
  const goalWeight = displayGoalWeight;

  return (
    <div className="bg-white rounded-2xl p-6 h-full flex flex-col border border-[#E6E6E6]">
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-[30px] font-semibold text-[#101827]"
          style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
        >
          Svoris
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
              {["Savaitė", "Mėnuo", "3 mėnesiai"].map((p) => (
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

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-[13px] font-semibold text-[#101827] mb-1">Pradinis</p>
          <p className="text-[20px] font-bold text-[#101827]">
            {startWeight}
            <span className="text-[13px] font-normal text-[#555B65] ml-0.5">kg</span>
          </p>
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[#101827] mb-1">Dabartinis</p>
          <p className="text-[20px] font-bold text-[#101827]">
            {currentWeight}
            <span className="text-[13px] font-normal text-[#555B65] ml-0.5">kg</span>
          </p>
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[#101827] mb-1">Liko iki tikslo</p>
          <p className="text-[20px] font-bold text-[#101827]">
            {goalWeight}
            <span className="text-[13px] font-normal text-[#555B65] ml-0.5">kg</span>
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 flex flex-col min-h-0 mb-4">
        <div className="flex flex-1 min-h-0">
          {/* Y-axis labels */}
          <div className="flex flex-col justify-between text-[12px] text-[#555B65] w-8 pr-2">
            {yLabels.map((label) => (
              <span key={label} className="text-right">{label}</span>
            ))}
          </div>

          {/* Chart area */}
          <div className="flex-1 relative">
            {/* Grid lines and goal line SVG */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
            >
              {/* Horizontal grid lines */}
              {yLabels.map((label) => {
                const y = getY(label);
                return (
                  <line
                    key={label}
                    x1="0"
                    y1={y}
                    x2="100"
                    y2={y}
                    stroke="#E6E6E6"
                    strokeWidth="0.5"
                  />
                );
              })}

              {/* Goal line (dashed red) */}
              {goalLineWeight >= yMin && goalLineWeight <= yMax && (
                <line
                  x1="0"
                  y1={getY(goalLineWeight)}
                  x2="100"
                  y2={getY(goalLineWeight)}
                  stroke="#FF6B6B"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              )}

              {/* Data line */}
              <polyline
                points={points}
                fill="none"
                stroke="#60988E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* Data points - positioned absolutely to avoid distortion */}
            {weightHistory.map((d, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-[#60988E] rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${getX(i)}%`,
                  top: `${getY(d.weight)}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between text-[12px] text-[#555B65] ml-8 mt-2">
          {weightHistory.map((d, i) => (
            <span key={i}>{d.date}</span>
          ))}
        </div>
      </div>

      {/* Input section */}
      <div className="flex gap-3 mt-auto items-center">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={inputWeight}
            onChange={(e) => setInputWeight(e.target.value)}
            placeholder="75.2"
            className="w-16 px-3 py-2.5 text-[14px] text-[#101827] border border-[#E6E6E6] rounded-lg focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-[14px] text-[#555B65]">kg</span>
        </div>
        <button
          onClick={handleSaveWeight}
          disabled={isSaving || !inputWeight}
          className="flex-1 h-8 bg-[#60988E] text-white text-[14px] font-medium rounded-lg hover:bg-[#4d7a72] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saugoma..." : "Įvesti svorį"}
        </button>
      </div>
    </div>
  );
}
