"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ClockIcon,
  DifficultyLevel1Icon,
  DifficultyLevel2Icon,
  DifficultyLevel3Icon,
  AppleIcon,
  HeartIcon,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge-custom";

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    description: string | null;
    image: string;
    preparationTime: number;
    cookingTime: number;
    servings: number;
    difficulty: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    category: string | null;
  };
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const totalTime = recipe.preparationTime + recipe.cookingTime;

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Lengvas";
      case "medium":
        return "Vidutinis";
      case "hard":
        return "Sudėtingas";
      default:
        return difficulty;
    }
  };

  const DifficultyIcon = ({ difficulty }: { difficulty: string }) => {
    switch (difficulty) {
      case "easy":
        return <DifficultyLevel1Icon size={16} className="text-[#9FA4B0]" />;
      case "medium":
        return <DifficultyLevel2Icon size={16} className="text-[#9FA4B0]" />;
      case "hard":
        return <DifficultyLevel3Icon size={16} className="text-[#9FA4B0]" />;
      default:
        return <DifficultyLevel1Icon size={16} className="text-[#9FA4B0]" />;
    }
  };

  return (
    <Link href={`/dashboard/mityba/receptas/${recipe.id}`}>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col p-3">
        <div className="relative">
          <Image
            src={
              imageError
                ? "/placeholder.svg?height=300&width=400"
                : recipe.image
            }
            alt={recipe.title}
            width={400}
            height={300}
            className="w-full h-52 object-cover rounded-xl"
            onError={() => setImageError(true)}
          />
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 rounded-full p-2 shadow-md transition-colors bg-white"
            aria-label={
              isFavorite ? "Pašalinti iš mėgstamų" : "Pridėti į mėgstamus"
            }
          >
            <HeartIcon
              size={13}
              className={isFavorite ? "text-red-500" : "text-[#9FA4B0]"}
            />
          </button>
          {recipe.category && (
            <div className="absolute bottom-3 left-3">
              <Badge
                variant="light"
                icon={
                  recipe.category.toLowerCase().includes("vegetar") ? (
                    <AppleIcon size={14} />
                  ) : undefined
                }
              >
                {recipe.category}
              </Badge>
            </div>
          )}
        </div>
        <div className="px-1 pt-3 pb-1 flex-1 flex flex-col">
          <h3 className="font-semibold text-[#101827] text-lg mb-2 line-clamp-2 font-[Outfit]">
            {recipe.title}
          </h3>
          {recipe.description && (
            <p className="text-[#6B7280] text-sm mb-4 line-clamp-3 flex-1 font-[Outfit]">
              {recipe.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-[#9FA4B0] text-sm mt-auto pt-2 font-[Outfit]">
            <div className="flex items-center gap-1.5">
              <ClockIcon size={20} className="text-[#CCCED3]" />
              <span>{totalTime} min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DifficultyIcon difficulty={recipe.difficulty} />
              <span>{getDifficultyLabel(recipe.difficulty)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
