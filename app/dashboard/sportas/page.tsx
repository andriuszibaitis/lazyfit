import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth-options";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getServerThumbnail } from "@/lib/bunny";
import SportsTabs from "./sports-tabs";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/prisijungti?callbackUrl=/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { membership: true },
  });

  const userMembershipId = user?.membership?.id || null;


  const workouts = await prisma.workout.findMany({
    where: {
      AND: [
        {
          OR: [
            { membershipId: userMembershipId },
            { membershipId: null },
            { membershipId: "" },
          ],
        },
        { isPublished: true },
        { isCopy: false },
      ],
    },
    include: {
      membership: true,
    },
    orderBy: { createdAt: "desc" },
  });


  const trainings = workouts.map((workout) => {
    return {
      id: workout.id,
      title: workout.name,
      image: workout.imageUrl || getServerThumbnail(workout.videoUrl),
      duration: workout.duration || 15,
      level: workout.difficulty || "Pradedantiesiems",
      isFavorite: false,
      membershipId: workout.membershipId,
      membershipName: workout.membership?.name,
      createdAt: workout.createdAt.toISOString(),
    };
  });

  return <SportsTabs trainings={trainings} />;
}
