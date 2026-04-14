"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FemaleBodySvg, MaleBodySvg } from "./icons/body-svg";

interface Measurement {
  label: string;
  value: number | null;
  unit: string;
  change?: number | null;
}

const periodMap: Record<string, string> = {
  "Savaitė": "week",
  "Mėnuo": "month",
  "3 mėnesiai": "3months",
};

export default function BodyMeasurementsCard() {
  const { data: session } = useSession();
  const [selectedPeriod, setSelectedPeriod] = useState("Savaitė");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [measurements, setMeasurements] = useState<Measurement[]>([
    { label: "Svoris", value: null, unit: "kg" },
    { label: "Pečiai", value: null, unit: "cm" },
    { label: "Krūtinė", value: null, unit: "cm" },
    { label: "Bicepsas", value: null, unit: "cm" },
    { label: "Dilbis", value: null, unit: "cm" },
    { label: "Liemuo", value: null, unit: "cm" },
    { label: "Klubai /\nsėdmenys", value: null, unit: "cm" },
    { label: "Šlaunis", value: null, unit: "cm" },
    { label: "Blauzda", value: null, unit: "cm" },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const period = periodMap[selectedPeriod] || "week";
        const response = await fetch(`/api/body-measurements?period=${period}`);
        if (response.ok) {
          const data = await response.json();
          const latest = data.latest;
          const changes = data.changes;

          if (latest) {
            setMeasurements([
              { label: "Svoris", value: latest.weight, unit: "kg", change: changes?.weight },
              { label: "Pečiai", value: latest.shoulders, unit: "cm", change: changes?.shoulders },
              { label: "Krūtinė", value: latest.chest, unit: "cm", change: changes?.chest },
              { label: "Bicepsas", value: latest.biceps, unit: "cm", change: changes?.biceps },
              { label: "Dilbis", value: latest.forearm, unit: "cm", change: changes?.forearm },
              { label: "Liemuo", value: latest.waist, unit: "cm", change: changes?.waist },
              { label: "Klubai /\nsėdmenys", value: latest.hips, unit: "cm", change: changes?.hips },
              { label: "Šlaunis", value: latest.thigh, unit: "cm", change: changes?.thigh },
              { label: "Blauzda", value: latest.calf, unit: "cm", change: changes?.calf },
            ]);
          }
        }
      } catch (error) {
        console.error("Error fetching body measurements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeasurements();
  }, [selectedPeriod]);

  const formatChange = (change?: number | null) => {
    if (change === undefined || change === null) return null;
    const prefix = change > 0 ? "+" : "";
    const color = change > 0 ? "text-[#59CA1C]" : change < 0 ? "text-[#FF1D21]" : "text-[#9FA4B0]";
    return <span className={`font-semibold text-[12px] leading-[120%] tracking-[-0.02em] ${color}`}>{prefix}{change}</span>;
  };

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 h-full flex flex-col border border-[#E6E6E6]">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3
          className="text-[24px] md:text-[30px] font-semibold text-[#101827]"
          style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
        >
          Kūno apimtys
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

      <div className="flex gap-3 md:gap-6 items-center">
        {/* Body illustration */}
        <div className="flex-shrink-0">
          {session?.user?.gender === "male" ? (
            <MaleBodySvg className="w-[120px] h-[168px] md:w-[166px] md:h-[233px]" />
          ) : (
            <FemaleBodySvg className="w-[120px] h-[168px] md:w-[166px] md:h-[232px]" />
          )}
        </div>

        {/* Measurements list */}
        <div className="flex-1 min-w-0 space-y-1.5 md:space-y-2">
          {measurements.map((m, index) => (
            <div key={index} className="flex items-center text-sm">
              <span className="text-[#101827] font-semibold text-[12px] md:text-[13px] leading-[120%] whitespace-pre-line flex-1 min-w-0">{m.label}</span>
              {m.value ? (
                <>
                  <div className="flex items-baseline gap-1 w-[56px] md:w-[72px] justify-end">
                    <span className="font-semibold text-[#101827] text-[15px] md:text-[16px] leading-[120%] tracking-[-0.02em]">
                      {m.value}
                    </span>
                    <span className="text-[#555B65] text-[12px] md:text-[13px] font-normal leading-[120%]">{m.unit}</span>
                  </div>
                  <div className="w-9 md:w-12 text-right">{formatChange(m.change)}</div>
                </>
              ) : (
                <span className="text-[#9FA4B0]">- {m.unit}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-4">
        <Link
          href="/dashboard/apzvalga/ivesti-apimtis"
          className="block w-full h-8 leading-[32px] bg-[#60988E] text-white text-[14px] font-medium rounded-lg hover:bg-[#4d7a72] transition-colors text-center"
        >
          Įvesti apimtis
        </Link>
      </div>
    </div>
  );
}
