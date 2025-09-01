import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import { redirect } from "next/navigation";
import PageTitleBar from "../../../components/page-title-bar";
import NutritionPlanForm from "../../components/nutrition-plan-form";
import prisma from "@/lib/prisma";

export default async function EditNutritionPlanPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(
      "/auth/prisijungti?callbackUrl=/dashboard/mano-mityba/redaguoti/" +
        params.id
    );
  }

  const nutritionPlan = await prisma.nutritionPlan.findUnique({
    where: {
      id: params.id,
      createdBy: session.user.id,
    },
    include: {
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
    redirect("/dashboard/mano-mityba");
  }

  const foodProducts = await prisma.foodProduct.findMany({
    where: {
      OR: [{ isActive: true, userId: null }, { userId: session.user.id }],
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <>
      <PageTitleBar title="Redaguoti mitybos planą" />
      <div className="flex-1 p-6">
        <div className="mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Redaguoti mitybos planą</h1>
            <p className="text-gray-600">
              Atnaujinkite savo mitybos planą pagal poreikius
            </p>
          </div>

          <NutritionPlanForm
            foodProducts={foodProducts}
            nutritionPlan={nutritionPlan}
            isEditing={true}
          />
        </div>
      </div>
    </>
  );
}
