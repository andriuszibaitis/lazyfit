import { Suspense } from "react";
import FoodProductsList from "./components/food-product-list";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";
import { Apple } from "lucide-react";

export const metadata: Metadata = {
  title: "Maisto produktai | Administravimas",
  description: "Maisto produktų valdymas",
};

export const dynamic = "force-dynamic";

export default function FoodProductsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Maisto produktai
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Valdykite maisto produktus, jų maistinę vertę ir kategorijas
          </p>
        </div>
        <div className="bg-gray-100 p-3 rounded-full shrink-0">
          <Apple className="h-6 w-6 md:h-8 md:w-8 text-[#60988E]" />
        </div>
      </div>

      <Card className="p-4 md:p-6 shadow-sm">
        <Suspense
          fallback={<div className="py-8 text-center">Kraunama...</div>}
        >
          <FoodProductsList />
        </Suspense>
      </Card>
    </div>
  );
}
