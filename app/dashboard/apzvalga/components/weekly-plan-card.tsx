"use client";

import Link from "next/link";

interface WeeklyPlanCardProps {
  planName?: string | null;
  daysCompleted?: number;
  totalDays?: number;
  activeChallenges?: number;
  hasActivePlan?: boolean;
}

export default function WeeklyPlanCard({
  planName = null,
  daysCompleted = 0,
  totalDays = 30,
  activeChallenges = 0,
  hasActivePlan = false,
}: WeeklyPlanCardProps) {
  const progress = totalDays > 0 ? Math.round((daysCompleted / totalDays) * 100) : 0;

  // Empty state - no active plan
  if (!hasActivePlan || !planName) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#E6E6E6] h-full flex flex-col">
        <h3
          className="text-[30px] font-semibold text-[#101827] mb-4"
          style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
        >
          Pasirink savo treniruočių planą
        </h3>

        <div className="flex-1 flex items-center justify-center border border-dashed border-[#E6E6E6] rounded-xl mb-4">
          <p
            className="text-[14px] text-[#555B65] text-center px-4"
            style={{ fontFamily: "Outfit, sans-serif", lineHeight: "140%" }}
          >
            Dar neturi aktyvaus plano. Išsirink sau tinkamiausią ir pradėk kelionę siekti savo tikslų!
          </p>
        </div>

        <Link
          href="/dashboard/mano-rutina/sporto-programos"
          className="block w-full h-12 leading-[48px] bg-[#60988E] text-white text-[14px] font-medium rounded-lg hover:bg-[#4d7a72] transition-colors text-center mt-auto"
        >
          Peržiūrėti visus planus
        </Link>
      </div>
    );
  }

  // Active plan state
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E6E6E6]">
      <h3
        className="text-[30px] font-semibold text-[#101827] mb-4"
        style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
      >
        Tavo planas šią savaitę
      </h3>

      <p className="text-[14px] text-[#101827] mb-3">{planName}</p>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="h-2 bg-[#E6E6E6] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#60988E] rounded-full transition-all duration-300"
            style={{ width: `${Math.max(progress, 5)}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between text-[13px] mb-4">
        <span className="text-[#555B65]">
          Diena {daysCompleted}/{totalDays}
        </span>
        <span className="text-[#101827] font-medium">{progress}%</span>
      </div>

      <Link
        href="/dashboard/mano-rutina/sporto-programos"
        className="block w-full h-12 leading-[48px] bg-[#60988E] text-white text-[14px] font-medium rounded-lg hover:bg-[#4d7a72] transition-colors text-center"
      >
        Pradėti treniruotę
      </Link>

      {activeChallenges > 0 && (
        <div className="mt-4">
          <span className="text-[14px] text-[#101827] font-semibold">
            + {activeChallenges} AKTYVUS IŠŠŪKIS
          </span>
        </div>
      )}
    </div>
  );
}
