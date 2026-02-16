import PageTitleBar from "../components/page-title-bar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import {
  BookOpen,
  Clock,
  Calendar,
  Play,
  Video,
  Users,
} from "lucide-react";
import Link from "next/link";

async function getCourses(membershipId: string | null) {
  try {
    const courses = await prisma.course.findMany({
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
        lessons: {
          where: { isPublished: true },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });
    return courses;
  } catch {
    return [];
  }
}

// Fake upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: "Gyvo sporto sesija: HIIT treniruotė",
    date: "2026-02-20",
    time: "18:00",
    type: "video",
    instructor: "Tomas",
  },
  {
    id: 2,
    title: "Meditacijos vakaras",
    date: "2026-02-22",
    time: "20:00",
    type: "video",
    instructor: "Laura",
  },
  {
    id: 3,
    title: "Q&A: Mityba ir sportas",
    date: "2026-02-25",
    time: "19:00",
    type: "video",
    instructor: "Airidas",
  },
];

export default async function ManoMokymaiPage() {
  const session = await getServerSession(authOptions);
  const courses = await getCourses(session?.user?.membershipId || null);

  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);
  const totalDuration = courses.reduce(
    (sum, c) =>
      sum + c.lessons.reduce((lSum, l) => lSum + (l.duration || 0), 0),
    0
  );

  return (
    <>
      <PageTitleBar title="Mano mokymai" />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 flex items-center gap-3">
              <div className="bg-[#60988E]/10 p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-[#60988E]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Kursai</p>
                <p className="text-xl font-bold">{courses.length}</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Play className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pamokos</p>
                <p className="text-xl font-bold">{totalLessons}</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-3">
              <div className="bg-purple-50 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Trukmė</p>
                <p className="text-xl font-bold">{totalDuration} min</p>
              </div>
            </Card>
          </div>

          {/* Courses */}
          <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
            <h2
              className="text-[36px] font-semibold text-[#101827] mb-4"
              style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
            >
              Mano kursai
            </h2>

            {courses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  Šiuo metu nėra prieinamų kursų.
                </p>
                <Link href="/dashboard/mokymai">
                  <Button variant="outline">Peržiūrėti kursus</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((course) => {
                  const lessonCount = course.lessons.length;
                  const duration = course.lessons.reduce(
                    (sum, l) => sum + (l.duration || 0),
                    0
                  );

                  return (
                    <Link
                      key={course.id}
                      href={`/dashboard/mokymai/${course.id}`}
                    >
                      <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer h-full">
                        <div className="flex items-start gap-4">
                          <div className="bg-[#60988E]/10 p-3 rounded-lg shrink-0">
                            <BookOpen className="h-6 w-6 text-[#60988E]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-base mb-1">
                              {course.title}
                            </h3>
                            {course.description && (
                              <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                {course.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Play className="h-3 w-3" />
                                {lessonCount} pamokų
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {duration} min
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming events */}
          <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
            <h2
              className="text-[28px] font-semibold text-[#101827] mb-4"
              style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
            >
              Artėjantys renginiai
            </h2>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-2 rounded-lg shrink-0">
                      <Video className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{event.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(event.date).toLocaleDateString("lt-LT")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.instructor}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0 text-xs"
                    >
                      Priminti
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
