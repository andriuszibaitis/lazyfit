"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { Heart, Clock, BarChart2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface TrainingCardProps {
  training: {
    id: string;
    title: string;
    image: string;
    duration: number;
    level: string;
    isFavorite: boolean;
    videoUrl: string;
    muscleGroups?: string[];
  };
  variant?: "card" | "list";
}

function formatDuration(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}`;
  return `${m}:00`;
}

export default function TrainingCard({
  training,
  variant = "card",
}: TrainingCardProps) {
  const [isFavorite, setIsFavorite] = useState(training.isFavorite);
  const [imageError, setImageError] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isFavorite;
    setIsFavorite(next);
    if (next) {
      const group = training.muscleGroups?.[0];
      toast.custom(
        () => (
          <div className="flex items-center gap-3 bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-3 w-[90vw] max-w-md mx-auto">
            <Heart className="h-5 w-5 fill-red-500 text-red-500 shrink-0" />
            <p className="text-sm text-[#101827]">
              Treneruotę išsaugota
              {group && (
                <>
                  {" į "}
                  <span className="text-[#34786C] font-medium">{group}</span>
                </>
              )}
            </p>
          </div>
        ),
        { duration: 2500 }
      );
    }
  };

  const imgSrc = imageError
    ? "/placeholder.svg?height=300&width=400"
    : training.image;

  if (variant === "list") {
    return (
      <Link href={`/dashboard/training/${training.id}`}>
        <div className="relative flex gap-3 bg-white rounded-xl overflow-hidden hover:bg-gray-50 transition-colors">
          <div className="relative shrink-0 w-[140px] h-[90px] rounded-lg overflow-hidden">
            <Image
              src={imgSrc}
              alt={training.title}
              fill
              sizes="140px"
              className="object-cover"
              onError={() => setImageError(true)}
            />
            <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[11px] font-medium px-1.5 py-0.5 rounded">
              {formatDuration(training.duration)}
            </span>
          </div>
          <div className="flex-1 min-w-0 py-1 pr-10">
            <h3 className="font-semibold text-[#101827] text-[15px] leading-snug line-clamp-2">
              {training.title}
            </h3>
            <div className="mt-2 flex items-center text-[#9FA4B0] text-xs gap-1.5">
              <BarChart2 size={14} />
              <span>{training.level}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleFavorite}
            className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={
              isFavorite ? "Pašalinti iš mėgstamų" : "Pridėti į mėgstamus"
            }
          >
            <Heart
              size={18}
              className={
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-400"
              }
            />
          </button>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/dashboard/training/${training.id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
        <div className="relative">
          <Image
            src={imgSrc}
            alt={training.title}
            width={400}
            height={300}
            className="w-full h-48 object-cover"
            onError={() => setImageError(true)}
          />
          <button
            type="button"
            onClick={toggleFavorite}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md"
            aria-label={
              isFavorite ? "Pašalinti iš mėgstamų" : "Pridėti į mėgstamus"
            }
          >
            <Heart
              size={20}
              className={`${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-medium text-[#101827] mb-2">{training.title}</h3>
          <div className="mt-auto flex items-center text-[#555b65] text-sm">
            <Clock size={16} className="mr-1" />
            <span>{training.duration} min</span>
            <span className="mx-2">•</span>
            <span>{training.level}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
