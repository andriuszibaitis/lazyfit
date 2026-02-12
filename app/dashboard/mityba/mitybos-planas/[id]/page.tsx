"use client";

import { use, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePageTitle } from "@/app/dashboard/contexts/page-title-context";
import { getNutritionPlanIcon } from "@/components/icons/nutrition-plan-icons";
import { ToggleButtonGroup } from "@/components/ui/toggle-button-group";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomInput } from "@/components/ui/custom-input";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface NutritionPlan {
  id: string;
  name: string;
  description: string | null;
  benefits: string | null;
  icon: string | null;
  isPopular: boolean;
  gender: string;
  imageUrl: string | null;
  videoUrl: string | null;
  days: {
    id: string;
    dayNumber: number;
    meals: {
      id: string;
      mealNumber: number;
      name: string;
      items: {
        id: string;
        foodProductName: string;
        quantity: number;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
      }[];
    }[];
  }[];
}

// Activity levels for calorie calculator
const activityLevels = [
  {
    id: "sedentary",
    name: "Labai mažas",
    description: "Sėdimas darbas, nesportuoju, pasyviai leidžiu laisvalaikį, nedaug nueinu žingsnių.",
    multiplier: 1.2,
  },
  {
    id: "light",
    name: "Mažas",
    description: "Sėdimas darbas, šiek tiek sportuoju, kartais išeinu pasivaikščioti ar važinėju dviračiu.",
    multiplier: 1.375,
  },
  {
    id: "moderate",
    name: "Normalus",
    description: "Sėdimas darbas, sportuoju 2-3 x sav., dažnai šeinu pasivaikščioti.",
    multiplier: 1.465,
  },
  {
    id: "active",
    name: "Aktyvus",
    description: "Fizinis darbas, sportuoju 2-3 x sav., aktyviau leidžiu laisvalaikį.",
    multiplier: 1.55,
  },
  {
    id: "very_active",
    name: "Labai aktyvus",
    description: "Fizinis darbas, sportuoju 3-4 x sav., aktyviai leidžiu laisvalaikį.",
    multiplier: 1.725,
  },
  {
    id: "extra_active",
    name: "Aktyviausias",
    description: "Fizinis darbas, sportuoju kiekvieną dieną, labai aktyviai leidžiu laisvalaikį.",
    multiplier: 1.9,
  },
];

// Activity levels for display table (with points)
const activityLevelsTable = [
  {
    name: "BMR",
    description: "Tai bazinis medžiagų apykaitos greitis. Minimalus reikalingas kalorijų kiekis be aktyvumo.",
    points: "0",
  },
  {
    name: "Labai mažas",
    description: "Sėdimas darbas, nesportuoju, pasyviai leidžiu laisvalaikį, nedaug nueinu žingsnių.",
    points: "1 - 2",
  },
  {
    name: "Mažas",
    description: "Sėdimas darbas, šiek tiek sportuoju, kartais išeinu pasivaikščioti ar važinėju dviračiu.",
    points: "3 - 4",
  },
  {
    name: "Normalus",
    description: "Sėdimas darbas, sportuoju 2-3 x sav., dažnai šeinu pasivaikščioti.",
    points: "5",
  },
  {
    name: "Aktyvus",
    description: "Fizinis darbas, sportuoju 2-3 x sav., aktyviau leidžiu laisvalaikį.",
    points: "6 - 7",
  },
  {
    name: "Labai aktyvus",
    description: "Fizinis darbas, sportuoju 3-4 x sav., aktyviai leidžiu laisvalaikį.",
    points: "8 - 9",
  },
  {
    name: "Aktyviausias",
    description: "Fizinis darbas, sportuoju kiekvieną dieną, labai aktyviai leidžiu laisvalaikį.",
    points: "10",
  },
];

const goals = [
  { id: "maintain", label: "Palaikyti esamą" },
  { id: "lose", label: "Numesti svorio" },
  { id: "gain", label: "Priaugti svorio" },
];

