import PageTitleBar from "../../components/page-title-bar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import { Clock, Target, Dumbbell, ChevronRight } from "lucide-react";
import Link from "next/link";

async function getPrograms(membershipId: string | null) {
  try {
    const programs = await prisma.trainingProgram.findMany({
      where: {
        isPublished: true,
        ...(membershipId
          ? {
              OR: [
                { membershipId: null },
                { membershipId },
              ],
            }
          : { membershipId: null }),
      },
      include: {
        programPeriods: true,
        _count: {
          select: { programWorkouts: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return programs;
  } catch {
    return [];
  }
}

const difficultyLabels: Record<string, { label: string; color: string }> = {
  easy: { label: "Pradedantiesiems", color: "bg-green-100 text-green-800" },
  medium: { label: "Vidutinis", color: "bg-yellow-100 text-yellow-800" },
  hard: { label: "Pažengusiems", color: "bg-red-100 text-red-800" },
  Pradedantiesiems: { label: "Pradedantiesiems", color: "bg-green-100 text-green-800" },
  Vidutinis: { label: "Vidutinis", color: "bg-yellow-100 text-yellow-800" },
  "Pažengusiems": { label: "Pažengusiems", color: "bg-red-100 text-red-800" },
};

export default async function ManoRutinaSportoProgramosPage() {
  const session = await getServerSession(authOptions);
  const programs = await getPrograms(session?.user?.membershipId || null);

  return (
    <>
      <PageTitleBar title="Mano rutina" />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
            <div className="mb-6">
              <h2
                className="text-[36px] font-semibold text-[#101827]"
                style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
              >
                Sporto programos
              </h2>
              <p className="text-[#6B7280] mt-2">
                Jūsų narystei prieinamos treniruočių programos
              </p>
            </div>

            {programs.length === 0 ? (
              <div className="text-center py-12">
                <Dumbbell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  Šiuo metu nėra prieinamų sporto programų.
                </p>
                <Link href="/dashboard/sportas">
                  <Button variant="outline">Peržiūrėti treniruotes</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {programs.map((program) => {
                  const diff = difficultyLabels[program.difficulty] || {
                    label: program.difficulty,
                    color: "bg-gray-100 text-gray-800",
                  };

                  return (
                    <Card
                      key={program.id}
                      className="p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="bg-[#60988E]/10 p-2 rounded-lg">
                          <Dumbbell className="h-6 w-6 text-[#60988E]" />
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${diff.color}`}
                        >
                          {diff.label}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2">
                        {program.name}
                      </h3>
                      {program.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {program.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        {program.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {program.duration} sav.
                          </span>
                        )}
                        {program.goal && (
                          <span className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            {program.goal}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">
                          {program._count.programWorkouts} treniruočių
                        </span>
                        <span className="text-[#60988E] flex items-center gap-1 font-medium">
                          Peržiūrėti
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
