import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth-options";
import CoursesPageClient from "./components/CoursesPageClient";

export const metadata: Metadata = {
  title: "Mokymai - Administracija",
  description: "Mokymų turinio valdymas",
};

export default async function CoursesPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/auth/prisijungti");
  }

  return <CoursesPageClient />;
}
