"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { NutritionPlansList } from "./nutrition-plans-list";

export default function NutritionPlansPageClient({ query }: { query: string }) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mitybos planai</h1>
        <Link href="/admin/turinys/mityba/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Naujas mitybos planas
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Ieškoti pagal pavadinimą..."
          className="max-w-sm"
          defaultValue={query}
          onChange={(e) => {
            const newUrl = new URL(window.location.href);
            if (e.target.value) {
              newUrl.searchParams.set("q", e.target.value);
            } else {
              newUrl.searchParams.delete("q");
            }
            window.history.pushState({}, "", newUrl.toString());
          }}
        />
      </div>

      <NutritionPlansList query={query} />
    </div>
  );
}
