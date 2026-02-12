import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth-options";
import CourseForm from "../components/CourseForm";

export const metadata: Metadata = {
  title: "Naujas kursas - Administracija",
  description: "Sukurti naują kursą",
};

export default async function NewCoursePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/auth/prisijungti");
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Naujas kursas</h1>
      <CourseForm />
    </div>
  );
}
