"use client";

import DashboardHeader from "./dashboard-header";
import { usePageTitle } from "../contexts/page-title-context";

export default function DashboardWrapper() {
  const { pageTitle, showBackButton, backUrl } = usePageTitle();

  return <DashboardHeader pageTitle={pageTitle} showBackButton={showBackButton} backUrl={backUrl} />;
}