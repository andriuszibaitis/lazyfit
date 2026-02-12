"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ClockIcon,
  HeartIcon,
  DifficultyLevel1Icon,
  DifficultyLevel2Icon,
  DifficultyLevel3Icon,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge-custom";
import { Video } from "lucide-react";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    gender: string;
    difficulty: string;
    lessonCount: number;
    totalDuration: number;
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case "female":
        return "Moterims";
      case "male":
        return "Vyrams";
      default:
        return null;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "Pradedantiesiems";
      case "intermediate":
        return "Pažengusiems";
      case "advanced":
        return "Profesionalams";
      default:
        return "Pradedantiesiems";
    }
  };

  const DifficultyIcon = ({ difficulty }: { difficulty: string }) => {
    switch (difficulty) {
      case "beginner":
        return <DifficultyLevel1Icon size={16} className="text-[#9FA4B0]" />;
      case "intermediate":
        return <DifficultyLevel2Icon size={16} className="text-[#9FA4B0]" />;
      case "advanced":
        return <DifficultyLevel3Icon size={16} className="text-[#9FA4B0]" />;
      default:
        return <DifficultyLevel1Icon size={16} className="text-[#9FA4B0]" />;
    }
  };

  const genderLabel = getGenderLabel(course.gender);

  return (
    <Link href={`/dashboard/mokymai/${course.id}`}>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col p-3">
        <div className="relative">
          <Image
            src={
              imageError || !course.imageUrl
                ? "/placeholder.svg?height=300&width=400"
                : course.imageUrl
            }
            alt={course.title}
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
          {genderLabel && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="light">{genderLabel}</Badge>
            </div>
          )}
        </div>
        <div className="px-1 pt-3 pb-1 flex-1 flex flex-col">
          <h3 className="font-semibold text-[#101827] text-lg mb-2 line-clamp-2 font-[Outfit]">
            {course.title}
          </h3>
          {course.description && (
            <p className="text-[#6B7280] text-sm mb-4 line-clamp-3 flex-1 font-[Outfit]">
              {course.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-[#9FA4B0] text-sm mt-auto pt-2 font-[Outfit]">
            <div className="flex items-center gap-1.5">
              <Video size={18} className="text-[#CCCED3]" />
              <span>{course.lessonCount} pamokų</span>
            </div>
            {course.totalDuration > 0 && (
              <div className="flex items-center gap-1.5">
                <ClockIcon size={20} className="text-[#CCCED3]" />
                <span>{course.totalDuration} min</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <DifficultyIcon difficulty={course.difficulty} />
              <span>{getDifficultyLabel(course.difficulty)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
