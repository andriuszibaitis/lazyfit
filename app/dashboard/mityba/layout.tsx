"use client";

import { usePathname } from "next/navigation";
import { TabItem } from "@/components/ui/custom-tabs";
import PageTitleBar from "../components/page-title-bar";
import { useRouter } from "next/navigation";

const tabs: TabItem[] = [
  { id: "mitybos-planai", label: "Mitybos planai" },
  { id: "receptai", label: "Receptai" },
  { id: "kaloriju-skaiciuokle", label: "Kalorijų skaičiuoklė" },
];

export default function MitybaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Check if we're on a detail page (recipe or nutrition plan)
  const isDetailPage = pathname.includes("/receptas/") || pathname.includes("/mitybos-planas/");

  // Determine active tab from pathname
  const getActiveTab = () => {
    if (pathname.includes("/mitybos-planai") || pathname.includes("/mitybos-planas/")) return "mitybos-planai";
    if (pathname.includes("/receptai") || pathname.includes("/receptas/")) return "receptai";
    if (pathname.includes("/kaloriju-skaiciuokle")) return "kaloriju-skaiciuokle";
    return "mitybos-planai"; // default
  };

  const handleTabChange = (tabId: string) => {
    router.push(`/dashboard/mityba/${tabId}`);
  };

  // Don't show tabs on detail pages
  if (isDetailPage) {
    return (
      <div className="flex-1">
        <PageTitleBar title="Mityba" />
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    );
  }

  return (
    <>
      <PageTitleBar
        title="Mityba"
        tabs={tabs}
        activeTab={getActiveTab()}
        onTabChange={handleTabChange}
      />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </>
  );
}
