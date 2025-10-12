import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth-options";
import NutritionPlansPageClient from "./components/NutritionPlansPageClient";

export const metadata: Metadata = {
  title: "Mitybos planai - Administracija",
  description: "Mitybos planų valdymas",
};

export default async function NutritionPlansPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/auth/prisijungti");
  }

  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "";

  return <NutritionPlansPageClient query={query} />;
}
