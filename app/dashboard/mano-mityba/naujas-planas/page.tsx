import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import { redirect } from "next/navigation";
import PageTitleBar from "../../components/page-title-bar";
import NutritionPlanForm from "../components/nutrition-plan-form";
import prisma from "@/lib/prisma";

export default async function NaujasMitybosPlanasPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(
      "/auth/prisijungti?callbackUrl=/dashboard/mano-mityba/naujas-planas"
    );
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
      <PageTitleBar title="Naujas mitybos planas" />
      <div className="flex-1 p-6">
        <div className="mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">
              Susikurkite savo mitybos planą
            </h1>
            <p className="text-gray-600">
              Sukurkite savo asmeninį mitybos planą pagal savo poreikius
            </p>
          </div>

          <NutritionPlanForm foodProducts={foodProducts} />
        </div>
      </div>
    </>
  );
}
