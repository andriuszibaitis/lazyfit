"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { usePageTitle } from "@/app/dashboard/contexts/page-title-context";
import { FemaleBodySvg, MaleBodySvg } from "@/app/dashboard/apzvalga/components/icons/body-svg";

interface MeasurementField {
  key: string;
  label: string;
  description: string;
  unit: string;
  currentValue: number | null;
  change: number | null;
}

const measurementFields: Omit<MeasurementField, "currentValue" | "change">[] = [
  { key: "weight", label: "Svoris", description: "Pasiversk ryte, tuščiu skrandžiu, po WC", unit: "kg" },
  { key: "shoulders", label: "Pečiai", description: "Matuoti aplink visus pečius, rankos nuleistos", unit: "cm" },
  { key: "chest", label: "Krūtinė", description: "Matuoti per spenelius, iškvėpus", unit: "cm" },
  { key: "biceps", label: "Bicepsas", description: "Matuoti tiek įtemptus, tiek atpalaiduotas – per storiausią vietą", unit: "cm" },
  { key: "forearm", label: "Dilbis", description: "Matuoti plačiausioje dilbio vietoje, ranka atpalaiduota", unit: "cm" },
  { key: "waist", label: "Liemuo", description: "Matuoti siauriausį vietį – dažniausiai virš bambos", unit: "cm" },
  { key: "belly", label: "Pilvas", description: "Matuoti plačiausią vietą – ties bamba arba šiek tiek žemiau", unit: "cm" },
  { key: "hips", label: "Klubai / sėdmenys", description: "Matuoti plačiausią vietą per sėdmenis", unit: "cm" },
  { key: "thigh", label: "Šlaunis", description: "Matuoti aukščiausią dalį po sėdmenimis, plačiausią vietą", unit: "cm" },
  { key: "calf", label: "Blauzda", description: "Matuoti storiausią vietą", unit: "cm" },
];

