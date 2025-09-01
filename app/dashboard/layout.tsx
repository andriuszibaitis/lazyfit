import type React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth-options";
import { redirect } from "next/navigation";
import SideNavigation from "./components/side-navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/prisijungti?callbackUrl=/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-[#f7f7f7]">
      <SideNavigation user={session.user} />

      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
