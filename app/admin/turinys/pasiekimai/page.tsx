"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import AchievementsList from "./components/achievements-list";

export default function AchievementsPage() {
  const router = useRouter();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Pasiekimai</h1>
          <p className="text-gray-500">Valdykite pasiekimus ir jų tikslus</p>
        </div>
        <Button
          onClick={() => router.push("/admin/turinys/pasiekimai/new")}
          className="bg-[#60988E] hover:bg-[#4e7d75]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Naujas pasiekimas
        </Button>
      </div>

      <AchievementsList />
    </div>
  );
}
