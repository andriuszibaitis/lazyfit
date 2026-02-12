"use client";

import { useState } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ToggleButtonGroup } from "@/components/ui/toggle-button-group";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomInput } from "@/components/ui/custom-input";

interface UserProfile {
  gender: string | null;
  age: number | null;
}

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

const activityLevels = [
  {
    id: "sedentary",
    label: "Sėdimas",
    description: "Sėdimas darbas, beveik nesportuoju.",
  },
  {
    id: "light",
    label: "Lengvas",
    description: "Sportuoju 1-3 kartus per savaitę.",
  },
  {
    id: "moderate",
    label: "Normalus",
    description: "Sportuoju 3-5 kartus per savaitę.",
  },
  {
    id: "active",
    label: "Aktyvus",
    description: "Intensyvus sportas 4-5 kartus per savaitę.",
  },
  {
    id: "very_active",
    label: "Labai aktyvus",
    description: "Sportuoju 6-7 kartus per savaitę.",
  },
  {
    id: "extra_active",
    label: "Itin aktyvus",
    description: "Fizinis darbas arba sportas 2 kartus per dieną.",
  },
];

const goals = [
  { id: "maintain", label: "Palaikyti esamą" },
  { id: "lose", label: "Numesti svorio" },
  { id: "gain", label: "Priaugti svorio" },
];

const genderOptions = [
  { id: "male", label: "Vyras" },
  { id: "female", label: "Moteris" },
];

// Helper to normalize gender value
const normalizeGender = (gender: string | null): string => {
  if (!gender) return "male";
  const lower = gender.toLowerCase();
  if (lower === "male" || lower === "vyras" || lower === "m") return "male";
  if (lower === "female" || lower === "moteris" || lower === "f") return "female";
  return "male";
};

