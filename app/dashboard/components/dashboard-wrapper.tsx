"use client";

import DashboardHeader from "./dashboard-header";
import { usePageTitle } from "../contexts/page-title-context";

export default function DashboardWrapper() {
  const { pageTitle } = usePageTitle();

  return <DashboardHeader pageTitle={pageTitle} />;
}