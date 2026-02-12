"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import AchievementForm from "../../components/achievement-form";

interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  iconUrl: string | null;
  iconSvg: string | null;
  trigger: string | null;
  triggerValue: number | null;
  order: number;
  isActive: boolean;
}

export default function EditAchievementPage() {
  const router = useRouter();
  const params = useParams();
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        const response = await fetch(`/api/admin/achievements/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch achievement");
        }
        const data = await response.json();
        setAchievement(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nepavyko gauti pasiekimo");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchAchievement();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#60988E]" />
      </div>
    );
  }

  if (error || !achievement) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error || "Pasiekimas nerastas"}</p>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/turinys/pasiekimai")}
        >
          Grįžti į sąrašą
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/turinys/pasiekimai")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Redaguoti pasiekimą</h1>
          <p className="text-gray-500">{achievement.title}</p>
        </div>
      </div>

      <AchievementForm initialData={achievement} isEditing />
    </div>
  );
}