export default function IvestiApimtisPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { setPageTitle, setShowBackButton, setBackUrl } = usePageTitle();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [measurements, setMeasurements] = useState<Record<string, number | null>>({});
  const [newValues, setNewValues] = useState<Record<string, string>>({});
  const [existingData, setExistingData] = useState<{
    latest: Record<string, number | null> | null;
    changes: Record<string, number | null> | null;
  }>({ latest: null, changes: null });

  useEffect(() => {
    setPageTitle("Kūno apimtys");
    setShowBackButton(true);
    setBackUrl("/dashboard/apzvalga");
  }, [setPageTitle, setShowBackButton, setBackUrl]);

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const response = await fetch("/api/body-measurements");
        if (response.ok) {
          const data = await response.json();
          if (data.latest) {
            setExistingData({
              latest: data.latest,
              changes: data.changes,
            });
            // Pre-fill with existing values
            const existing: Record<string, number | null> = {};
            measurementFields.forEach((field) => {
              existing[field.key] = data.latest[field.key] ?? null;
            });
            setMeasurements(existing);
          }
        }
      } catch (error) {
        console.error("Error fetching measurements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchMeasurements();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  const handleInputChange = (key: string, value: string) => {
    setNewValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const payload: Record<string, number | null> = { date: today as unknown as null };

      measurementFields.forEach((field) => {
        const newValue = newValues[field.key];
        if (newValue !== undefined && newValue !== "") {
          payload[field.key] = parseFloat(newValue);
        }
      });

      const response = await fetch("/api/body-measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/dashboard/apzvalga");
      } else {
        console.error("Failed to save measurements");
      }
    } catch (error) {
      console.error("Error saving measurements:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatChange = (change: number | null) => {
    if (change === null || change === undefined) return null;
    const prefix = change > 0 ? "+" : "";
    const color = change > 0 ? "text-[#59CA1C]" : change < 0 ? "text-[#FF1D21]" : "text-[#9FA4B0]";
    return <span className={`text-[12px] font-medium ${color}`}>{prefix}{change}</span>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#60988E]" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl p-8">
          <h1
            className="text-[36px] font-semibold text-[#101827] mb-8"
            style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
          >
            Įvesk kūno apimtis
          </h1>

          <div className="flex gap-12">
            {/* Left side - Body illustration and tips */}
            <div className="flex-shrink-0 w-[280px]">
              <div className="mb-6">
                {session?.user?.gender === "male" ? (
                  <MaleBodySvg className="w-[280px] h-[427px]" />
                ) : (
                  <FemaleBodySvg className="w-[280px] h-[427px]" />
                )}
              </div>

              <div className="border border-[#E6E6E6] rounded-xl p-4">
                <h3
                  className="text-[16px] font-semibold text-[#101827] mb-3"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  Kaip matuoti?
                </h3>
                <ul className="space-y-2 text-[13px] text-[#555B65]" style={{ fontFamily: "Outfit, sans-serif" }}>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Matuoti visada ta pačia ranka / koja (pvz., dešine)</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Naudoti minkštą siuvėjo metrą</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Matuoti 1x per savaitę, ryte</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Fiksuoti sistemoj per „Matavimų" skiltį</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 border border-[#E6E6E6] rounded-xl p-6">
              <div className="space-y-0">
                {measurementFields.map((field) => {
                  const currentValue = existingData.latest?.[field.key as keyof typeof existingData.latest] as number | null;
                  const change = existingData.changes?.[field.key as keyof typeof existingData.changes] as number | null;

                  return (
                    <div key={field.key} className="flex items-center py-3 border-b border-[#F0F0F0] last:border-b-0">
                      {/* Label and description */}
                      <div className="flex-1 min-w-[200px]">
                        <p
                          className="text-[15px] font-semibold text-[#101827]"
                          style={{ fontFamily: "Outfit, sans-serif" }}
                        >
                          {field.label}
                        </p>
                        <p
                          className="text-[12px] text-[#555B65]"
                          style={{ fontFamily: "Outfit, sans-serif", lineHeight: "140%" }}
                        >
                          {field.description}
                        </p>
                      </div>

                      {/* Current value with change */}
                      <div className="w-[120px] flex items-baseline justify-end gap-1">
                        {currentValue !== null ? (
                          <>
                            <span
                              className="text-[16px] font-bold text-[#101827]"
                              style={{ fontFamily: "Outfit, sans-serif", fontStyle: "italic" }}
                            >
                              {currentValue}
                            </span>
                            <span className="text-[13px] font-normal text-[#555B65]">{field.unit}</span>
                            {change !== null && (
                              <span className="ml-1">{formatChange(change)}</span>
                            )}
                          </>
                        ) : (
                          <span className="text-[13px] text-[#9FA4B0]">—</span>
                        )}
                      </div>

                      {/* Input */}
                      <div className="flex items-center gap-2 ml-6">
                        <input
                          type="number"
                          step="0.1"
                          value={newValues[field.key] || ""}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          placeholder="0"
                          className="w-[70px] h-[40px] px-3 text-center border border-[#E6E6E6] rounded-lg text-[14px] text-[#101827] focus:outline-none focus:border-[#60988E] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          style={{ fontFamily: "Outfit, sans-serif" }}
                        />
                        <span className="text-[13px] text-[#555B65] w-[30px]">{field.unit === "kg" ? "kg." : "cm."}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-8 justify-end">
                <button
                  onClick={() => router.push("/dashboard/apzvalga")}
                  className="px-8 py-3 border border-[#E6E6E6] rounded-full text-[14px] font-medium text-[#101827] hover:bg-[#F5F5F5] transition-colors"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  Atšaukti
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || Object.keys(newValues).length === 0}
                  className="px-8 py-3 bg-[#60988E] rounded-full text-[14px] font-medium text-white hover:bg-[#4d7a72] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  {isSaving ? "Saugoma..." : "Išsaugoti"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
