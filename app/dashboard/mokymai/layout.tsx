"use client";

import { usePathname } from "next/navigation";
import PageTitleBar from "../components/page-title-bar";

export default function MokymaiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if we're on a detail page (course)
  const isDetailPage = /\/dashboard\/mokymai\/[^/]+$/.test(pathname) && pathname !== "/dashboard/mokymai";

  // Don't show tabs on detail pages
  if (isDetailPage) {
    return (
      <div className="flex-1">
        <PageTitleBar title="Mokymai" />
        <div className="p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </div>
    );
  }

  // Main mokymai page with content handled by page component
  return <>{children}</>;
}
