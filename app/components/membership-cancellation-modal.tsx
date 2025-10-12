"use client";

import { useState } from "react";
import { CrownIcon } from "./icons";

interface MembershipCancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
}

export default function MembershipCancellationModal({
  isOpen,
  onClose,
  onCancel
}: MembershipCancellationModalProps) {
  const [showSurvey, setShowSurvey] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  if (!isOpen) return null;

  if (showTextInput) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto flex">
          {/* Left side - Content */}
          <div className="flex-1 p-8">
            <div className="mb-6">
              {/* Back button and title */}
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setShowTextInput(false)}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-[48px] font-bold text-[#101827] font-['mango'] leading-tight">
                  Kodėl nori atšaukti narystę?
                </h2>
              </div>

              <p className="text-lg text-gray-600 mb-6">
                Papasakokite, kodėl norite atšaukti...
              </p>

              {/* Text area */}
              <div className="mb-8">
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Įveskite savo priežastį..."
                  className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg resize-none focus:border-[#60988E] focus:ring-0 focus:outline-none"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-6 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Atšaukti
              </button>
              <button
                onClick={() => {
                  onCancel();
                  console.log('Custom cancellation reason:', customReason);
                }}
                disabled={!customReason.trim()}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  customReason.trim()
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Pilnai nutraukti
              </button>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="w-1/2 bg-gray-100 rounded-r-lg overflow-hidden relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 text-xl shadow-md"
            >
              ×
            </button>
            <img
              src="/images/auth/login.jpg"
              alt="Fitness equipment"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    );
  }

  if (showSurvey) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto flex">
          {/* Left side - Content */}
          <div className="flex-1 p-8">
            {/* Yellow notification bar */}
            <div className="bg-[#FFF1C2] text-black px-4 py-3 rounded-lg mb-6 text-sm font-medium">
              Jums dar liko 15 dienų iki prenumeratos pabaigos
            </div>

            <div className="mb-6">
              {/* Back button and title */}
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setShowSurvey(false)}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-[48px] font-bold text-[#101827] font-['mango'] leading-tight">
                  Kodėl nori atšaukti narystę?
                </h2>
              </div>

              {/* Survey options */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="time"
                    name="cancellation_reason"
                    value="Neturiu laiko naudotis"
                    checked={selectedReason === "Neturiu laiko naudotis"}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-5 h-5 text-[#60988E] border-gray-300 focus:ring-[#60988E] mr-4"
                  />
                  <label htmlFor="time" className="text-lg cursor-pointer">
                    Neturiu laiko naudotis
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="expensive"
                    name="cancellation_reason"
                    value="Kaina per brangi"
                    checked={selectedReason === "Kaina per brangi"}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-5 h-5 text-[#60988E] border-gray-300 focus:ring-[#60988E] mr-4"
                  />
                  <label htmlFor="expensive" className="text-lg cursor-pointer">
                    Kaina per brangi
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="program"
                    name="cancellation_reason"
                    value="Radau kitą programą"
                    checked={selectedReason === "Radau kitą programą"}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-5 h-5 text-[#60988E] border-gray-300 focus:ring-[#60988E] mr-4"
                  />
                  <label htmlFor="program" className="text-lg cursor-pointer">
                    Radau kitą programą
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="other"
                    name="cancellation_reason"
                    value="Kita"
                    checked={selectedReason === "Kita"}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-5 h-5 text-[#60988E] border-gray-300 focus:ring-[#60988E] mr-4"
                  />
                  <label htmlFor="other" className="text-lg cursor-pointer">
                    Kita
                  </label>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-6 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Atšaukti
              </button>
              <button
                onClick={() => {
                  if (selectedReason === "Kita") {
                    setShowTextInput(true);
                  } else {
                    onCancel();
                    console.log('Cancellation reason:', selectedReason);
                  }
                }}
                disabled={!selectedReason}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  selectedReason
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedReason === "Kita" ? "Tęsti nutraukimą" : "Pilnai nutraukti"}
              </button>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="w-1/2 bg-gray-100 rounded-r-lg overflow-hidden relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 text-xl shadow-md"
            >
              ×
            </button>
            <img
              src="/images/auth/login.jpg"
              alt="Fitness equipment"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto flex">
        {/* Left side - Content */}
        <div className="flex-1 p-8">
          {/* Yellow notification bar */}
          <div className="bg-[#FFF1C2] text-black px-4 py-3 rounded-lg mb-6 text-sm font-medium">
            Jums dar liko 15 dienų iki prenumeratos pabaigos
          </div>

          <div className="mb-6">
            <h2 className="text-[48px] font-bold text-[#101827] mb-4 font-['mango'] leading-tight">
              A tikrai norite nutraukti?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Prarasite prieigą prie visų lazyfit funkcijų
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="mr-4 flex-shrink-0 mt-1">
                  <CrownIcon width={32} height={32} />
                </div>
                <div>
                  <span className="font-semibold">Prieigą prie </span>
                  <span className="font-bold">+1000 treniruočių ir receptų</span>
                  <span>, įtrauktų į Lazyfit platformą</span>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-4 flex-shrink-0 mt-1">
                  <CrownIcon width={32} height={32} />
                </div>
                <div>
                  <span className="font-semibold">Prieigą prie </span>
                  <span className="font-bold">+50 mokymų</span>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-4 flex-shrink-0 mt-1">
                  <CrownIcon width={32} height={32} />
                </div>
                <div>
                  <span className="font-semibold">Prieigą prie </span>
                  <span className="font-bold">nemokamų mitybos planų</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Atšaukti
            </button>
            <button
              onClick={() => setShowSurvey(true)}
              className="flex-1 py-3 px-6 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Tęsti nutraukimą
            </button>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="w-1/2 bg-gray-100 rounded-r-lg overflow-hidden relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 text-xl shadow-md"
          >
            ×
          </button>
          <img
            src="/images/auth/login.jpg"
            alt="Fitness equipment"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}