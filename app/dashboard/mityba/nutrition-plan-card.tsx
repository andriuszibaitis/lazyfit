"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getNutritionPlanIcon } from "@/components/icons/nutrition-plan-icons";

interface NutritionPlanCardProps {
  plan: {
    id: string;
    name: string;
    description: string | null;
    benefits: string | null;
    icon: string | null;
    isPopular: boolean;
    image: string;
    daysCount: number;
    mealsPerDay: number;
    avgDailyCalories: number;
    avgDailyProtein: number;
    avgDailyCarbs: number;
    avgDailyFat: number;
    gender: string;
  };
  showPopularBadge?: boolean;
}

export default function NutritionPlanCard({ plan, showPopularBadge = true }: NutritionPlanCardProps) {
  const [imageError, setImageError] = useState(false);

  const IconComponent = getNutritionPlanIcon(plan.icon || "swimming");

  return (
    <Link href={`/dashboard/mityba/mitybos-planas/${plan.id}`}>
      <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col border border-gray-100">
        {/* Popular badge - overlay on entire card */}
        {showPopularBadge && plan.isPopular && (
          <div className="absolute -top-3 right-6 z-50">
            <span className="inline-flex items-center px-4 py-2 rounded-lg bg-[#FFB700] text-sm text-[#101827] font-medium shadow-sm">
              Populiariausias
            </span>
          </div>
        )}
        {/* Image section */}
        <div className="relative p-3 pb-0">
          <Image
            src={
              imageError
                ? "/placeholder.svg?height=300&width=400"
                : plan.image
            }
            alt={plan.name}
            width={400}
            height={220}
            className="w-full h-48 object-cover rounded-xl"
            onError={() => setImageError(true)}
          />
        </div>

        {/* Content section */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Icon and benefits row */}
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-[#ECFFDF] flex items-center justify-center text-brand-green-dark">
              <IconComponent size={20} />
            </div>
            {plan.benefits && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white border border-[#E6E6E6] text-[13px] text-[#101827] font-medium font-[Outfit]" style={{ lineHeight: "120%" }}>
                {plan.benefits}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className="text-[#101827] text-[28px] font-semibold mb-2 line-clamp-2"
            style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
          >
            {plan.name}
          </h3>

          {/* Description */}
          {plan.description && (
            <p className="text-[#6B7280] text-sm line-clamp-3 flex-1 font-[Outfit]">
              {plan.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
