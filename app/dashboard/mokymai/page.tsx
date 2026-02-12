import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth-options";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import MokymaiPageClient from "./mokymai-page-client";

export default async function MokymaiPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/prisijungti?callbackUrl=/dashboard/mokymai");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      gender: true,
      planId: true,
    },
  });

  // Fetch published courses
  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
    },
    include: {
      lessons: {
        select: {
          id: true,
          duration: true,
        },
      },
    },
    orderBy: { order: "asc" },
  });

  const formattedCourses = courses.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    imageUrl: course.imageUrl,
    gender: course.gender,
    difficulty: course.difficulty,
    lessonCount: course.lessons.length,
    totalDuration: course.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0),
  }));

  return <MokymaiPageClient courses={formattedCourses} userGender={user?.gender || null} />;
}
