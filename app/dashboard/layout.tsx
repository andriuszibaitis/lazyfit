import type React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth-options";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import SideNavigation from "./components/side-navigation";
import { PageTitleProvider } from "./contexts/page-title-context";
import { MobileMenuProvider } from "./contexts/mobile-menu-context";
import DashboardWrapper from "./components/dashboard-wrapper";
import BottomNavigation from "./components/bottom-navigation";

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
            <main className="flex-1 pb-20 lg:pb-0">{children}</main>
          </div>

          <BottomNavigation />
        </div>
        <Toaster
          position="bottom-center"
          offset={{ bottom: "88px" }}
          mobileOffset={{ bottom: "88px" }}
          visibleToasts={1}
        />
      </MobileMenuProvider>
    </PageTitleProvider>
  );
}
