"use client";

import { Button } from "@/components/ui/button";
import { Plus, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import RecipesList from "./components/recipes-list";

export default function RecipesPage() {
  const router = useRouter();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Receptai</h1>
          <p className="text-gray-500">Valdykite receptus ir jų kategorijas</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/turinys/receptai/kategorijos")}
          >
            <Tag className="h-4 w-4 mr-2" />
            Kategorijos
          </Button>
          <Button
            onClick={() => router.push("/admin/turinys/receptai/new")}
            className="bg-[#60988E] hover:bg-[#4e7d75]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Naujas receptas
          </Button>
        </div>
      </div>

      <RecipesList />
    </div>
  );
}
