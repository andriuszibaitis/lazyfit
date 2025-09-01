import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth-options";
import NutritionPlanForm from "../components/nutrition-plan-form";

export const metadata: Metadata = {
  title: "Naujas mitybos planas - Administracija",
  description: "Sukurti naują mitybos planą",
};

export default async function NewNutritionPlanPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/auth/prisijungti");
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Naujas mitybos planas</h1>
      <NutritionPlanForm />
    </div>
  );
}
