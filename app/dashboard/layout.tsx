import type React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth-options";
import { redirect } from "next/navigation";
import SideNavigation from "./components/side-navigation";
import { PageTitleProvider } from "./contexts/page-title-context";
import { MobileMenuProvider } from "./contexts/mobile-menu-context";
import DashboardWrapper from "./components/dashboard-wrapper";

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
    <PageTitleProvider>
      <MobileMenuProvider>
        <div className="flex min-h-screen bg-[#f7f7f7]">
          <SideNavigation user={session.user} />

          <div className="flex-1 flex flex-col min-w-0">
            <DashboardWrapper />
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </MobileMenuProvider>
    </PageTitleProvider>
  );
}