export default function CreatePlanModal({ isOpen, onClose, userProfile }: CreatePlanModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [planName, setPlanName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 2 state - pre-fill from user profile
  const [activeTab, setActiveTab] = useState<"calculator" | "activity">("calculator");
  const [goal, setGoal] = useState("maintain");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [gender, setGender] = useState(() => normalizeGender(userProfile.gender));
  const [age, setAge] = useState(() => userProfile.age ? String(userProfile.age) : "");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const totalSteps = 2;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onClose();
    }
  };

  const handleCreate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user-nutrition-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: planName,
          goal,
          activityLevel,
          gender,
          age,
          height,
          weight,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Nepavyko sukurti plano");
      }

      // Success - close modal and refresh page
      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Įvyko klaida");
    } finally {
      setIsLoading(false);
    }
  };

  const isStep1Valid = planName.trim().length > 0;
  const isStep2Valid = goal && activityLevel && gender && age && height && weight;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center p-6 relative border-b border-[#EFEFEF]">
        <h1
          className="text-[28px] font-semibold text-[#101827]"
          style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
        >
          Sukurti savo mitybos planą
        </h1>
        <button
          onClick={onClose}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-lg border border-[#E6E6E6] hover:bg-gray-50 transition-colors"
        >
          <X className="w-5 h-5 text-[#6B7280]" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 py-10 overflow-y-auto">
        {/* Stepper */}
        <div className="flex items-center gap-0 mb-8">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step < currentStep
                    ? "bg-[#FFB700] text-white"
                    : step === currentStep
                    ? "bg-white border-2 border-[#FFB700] text-[#101827]"
                    : "bg-white border-2 border-[#E6E6E6] text-[#9FA4B0]"
                }`}
              >
                {step < currentStep ? <Check className="w-5 h-5" /> : step}
              </div>
              {step < totalSteps && (
                <div
                  className={`w-24 h-0.5 border-t-2 border-dashed ${
                    step < currentStep ? "border-[#FFB700]" : "border-[#E6E6E6]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="w-full max-w-2xl">
          {currentStep === 1 && (
            <div>
              <h2 className="text-center text-[#101827] font-medium mb-6 font-[Outfit]">
                Sukūrk savo mitybos plano pavadinimą
              </h2>
              <div className="max-w-md mx-auto">
                <label className="block text-sm text-[#6B7280] mb-2 font-[Outfit]">
                  Mitybos plano pavadinimas
                </label>
                <input
                  type="text"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E6E6E6] rounded-lg focus:outline-none focus:border-[#60988E] font-[Outfit]"
                  placeholder=""
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-center text-[#101827] text-lg font-semibold mb-2 font-[Outfit]">
                Suskaičiuok kalorijas
              </h2>
              <p className="text-center text-[#6B7280] text-sm mb-8 font-[Outfit] max-w-xl mx-auto">
                Patogiai susidėk dienos valgius, pasirink produktus ir automatiškai paskaičiuok suvartotas kalorijas bei maistines medžiagas – tai padidina tikimybę pasiekti savo tikslus net 2–3 kartus, nes net 75–80 % žmonių, kurie seka kalorijas, pasiekia geresnius rezultatus nei tie, kurie to nedaro.
              </p>

              {/* Tabs */}
              <div className="flex justify-center mb-8">
                <div className="flex border-b border-[#E6E6E6]">
                  <button
                    onClick={() => setActiveTab("calculator")}
                    className={`px-6 py-3 text-sm font-medium font-[Outfit] border-b-2 transition-colors ${
                      activeTab === "calculator"
                        ? "border-[#101827] text-[#101827]"
                        : "border-transparent text-[#9FA4B0] hover:text-[#6B7280]"
                    }`}
                  >
                    Skaičiuoklę
                  </button>
                  <button
                    onClick={() => setActiveTab("activity")}
                    className={`px-6 py-3 text-sm font-medium font-[Outfit] border-b-2 transition-colors ${
                      activeTab === "activity"
                        ? "border-[#101827] text-[#101827]"
                        : "border-transparent text-[#9FA4B0] hover:text-[#6B7280]"
                    }`}
                  >
                    Aktyvumas
                  </button>
                </div>
              </div>

              {/* Tab content */}
              {activeTab === "calculator" && (
                <div className="space-y-6 max-w-lg mx-auto">
                  {/* Goal */}
                  <div>
                    <label className="block text-[14px] font-normal text-[#555B65] mb-2 font-[Outfit]" style={{ lineHeight: "140%", letterSpacing: "-0.28px" }}>
                      Tavo tikslas
                    </label>
                    <ToggleButtonGroup
                      options={goals}
                      value={goal}
                      onChange={setGoal}
                    />
                  </div>

                  {/* Activity level */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="block text-[14px] font-normal text-[#555B65] font-[Outfit]" style={{ lineHeight: "140%", letterSpacing: "-0.28px" }}>
                        Tavo aktyvumas
                      </label>
                      <div className="w-4 h-4 rounded-full bg-[#60988E] flex items-center justify-center text-[10px] text-white font-medium">
                        i
                      </div>
                    </div>
                    <CustomSelect
                      options={activityLevels.map((level) => ({
                        id: level.id,
                        label: level.label,
                        description: level.description,
                      }))}
                      value={activityLevel}
                      onChange={setActivityLevel}
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-[14px] font-normal text-[#555B65] mb-2 font-[Outfit]" style={{ lineHeight: "140%", letterSpacing: "-0.28px" }}>
                      Tavo lytis
                    </label>
                    <ToggleButtonGroup
                      options={genderOptions}
                      value={gender}
                      onChange={setGender}
                    />
                  </div>

                  {/* Age, Height, Weight */}
                  <div className="grid grid-cols-3 gap-4">
                    <CustomInput
                      label="Tavo amžius"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                    <CustomInput
                      label="Tavo ūgis"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      suffix="cm"
                    />
                    <CustomInput
                      label="Tavo svoris"
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      suffix="kg"
                    />
                  </div>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="max-w-lg mx-auto">
                  <div className="bg-white rounded-2xl border border-[#E6E6E6] p-6">
                    <div className="space-y-0">
                      {activityLevels.map((level, index) => (
                        <div
                          key={level.id}
                          className={`py-4 ${
                            index < activityLevels.length - 1 ? "border-b border-[#E6E6E6]" : ""
                          }`}
                        >
                          <h4 className="text-[14px] font-semibold text-[#101827] mb-1 font-[Outfit]">
                            {level.label}
                          </h4>
                          <p className="text-[13px] text-[#6B7280] font-[Outfit]" style={{ lineHeight: "140%" }}>
                            {level.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center gap-3 p-6 border-t border-[#EFEFEF]">
        {error && (
          <p className="text-sm text-red-500 font-[Outfit]">{error}</p>
        )}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            disabled={isLoading}
            className="px-6 py-3 rounded-full border border-[#E6E6E6] text-[#101827] font-medium hover:bg-gray-50 transition-colors font-[Outfit] disabled:opacity-50"
          >
            Atšaukti
          </button>
          {currentStep === 1 ? (
            <button
              onClick={handleNext}
              disabled={!isStep1Valid}
              className={`px-6 py-3 rounded-full font-medium transition-colors font-[Outfit] ${
                !isStep1Valid
                  ? "bg-[#E6E6E6] text-[#9FA4B0] cursor-not-allowed"
                  : "bg-[#60988E] text-white hover:bg-[#34786C]"
              }`}
            >
              Toliau
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={!isStep2Valid || isLoading}
              className={`px-6 py-3 rounded-full font-medium transition-colors font-[Outfit] flex items-center gap-2 ${
                !isStep2Valid || isLoading
                  ? "bg-[#E6E6E6] text-[#9FA4B0] cursor-not-allowed"
                  : "bg-[#60988E] text-white hover:bg-[#34786C]"
              }`}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Kuriama..." : "Sukurti mitybos planą"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
