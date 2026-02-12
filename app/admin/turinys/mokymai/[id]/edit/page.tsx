import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";
import CourseForm from "../../components/CourseForm";

export const metadata: Metadata = {
  title: "Redaguoti kursą - Administracija",
  description: "Redaguoti kursą",
};

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/auth/prisijungti");
  }

  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      lessons: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Redaguoti kursą</h1>
      <CourseForm course={course} />
    </div>
  );
}
