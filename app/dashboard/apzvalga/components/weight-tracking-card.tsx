"use client";

import { useState } from "react";
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

export default function WeightTrackingCard({
  startWeight = 79.8,
  currentWeight = 75.2,
  goalWeight = 1.8,
  weightHistory = [
    { date: "06.25", weight: 78 },
    { date: "06.28", weight: 77.5 },
    { date: "07.04", weight: 76.8 },
    { date: "07.06", weight: 76.2 },
    { date: "07.12", weight: 75.8 },
    { date: "07.20", weight: 75.2 },
  ],
  period = "Savaitė",
}: WeightTrackingCardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputWeight, setInputWeight] = useState("");

  // Calculate Y-axis values
  const weights = weightHistory.map((d) => d.weight);
  const dataMax = Math.max(...weights);
  const dataMin = Math.min(...weights);

  // Round to nice values for Y-axis (add padding)
  const yMax = Math.ceil(dataMax);
  const yMin = Math.floor(dataMin) - 1;
  const yRange = yMax - yMin;

  // Goal line position (74 kg as example)
  const goalLineWeight = 74;

  // Convert weight to Y position (0-100 scale for SVG viewBox)
  const getY = (weight: number) => {
    return ((yMax - weight) / yRange) * 100;
  };

  // Convert index to X position (0-100 scale)
  const getX = (index: number) => {
    return (index / (weightHistory.length - 1)) * 100;
  };

  // Generate points string for polyline
  const points = weightHistory
    .map((d, i) => `${getX(i)},${getY(d.weight)}`)
    .join(" ");

  // Y-axis labels (from max to min)
  const yLabels = Array.from({ length: yRange + 1 }, (_, i) => yMax - i);

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
        <button className="flex-1 h-8 bg-[#60988E] text-white text-[14px] font-medium rounded-lg hover:bg-[#4d7a72] transition-colors">
          Įvesti svorį
        </button>
      </div>
    </div>
  );
}