export default function NutritionPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [plan, setPlan] = useState<NutritionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { setPageTitle, setShowBackButton, setBackUrl } = usePageTitle();

  // Calculator state
  const [selectedGoal, setSelectedGoal] = useState("maintain");
  const [selectedActivity, setSelectedActivity] = useState("sedentary");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  // Confirm modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Fetch user profile to pre-fill gender and age
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();

          // Set gender
          if (data.gender) {
            const normalizedGender = data.gender.toLowerCase();
            if (normalizedGender === "male" || normalizedGender === "vyras" || normalizedGender === "m") {
              setGender("male");
            } else if (normalizedGender === "female" || normalizedGender === "moteris" || normalizedGender === "f") {
              setGender("female");
            }
          }

          // Set age from birthDate
          if (data.birthDate) {
            const today = new Date();
            const birth = new Date(data.birthDate);
            let userAge = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
              userAge--;
            }
            if (userAge > 0) {
              setAge(String(userAge));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }

    fetchUserProfile();
  }, []);

  // Calculate calories using Mifflin-St Jeor formula
  const calorieResults = useMemo(() => {
    const ageNum = parseFloat(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (!ageNum || !heightNum || !weightNum || ageNum <= 0 || heightNum <= 0 || weightNum <= 0) {
      return null;
    }

    let bmr: number;
    if (gender === "male") {
      bmr = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) + 5;
    } else {
      bmr = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) - 161;
    }

    const activity = activityLevels.find(l => l.id === selectedActivity);
    const multiplier = activity?.multiplier || 1.2;
    const tdee = Math.round(bmr * multiplier);

    return {
      maintain: tdee,
      mildLoss: Math.round(tdee * 0.9),
      moderateLoss: Math.round(tdee * 0.8),
      extremeLoss: Math.round(tdee * 0.6),
      mildGain: Math.round(tdee * 1.1),
      moderateGain: Math.round(tdee * 1.2),
    };
  }, [age, height, weight, gender, selectedActivity]);

  // Get calorie values and recommended index based on goal
  const getCalorieData = () => {
    if (!calorieResults) {
      return {
        options: [
          { label: "Palaikyti esamą", value: 0 },
          { label: "Lengvas", value: 0 },
          { label: "Vidutinis", value: 0 },
          { label: "Greitas", value: 0 },
        ],
        recommendedIndex: 0,
      };
    }

    if (selectedGoal === "lose") {
      return {
        options: [
          { label: "Palaikyti esamą", value: calorieResults.maintain },
          { label: "Lengvas", value: calorieResults.mildLoss },
          { label: "Vidutinis", value: calorieResults.moderateLoss },
          { label: "Greitas", value: calorieResults.extremeLoss },
        ],
        recommendedIndex: 2,
      };
    } else if (selectedGoal === "gain") {
      return {
        options: [
          { label: "Palaikyti esamą", value: calorieResults.maintain },
          { label: "Lengvas", value: calorieResults.mildGain },
          { label: "Vidutinis", value: calorieResults.moderateGain },
          { label: "Greitas", value: Math.round(calorieResults.maintain * 1.3) },
        ],
        recommendedIndex: 2,
      };
    } else {
      return {
        options: [
          { label: "Palaikyti esamą", value: calorieResults.maintain },
          { label: "Lengvas deficitas", value: calorieResults.mildLoss },
          { label: "Lengvas perteklius", value: calorieResults.mildGain },
          { label: "Vidutinis perteklius", value: calorieResults.moderateGain },
        ],
        recommendedIndex: 0,
      };
    }
  };

  const { options: calorieOptions, recommendedIndex } = getCalorieData();
  const [selectedCalorieIndex, setSelectedCalorieIndex] = useState<number | null>(null);

  // Use selected or recommended index
  const activeIndex = selectedCalorieIndex !== null ? selectedCalorieIndex : recommendedIndex;

  // Handle adding nutrition plan to user's plans
  const handleAddPlan = async () => {
    if (!plan || isAdding) return;

    // Check if calculator data is filled
    if (!age || !height || !weight) {
      alert("Prašome užpildyti visus skaičiuoklės laukus");
      return;
    }

    setIsAdding(true);
    try {
      const selectedCalories = calorieOptions[activeIndex]?.value || 0;

      const response = await fetch("/api/user-nutrition-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: plan.name,
          goal: selectedGoal,
          activityLevel: selectedActivity,
          gender,
          age,
          height,
          weight,
          sourcePlanId: plan.id, // Reference to original plan
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Nepavyko pridėti plano");
      }

      setShowConfirmModal(false);
      router.push("/dashboard/mano-rutina/mityba");
    } catch (error) {
      console.error("Error adding plan:", error);
      alert(error instanceof Error ? error.message : "Nepavyko pridėti plano");
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    setShowBackButton(true);
    setBackUrl("/dashboard/mityba/mitybos-planai");

    return () => {
      setShowBackButton(false);
      setBackUrl(null);
      setPageTitle("");
    };
  }, [setShowBackButton, setBackUrl, setPageTitle]);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const response = await fetch(`/api/nutrition-plans/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPlan(data);
          setPageTitle(data.name);
        }
      } catch (error) {
        console.error("Error fetching nutrition plan:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlan();
  }, [id, setPageTitle]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center py-12">
        <p className="text-[#6B7280]">Mitybos planas nerastas</p>
        <Link
          href="/dashboard/mityba/mitybos-planai"
          className="text-brand-green hover:underline mt-2 inline-block"
        >
          Grįžti į mitybos planus
        </Link>
      </div>
    );
  }

  const IconComponent = getNutritionPlanIcon(plan.icon || "swimming");

  return (
    <div className="font-[Outfit] mt-3">
      {/* Top section with image and info */}
      <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative">
            <Image
              src={
                imageError || !plan.imageUrl
                  ? "/placeholder.svg?height=400&width=600"
                  : plan.imageUrl
              }
              alt={plan.name}
              width={600}
              height={310}
              className="w-full h-[310px] object-cover rounded-2xl"
              onError={() => setImageError(true)}
            />
          </div>

          {/* Description and Instructions */}
          <div className="flex flex-col justify-between">
            {/* Description - top */}
            <p className="text-[#6B7280] text-sm leading-relaxed">
              {plan.description || "Aprašymas nepateiktas."}
            </p>

            {/* Instructions - bottom */}
            <div className="mt-auto">
              <h2
                className="text-[18px] font-medium text-[#101827] mb-4 font-[Outfit]"
                style={{ lineHeight: "120%", letterSpacing: "-0.36px" }}
              >
                Instrukcija
              </h2>

              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-[20px] bg-[#FFF7DF] border border-[#FAC64B] text-[#FAC64B] flex items-center justify-center text-sm font-medium">
                    1
                  </span>
                  <div>
                    <h3 className="text-[#101827] font-semibold text-sm mb-1">
                      Išsirink savo mitybos planą pagal kalorijų skaičiuoklę
                    </h3>
                    <p className="text-[#6B7280] text-sm">
                      Pasirink savo aktyvumo lygį. Užpildyk lentelę su savo duomenimis. Pagal
                      apskaičiuotą kalorijų poreikį pasirink tinkamą mitybos planą.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-[20px] bg-[#FFF7DF] border border-[#FAC64B] text-[#FAC64B] flex items-center justify-center text-sm font-medium">
                    2
                  </span>
                  <div>
                    <h3 className="text-[#101827] font-semibold text-sm mb-1">
                      Mitybos plano koregavimas
                    </h3>
                    <p className="text-[#6B7280] text-sm">
                      Norint koreguoti mitybos planą, tai galima padaryti savo paskyroje.
                      Svarbu, kad koreguojant bendras kalorijų kiekis nesikeistų, o maistinė
                      vertė išliktų panaši.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calorie Calculator Section */}
      <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6 mb-8">
        <h2
          className="text-[36px] font-semibold text-[#101827] mb-6"
          style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
        >
          Kalorijų skaičiuoklė
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Form */}
          <div className="space-y-6">
            {/* Goal selection */}
            <div>
              <label className="block text-[14px] font-normal text-[#555B65] mb-2 font-[Outfit]" style={{ lineHeight: "140%", letterSpacing: "-0.28px" }}>
                Tavo tikslas
              </label>
              <ToggleButtonGroup
                options={goals}
                value={selectedGoal}
                onChange={setSelectedGoal}
              />
            </div>

            {/* Activity level */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-[14px] font-normal text-[#555B65] font-[Outfit]" style={{ lineHeight: "140%", letterSpacing: "-0.28px" }}>
                  Tavo aktyvumas
                </label>
                <div className="w-4 h-4 rounded-full bg-[#E6E6E6] flex items-center justify-center text-[10px] text-[#6B7280]">
                  i
                </div>
              </div>
              <CustomSelect
                options={activityLevels.map((level) => ({
                  id: level.id,
                  label: level.name,
                  description: level.description,
                }))}
                value={selectedActivity}
                onChange={setSelectedActivity}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-[14px] font-normal text-[#555B65] mb-2 font-[Outfit]" style={{ lineHeight: "140%", letterSpacing: "-0.28px" }}>
                Tavo lytis
              </label>
              <ToggleButtonGroup
                options={[
                  { id: "male", label: "Vyras" },
                  { id: "female", label: "Moteris" },
                ]}
                value={gender}
                onChange={(val) => setGender(val as "male" | "female")}
              />
            </div>

            {/* Age, Height, Weight inputs */}
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

            {/* Results section */}
            <div className="space-y-4">
              <p className="text-[14px] font-medium text-[#101827] font-[Outfit]">
                Rekomenduojamas kalorijų kiekis norint pasiekti rezultatą
              </p>

              {/* Calorie options */}
              <div className="grid grid-cols-4 gap-3">
                {calorieOptions.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedCalorieIndex(index)}
                    className={`relative p-4 rounded-lg text-left transition-colors ${
                      index === activeIndex
                        ? "bg-[#FFF7DF] border-2 border-[#FFD16E]"
                        : "bg-[#E6E6E6] hover:bg-[#D9D9D9]"
                    }`}
                  >
                    {index === recommendedIndex && (
                      <span className="absolute -top-2 right-2 px-2 py-0.5 bg-[#FFB700] rounded text-[10px] font-medium text-[#101827]">Siūloma</span>
                    )}
                    <p className="text-[12px] text-[#101827] font-[Outfit] mb-1">{option.label}</p>
                    <p className="font-[Outfit]">
                      <span className="text-[14px] font-semibold text-[#101827]">{option.value}</span>
                      <span className="text-[12px] text-[#101827]"> kcal</span>
                      <span className="text-[11px] text-[#101827]">/diena</span>
                    </p>
                  </button>
                ))}
              </div>

              {/* Warning message */}
              {selectedGoal === "lose" && calorieResults && (
              <div className="bg-[#FDECEC] rounded-lg p-4">
                <p className="text-[13px] text-[#E74043] font-[Outfit] font-normal" style={{ lineHeight: "120%" }}>
                  *Svarbu, kad kalorijų deficitas nebūtų per didelis, nes tai gali sulėtinti medžiagų apykaitą ir svorio metimą bei sukelti kitų sveikatos problemų
                </p>
              </div>
              )}
            </div>

            {/* Submit button */}
            <button
              onClick={() => {
                if (!age || !height || !weight) {
                  alert("Prašome užpildyti visus skaičiuoklės laukus (amžių, ūgį ir svorį)");
                  return;
                }
                setShowConfirmModal(true);
              }}
              className="w-full bg-[#60988E] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#34786C] transition-colors"
            >
              Pasirinkti mitybos planą
            </button>
          </div>

          {/* Right side - Activity descriptions */}
          <div className="bg-white rounded-2xl border border-[#E6E6E6] p-6">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#E6E6E6]">
              <span className="text-[18px] font-semibold text-[#101827] font-[Outfit]">Aktyvumas</span>
              <span className="text-[18px] font-semibold text-[#101827] font-[Outfit]">Balai</span>
            </div>
            <div className="space-y-0">
              {activityLevelsTable.map((level, index) => (
                <div
                  key={level.name}
                  className={`flex justify-between items-start gap-4 py-4 ${
                    index < activityLevelsTable.length - 1 ? "border-b border-[#E6E6E6]" : ""
                  }`}
                >
                  <div className="flex-1">
                    <h4 className="text-[14px] font-semibold text-[#101827] mb-1 font-[Outfit]">
                      {level.name}
                    </h4>
                    <p className="text-[13px] text-[#6B7280] font-[Outfit]" style={{ lineHeight: "140%" }}>
                      {level.description}
                    </p>
                  </div>
                  <span className="text-[14px] font-bold text-[#101827] font-[Outfit] whitespace-nowrap">
                    {level.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleAddPlan}
        title={`Ar tikrai norite pridėti "${plan?.name}" prie savo planų?`}
        description="Šis planas bus pridėtas prie jūsų asmeninių mitybos planų ir automatiškai taps aktyviu. Jūsų ankstesnis aktyvus planas bus pristabdytas."
        confirmText="Pridėti planą"
        cancelText="Atšaukti"
        isLoading={isAdding}
      />
    </div>
  );
}

// FAQ Data
const faqData = [
  {
    question: "Kaip veikia kalorijų skaičiuoklė?",
    answer: "Kalorijų skaičiuoklė naudoja vartotojo įvestus duomenis, tokius kaip amžius, lytis, ūgis, svoris ir fizinis aktyvumas, kad apskaičiuotų bazinę medžiagų apykaitą (BMR) ir rekomenduojamą dienos kalorijų normą pagal pasirinktą tikslą (numesti svorio, išlaikyti esamą svorį ar priaugti svorio).",
  },
  {
    question: "Ar kalorijų skaičiuoklė tinka visiems žmonėms?",
    answer: "Kalorijų skaičiuoklė yra skirta suaugusiems žmonėms. Ji gali būti netinkama nėščioms moterims, žindančioms mamoms ar žmonėms su tam tikromis sveikatos problemomis. Rekomenduojame pasitarti su gydytoju prieš pradedant naują mitybos planą.",
  },
  {
    question: "Ar galima skaičiuoti kalorijas sportuojant?",
    answer: "Taip, kalorijų skaičiuoklė atsižvelgia į jūsų fizinio aktyvumo lygį. Kuo aktyvesnis gyvenimo būdas, tuo daugiau kalorijų reikia suvartoti norint palaikyti esamą svorį.",
  },
  {
    question: "Kiek kartų per dieną reikėtų tikrinti savo kalorijų suvartojimą?",
    answer: "Rekomenduojama sekti kalorijų suvartojimą po kiekvieno valgymo arba bent kartą per dieną vakare, kad galėtumėte įvertinti bendrą dienos kalorijų kiekį.",
  },
  {
    question: "Ar kalorijų skaičiuoklė padeda numesti svorio?",
    answer: "Kalorijų skaičiuoklė yra įrankis, padedantis suprasti, kiek kalorijų reikia suvartoti norint pasiekti savo tikslus. Svorio metimui svarbu suvartoti mažiau kalorijų nei sudeginate.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-white rounded-2xl border border-[#E6E6E6] p-6 mb-8">
      <h2
        className="text-[36px] font-semibold text-[#101827] mb-6"
        style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
      >
        DUK
      </h2>

      <div className="space-y-0">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="border-b border-[#E6E6E6]"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full py-4 flex justify-between items-center text-left"
            >
              <span
                className="text-[18px] font-medium text-[#101827] font-[Outfit]"
                style={{ lineHeight: "120%", letterSpacing: "-0.36px" }}
              >
                {index + 1}. {faq.question}
              </span>
              <span className="text-[20px] text-[#101827] ml-4">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div className="pb-4">
                <p
                  className="text-[16px] font-normal text-[#555B65] font-[Outfit]"
                  style={{ lineHeight: "140%", letterSpacing: "-0.32px" }}
                >
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
