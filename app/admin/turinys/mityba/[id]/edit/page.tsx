import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth-options";
import NutritionPlanForm from "../../components/nutrition-plan-form";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Redaguoti mitybos planą - Administracija",
  description: "Redaguoti mitybos planą",
};

export default async function EditNutritionPlanPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/auth/prisijungti");
  }

  const nutritionPlan = await prisma.nutritionPlan.findUnique({
    where: {
      id: params.id,
    },
    include: {
      membership: true,
      days: {
        orderBy: {
          dayNumber: "asc",
        },
        include: {
          meals: {
            orderBy: {
              mealNumber: "asc",
            },
            include: {
              items: true,
            },
          },
        },
      },
    },
  });

  if (!nutritionPlan) {
    redirect("/admin/turinys/mityba");
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Redaguoti mitybos planą</h1>
      <NutritionPlanForm initialData={nutritionPlan} />
    </div>
  );
}
