"use client";

import { useState, useMemo } from "react";
import { ToggleButtonGroup } from "@/components/ui/toggle-button-group";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomInput } from "@/components/ui/custom-input";

// Activity levels for calorie calculator
const activityLevels = [
  {
    id: "sedentary",
    name: "Sėdimas",
    description: "Sėdimas darbas, beveik nesportuoju.",
    multiplier: 1.2,
  },
  {
    id: "light",
    name: "Lengvas",
    description: "Sportuoju 1-3 kartus per savaitę.",
    multiplier: 1.375,
  },
  {
    id: "moderate",
    name: "Normalus",
    description: "Sportuoju 3-5 kartus per savaitę.",
    multiplier: 1.465,
  },
  {
    id: "active",
    name: "Aktyvus",
    description: "Intensyvus sportas 4-5 kartus per savaitę.",
    multiplier: 1.55,
  },
  {
    id: "very_active",
    name: "Labai aktyvus",
    description: "Sportuoju 6-7 kartus per savaitę.",
    multiplier: 1.725,
  },
  {
    id: "extra_active",
    name: "Itin aktyvus",
    description: "Fizinis darbas arba sportas 2 kartus per dieną.",
    multiplier: 1.9,
  },
];

const goals = [
  { id: "maintain", label: "Palaikyti esamą" },
  { id: "lose", label: "Numesti svorio" },
  { id: "gain", label: "Priaugti svorio" },
];

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

export default function KalorijuSkaiciuoklePage() {
  // Calculator state
  const [selectedGoal, setSelectedGoal] = useState("maintain");
  const [selectedActivity, setSelectedActivity] = useState("sedentary");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  // Calculate calories using Mifflin-St Jeor formula
  const calorieResults = useMemo(() => {
    const ageNum = parseFloat(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    // Check if all values are valid
    if (!ageNum || !heightNum || !weightNum || ageNum <= 0 || heightNum <= 0 || weightNum <= 0) {
      return null;
    }

    // Mifflin-St Jeor Formula:
    // Men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
    // Women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
    let bmr: number;
    if (gender === "male") {
      bmr = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) + 5;
    } else {
      bmr = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) - 161;
    }

    // Get activity multiplier
    const activity = activityLevels.find(l => l.id === selectedActivity);
    const multiplier = activity?.multiplier || 1.2;

    // TDEE (Total Daily Energy Expenditure)
    const tdee = Math.round(bmr * multiplier);

    // Calculate different deficit/surplus levels
    return {
      maintain: tdee,
      mildLoss: Math.round(tdee * 0.9), // 10% deficit - mild weight loss (~0.25 kg/week)
      moderateLoss: Math.round(tdee * 0.8), // 20% deficit - moderate weight loss (~0.5 kg/week)
      extremeLoss: Math.round(tdee * 0.6), // 40% deficit - extreme weight loss (~1 kg/week)
      mildGain: Math.round(tdee * 1.1), // 10% surplus - mild weight gain
      moderateGain: Math.round(tdee * 1.2), // 20% surplus - moderate weight gain
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
        recommendedIndex: 2, // Vidutinis deficitas rekomenduojamas
      };
    } else if (selectedGoal === "gain") {
      return {
        options: [
          { label: "Palaikyti esamą", value: calorieResults.maintain },
          { label: "Lengvas", value: calorieResults.mildGain },
          { label: "Vidutinis", value: calorieResults.moderateGain },
          { label: "Greitas", value: Math.round(calorieResults.maintain * 1.3) },
        ],
        recommendedIndex: 2, // Vidutinis perteklius rekomenduojamas
      };
    } else {
      // maintain
      return {
        options: [
          { label: "Palaikyti esamą", value: calorieResults.maintain },
          { label: "Lengvas deficitas", value: calorieResults.mildLoss },
          { label: "Lengvas perteklius", value: calorieResults.mildGain },
          { label: "Vidutinis perteklius", value: calorieResults.moderateGain },
        ],
        recommendedIndex: 0, // Palaikyti esamą rekomenduojamas
      };
    }
  };

  const { options: calorieOptions, recommendedIndex } = getCalorieData();
  const [selectedCalorieIndex, setSelectedCalorieIndex] = useState<number | null>(null);

  // Use selected or recommended index
  const activeIndex = selectedCalorieIndex !== null ? selectedCalorieIndex : recommendedIndex;

  return (
    <div className="font-[Outfit] mt-3">
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
            <button className="w-full bg-[#60988E] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#34786C] transition-colors">
              Pasirinkti mitybos planą
            </button>
          </div>

          {/* Right side - Activity descriptions */}
          <div className="bg-white rounded-2xl border border-[#E6E6E6] p-6">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#E6E6E6]">
              <span className="text-[18px] font-semibold text-[#101827] font-[Outfit]">Aktyvumas</span>
              <span className="text-[18px] font-semibold text-[#101827] font-[Outfit]">Koeficientas</span>
            </div>
            <div className="space-y-0">
              {activityLevels.map((level, index) => (
                <div
                  key={level.id}
                  className={`flex justify-between items-start gap-4 py-4 ${
                    index < activityLevels.length - 1 ? "border-b border-[#E6E6E6]" : ""
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
                    {level.multiplier}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
}

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
