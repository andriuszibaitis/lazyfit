import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import MealTrackingContent from "./meal-tracking-content";

export default async function MealTrackingPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/prisijungti?callbackUrl=/dashboard/mano-rutina/mityba");
  }

  const { planId } = await params;

  // Fetch the user's nutrition plan
  const plan = await prisma.userNutritionPlan.findFirst({
    where: {
      id: planId,
      userId: session.user.id,
    },
  });

  if (!plan) {
    redirect("/dashboard/mano-rutina/mityba");
  }

  // Get user's weight for macro calculations (g/kg)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true },
  });

  return <MealTrackingContent plan={plan} userWeight={plan.weight} />;
}
