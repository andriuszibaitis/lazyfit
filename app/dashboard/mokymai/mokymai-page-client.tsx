"use client";

import { useState } from "react";
import PageTitleBar from "../components/page-title-bar";
import { TabItem } from "@/components/ui/custom-tabs";
import CoursesContent from "./courses-content";

interface Course {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  gender: string;
  difficulty: string;
  lessonCount: number;
  totalDuration: number;
}

interface MokymaiPageClientProps {
  courses: Course[];
  userGender: string | null;
}

export default function MokymaiPageClient({
  courses,
  userGender,
}: MokymaiPageClientProps) {
  const [activeTab, setActiveTab] = useState("all");

  const tabs: TabItem[] = [
    {
      id: "all",
      label: "Visi mokymai",
    },
    {
      id: "men",
      label: "Vyrams",
    },
    {
      id: "women",
      label: "Moterims",
    },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <>
      <PageTitleBar
        title="Mokymai"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <CoursesContent courses={courses} activeTab={activeTab} />
        </div>
      </div>
    </>
  );
}
