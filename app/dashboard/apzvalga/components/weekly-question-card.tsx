"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface WeeklyQuestionCardProps {
  question?: string;
  answer?: string;
  trainerName?: string;
  trainerImage?: string;
}

export default function WeeklyQuestionCard({
  question = "Ar po sunkios treniruotės geriau ilsėtis pasyviai, ar daryti lengvą mankštą?",
  answer = "Po intensyvaus krūvio rinkis aktyvų poilsį. Lengvas pasivaikščiojimas, tempimo pratimai ar plaukimas pagreitina raumenų atsigautymą ir sumažina skausmą daug efektyviau nei tiesiog gulėjimas. Tai pades greičiau grįžti į kitą treniruotę pilno jėga.",
  trainerName = "Savaitės klausimas",
  trainerImage = "/images/dashboard/savaites-klausimas.jpg",
}: WeeklyQuestionCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const maxLength = 300;

  const handleSubmit = () => {
    // TODO: Submit question to API
    console.log("Submitting question:", questionText);
    setQuestionText("");
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-[#3D6B5E] rounded-2xl p-6 text-white relative overflow-hidden h-full flex flex-col">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={trainerImage}
            alt="Trainer"
            fill
            className="object-cover -scale-x-100" style={{ objectPosition: "center 20%" }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col flex-1">
          <h3
            className="text-[30px] font-semibold text-white mb-2"
            style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
          >
            {trainerName}
          </h3>

          <div className="bg-[#F7F7F7] rounded-xl p-4 mb-4 mt-auto">
            <h4
              className="text-[18px] font-normal text-[#101827] mb-4"
              style={{ fontFamily: "Outfit, sans-serif", lineHeight: "130%", letterSpacing: "-0.02em" }}
            >
              {question}
            </h4>

            <p
              className="text-[13px] font-normal text-[#555B65]"
              style={{ fontFamily: "Outfit, sans-serif", lineHeight: "120%" }}
            >
              {answer}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full h-8 bg-[#60988E] text-white text-[14px] font-medium rounded-lg hover:bg-[#4d7a72] transition-colors"
          >
            Užduoti treneriui klausimą
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-[520px] mx-4 relative">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-[#101827] hover:text-[#555B65] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Title */}
            <h2
              className="text-[24px] font-semibold text-[#101827] text-center mb-4"
              style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
            >
              Užduoti treneriui klausimą
            </h2>

            {/* Description */}
            <p
              className="text-[14px] text-[#555B65] text-center mb-6"
              style={{ fontFamily: "Outfit, sans-serif", lineHeight: "140%" }}
            >
              Kiekvienos savaitės pabaigoje treneris atrenka <span className="font-semibold text-[#101827]">vieną įdomiausią</span> ar <span className="font-semibold text-[#101827]">aktualiausią</span> klausimą, o atsakymą į jį publikuoja visiems.
            </p>

            {/* Label */}
            <label
              className="block text-[14px] text-[#555B65] mb-2"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Užduokite klausimą treneriui
            </label>

            {/* Textarea */}
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value.slice(0, maxLength))}
              placeholder=""
              className="w-full h-32 p-4 border border-[#E6E6E6] rounded-xl resize-none text-[14px] text-[#101827] placeholder:text-[#9FA4B0] focus:outline-none focus:border-[#60988E] transition-colors"
              style={{ fontFamily: "Outfit, sans-serif" }}
            />

            {/* Character count */}
            <p
              className="text-[12px] text-[#9FA4B0] mt-2"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {questionText.length}/{maxLength}
            </p>

            {/* Buttons */}
            <div className="flex gap-3 mt-6 justify-center">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-3 border border-[#E6E6E6] rounded-full text-[14px] font-medium text-[#101827] hover:bg-[#F5F5F5] transition-colors"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Atšaukti
              </button>
              <button
                onClick={handleSubmit}
                disabled={questionText.trim().length === 0}
                className="px-8 py-3 bg-[#60988E] rounded-full text-[14px] font-medium text-white hover:bg-[#4d7a72] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Siųsti klausimą
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
