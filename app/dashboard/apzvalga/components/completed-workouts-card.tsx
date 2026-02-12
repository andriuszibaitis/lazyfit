"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface CompletedWorkoutsCardProps {
  completedCount?: number;
  weekDays?: { day: string; completed: boolean }[];
  activeChallenges?: number;
}

export default function CompletedWorkoutsCard({
  completedCount = 0,
  weekDays = [
    { day: "P", completed: false },
    { day: "A", completed: false },
    { day: "T", completed: false },
    { day: "K", completed: false },
    { day: "P", completed: false },
    { day: "Š", completed: false },
    { day: "S", completed: false },
  ],
  activeChallenges = 0,
}: CompletedWorkoutsCardProps) {
  return (
    <div className="bg-[#60988E] rounded-2xl p-6 h-full flex flex-col">
      <h3
        className="text-[30px] font-semibold text-[#F7F7F7] mb-2"
        style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
      >
        Atliktos treniruotės
      </h3>

      <div className="flex items-end gap-4 mb-4">
        <span
          className="text-[80px] font-bold text-white uppercase"
          style={{ fontFamily: "mango, sans-serif", lineHeight: "80%", letterSpacing: "-0.01em" }}
        >
          {completedCount}
        </span>

        <div className="flex flex-1 justify-between mb-3">
          {weekDays.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div
                className={`w-[13px] h-[13px] rounded-full ${
                  item.completed
                    ? "bg-[#FAC64B]"
                    : "border border-white/50 bg-transparent"
                }`}
              />
              <span className="text-[10px] text-white/70">{item.day}</span>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/dashboard/mano-rutina/sporto-programos"
        className="flex items-center justify-between text-sm text-white hover:text-white/80 transition-colors mt-auto"
      >
        <span>MANO TRENIRUOTĖS</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
