"use client";

import { useState, useEffect } from "react";

interface MembershipUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMembership?: any;
  availableMemberships?: any[];
}

export default function MembershipUpgradeModal({
  isOpen,
  onClose,
  currentMembership,
  availableMemberships = []
}: MembershipUpgradeModalProps) {
  const [selectedMembership, setSelectedMembership] = useState<any>(null);

  useEffect(() => {
    // Pre-select the first available upgrade option
    if (availableMemberships.length > 0) {
      // Find a membership that's longer than current one
      const upgrade = availableMemberships.find(m =>
        m.planId !== currentMembership?.planId && m.duration > (currentMembership?.duration || 0)
      );
      setSelectedMembership(upgrade || availableMemberships[0]);
    }
  }, [availableMemberships, currentMembership]);

  if (!isOpen) return null;

  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === "number" ? price : Number.parseFloat(String(price));
    if (isNaN(numPrice)) {
      return "0,00 €";
    }
    return numPrice.toFixed(2).replace(".", ",") + " €";
  };

  const calculateTotalPrice = (price: number | string, days: number): number => {
    const numPrice = typeof price === "number" ? price : Number.parseFloat(String(price));
    const months = days / 30;
    return numPrice * months;
  };

  const calculateDiscountedPrice = (price: number | string, discountPercentage: number): number => {
    const numPrice = typeof price === "number" ? price : Number.parseFloat(String(price));
    return numPrice * (1 - discountPercentage / 100);
  };

  const formatDuration = (days: number): string => {
    if (days % 30 === 0) {
      const months = days / 30;
      return `${months} mėn.`;
    }
    return `${days} dienų`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto flex">
        {/* Left side - Content */}
        <div className="flex-1 p-8">
          <div className="mb-6">
            <h2 className="text-[48px] font-bold text-[#101827] mb-2 font-['mango']">
              Pereik į kitas narystes ir sutaupyk!
            </h2>
            <div className="space-y-2">
              <div className="flex items-center text-gray-700">
                <svg className="w-5 h-5 text-black mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Sutaupyk iki 30% - tai daugiau nei vienas mėnuo nemokamai
              </div>
              <div className="flex items-center text-gray-700">
                <svg className="w-5 h-5 text-black mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Jūs nebūsite apmokestinti iki kitos atsiskaitymo datos
              </div>
            </div>
          </div>

          {/* Membership options */}
          <div className="space-y-4 mb-8">
            {availableMemberships
              .sort((a, b) => b.duration - a.duration) // Sort by duration descending (longest first)
              .map((membership) => {
              const totalPrice = calculateTotalPrice(membership.price, membership.duration);
              const discountedPrice = calculateDiscountedPrice(totalPrice, membership.discountPercentage || 0);
              const isCurrentPlan = membership.planId === currentMembership?.planId;
              const isSelected = selectedMembership?.planId === membership.planId;

              return (
                <div
                  key={membership.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    isCurrentPlan
                      ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                      : isSelected
                        ? 'border-[#60988E] bg-[#60988E]/5'
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => !isCurrentPlan && setSelectedMembership(membership)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                        isCurrentPlan
                          ? 'border-gray-300'
                          : isSelected
                            ? 'border-[#60988E] bg-[#60988E]'
                            : 'border-gray-300'
                      }`}>
                        {isSelected && !isCurrentPlan && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <div>
                          <h3 className="font-semibold text-2xl font-['mango']">
                            {membership.name}
                          </h3>
                          <p className="text-sm text-gray-600">{formatDuration(membership.duration)} narystė</p>
                        </div>
                        {membership.discountPercentage > 0 && (
                          <div className="ml-3 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                            sutaupyk {membership.discountPercentage}%
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">
                        {membership.discountPercentage > 0 ? (
                          <>
                            <span className="line-through text-gray-500 text-sm mr-2">
                              {formatPrice(totalPrice)}
                            </span>
                            {formatPrice(discountedPrice)}
                          </>
                        ) : (
                          formatPrice(totalPrice)
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        ({formatPrice(membership.price)}/mėn)
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="space-y-4">
            <button
              disabled={!selectedMembership || selectedMembership.planId === currentMembership?.planId}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                selectedMembership && selectedMembership.planId !== currentMembership?.planId
                  ? 'bg-[#60988E] text-white hover:bg-[#4a7168]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Keisti narystę
            </button>
            <div className="text-center text-sm text-gray-600">
              Užsiprenumeruota su Mastercard • 4214
            </div>
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
