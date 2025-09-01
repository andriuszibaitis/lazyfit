"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { Heart, Clock } from "lucide-react";
import Link from "next/link";

interface TrainingCardProps {
  training: {
    id: string;
    title: string;
    image: string;
    duration: number;
    level: string;
    isFavorite: boolean;
    videoUrl: string;
  };
}

export default function TrainingCard({ training }: TrainingCardProps) {
  const [isFavorite, setIsFavorite] = useState(training.isFavorite);
  const [imageError, setImageError] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  console.log(training);
  return (
    <Link href={`/dashboard/training/${training.id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
        <div className="relative">
          <Image
            src={
              imageError
                ? "/placeholder.svg?height=300&width=400"
                : training.image
            }
            alt={training.title}
            width={400}
            height={300}
            className="w-full h-48 object-cover"
            onError={() => {
              console.log(`Image failed to load: ${training.image}`);
              setImageError(true);
            }}
          />
          <button
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
