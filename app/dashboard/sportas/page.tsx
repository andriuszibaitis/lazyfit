import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth-options";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import TrainingCard from "../components/training-card";
import PageTitleBar from "../components/page-title-bar";
import prisma from "@/lib/prisma";
import crypto from "crypto";

function authenticateBunnyThumbnail(videoUrl: string | null): string {
  if (!videoUrl || !process.env.BUNNY_STREAM_TOKEN) {
    return "/placeholder.svg?height=300&width=400";
  }

  try {
    let videoId = "";

    if (videoUrl.includes("iframe.mediadelivery.net/play/")) {
      const parts = videoUrl.split("/play/")[1].split("/");
      if (parts.length >= 2) {
        videoId = parts[1].split("?")[0];
      }
    } else if (videoUrl.includes("iframe.mediadelivery.net/embed/")) {
      const parts = videoUrl.split("/embed/")[1].split("/");
      if (parts.length >= 2) {
        videoId = parts[1].split("?")[0];
      }
    } else if (videoUrl.includes("b-cdn.net")) {
      const urlPath = videoUrl.split("?")[0];
      const pathParts = urlPath.split("/");
      videoId = pathParts[pathParts.length - 1].split(".")[0];
    }

    if (!videoId) {
      return "/placeholder.svg?height=300&width=400";
    }

    const tokenSecurityKey = process.env.BUNNY_STREAM_TOKEN;
    const expirationTime = Math.floor(Date.now() / 1000) + 3600;

    const tokenData = `${tokenSecurityKey}${videoId}${expirationTime}`;
    const token = crypto.createHash("sha256").update(tokenData).digest("hex");

    const cdnDomain = "vz-01a4b1c4-97f.b-cdn.net";

    const randomSuffix = Math.random().toString(16).substring(2, 10);

    const thumbnailUrl = `https://${cdnDomain}/bcdn_token=${token}&expires=${expirationTime}&token_path=%2F${videoId}%2F/${videoId}/thumbnail_${randomSuffix}.jpg`;

    return thumbnailUrl;
  } catch (error) {
    return "/placeholder.svg?height=300&width=400";
  }
}

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
    take: 8,
    orderBy: { createdAt: "desc" },
  });


  const trainings = workouts.map((workout) => {
    return {
      id: workout.id,
      title: workout.name,
      image: workout.imageUrl || authenticateBunnyThumbnail(workout.videoUrl),
      duration: workout.duration || 15,
      level: workout.difficulty || "Pradedantiesiems",
      isFavorite: false,
      membershipId: workout.membershipId,
      membershipName: workout.membership?.name,
    };
  });

  return (
    <>
      <PageTitleBar title="Sportas" />

      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="treneruotes" className="mb-8">
            <TabsList className="border-b border-[#e6e6e6] w-full justify-start bg-transparent p-0 h-auto">
              <TabsTrigger
                value="treneruotes"
                className="px-6 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#101827] data-[state=active]:shadow-none data-[state=active]:bg-transparent text-[#101827] font-medium"
              >
                Treneruotės
              </TabsTrigger>
              <TabsTrigger
                value="sporto-issukiai"
                className="px-6 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#101827] data-[state=active]:shadow-none data-[state=active]:bg-transparent text-[#101827] font-medium"
              >
                Sporto iššūkiai
              </TabsTrigger>
              <TabsTrigger
                value="sporto-programos"
                className="px-6 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#101827] data-[state=active]:shadow-none data-[state=active]:bg-transparent text-[#101827] font-medium"
              >
                Sporto programos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="treneruotes" className="mt-6">
              <div className="flex justify-between items-center mb-8">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-white"
                >
                  <Filter size={18} />
                  Filtras
                </Button>
                <div className="relative">
                  <select className="appearance-none bg-white border border-[#e6e6e6] rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#60988e]">
                    <option>Visos kategorijos</option>
                    <option>Nugara</option>
                    <option>Presas</option>
                    <option>Kojos</option>
                    <option>Rankos</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-[40px] font-[mango] text-[#101827]">
                    Naujausios treniruotės
                  </h2>
                  <Button variant="outline" className="bg-white">
                    Daugiau
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {trainings.length > 0 ? (
                    trainings.map((training) => (
                      <TrainingCard key={training.id} training={training} />
                    ))
                  ) : (
                    <div className="col-span-4 text-center py-8">
                      <p className="text-muted-foreground">
                        Nėra prieinamų treniruočių
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Patikrinkite, ar turite aktyvią narystę arba ar yra
                        sukurtų treniruočių.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <MuscleGroupSection
                muscleGroup="Presas"
                trainings={trainings.filter(
                  (t) =>
                    t.title.toLowerCase().includes("pres") ||
                    t.title.toLowerCase().includes("abs") ||
                    t.title.toLowerCase().includes("core")
                )}
              />

              <MuscleGroupSection
                muscleGroup="Nugara"
                trainings={trainings.filter(
                  (t) =>
                    t.title.toLowerCase().includes("nugar") ||
                    t.title.toLowerCase().includes("back")
                )}
              />
            </TabsContent>

            <TabsContent value="sporto-issukiai">
              <div className="p-8 text-center">
                <h3 className="text-xl font-medium">
                  Sporto iššūkiai bus prieinami netrukus
                </h3>
              </div>
            </TabsContent>

            <TabsContent value="sporto-programos">
              <div className="p-8 text-center">
                <h3 className="text-xl font-medium">
                  Sporto programos bus prieinamos netrukus
                </h3>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

function MuscleGroupSection({
  muscleGroup,
  trainings,
}: {
  muscleGroup: string;
  trainings: any[];
}) {
  if (trainings.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#101827]">{muscleGroup}</h2>
        <Button variant="outline" className="bg-white">
          Daugiau
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {trainings.map((training) => (
          <TrainingCard key={training.id} training={training} />
        ))}
      </div>
    </div>
  );
}
