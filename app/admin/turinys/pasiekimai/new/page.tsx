"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import AchievementForm from "../components/achievement-form";

export default function NewAchievementPage() {
  const router = useRouter();

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
          <h1 className="text-2xl font-bold">Naujas pasiekimas</h1>
          <p className="text-gray-500">Sukurkite naują pasiekimą</p>
        </div>
      </div>

      <AchievementForm />
    </div>
  );
}
