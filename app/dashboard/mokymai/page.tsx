"use client";

import { useState } from "react";
import PageTitleBar from "../components/page-title-bar";
import { TabItem } from "../../components/tabs";

export default function MokymaiPage() {
  const [activeTab, setActiveTab] = useState("personal");

  const tabs: TabItem[] = [
    {
      id: "personal",
      label: "Asmeninė informacija"
    },
    {
      id: "reports",
      label: "Pranešimai"
    },
    {
      id: "members",
      label: "Narystė"
    }
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Asmeninė informacija</h2>
            <p>Čia bus rodoma asmeninės informacijos turinys.</p>
          </div>
        );
      case "reports":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Pranešimai</h2>
            <p>Čia bus rodomi pranešimai.</p>
          </div>
        );
      case "members":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Narystė</h2>
            <p>Čia bus rodoma narystės informacija.</p>
          </div>
        );
      default:
        return null;
    }
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
          {renderTabContent()}
        </div>
      </div>
    </>
  );
}

