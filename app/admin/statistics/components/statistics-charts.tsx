"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface MembershipCount {
  name: string;
  planId: string;
  userCount: number;
}

export default function StatisticsCharts({
  membershipCounts,
}: {
  membershipCounts: MembershipCount[];
}) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const colors = ["#60988E", "#8BB5AD", "#B5D4CE", "#4A7A70", "#3B6159"];

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: membershipCounts.map((m) => m.name),
        datasets: [
          {
            data: membershipCounts.map((m) => m.userCount),
            backgroundColor: colors.slice(0, membershipCounts.length),
            borderWidth: 2,
            borderColor: "#ffffff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyleWidth: 10,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [membershipCounts]);

  if (membershipCounts.length === 0 || membershipCounts.every((m) => m.userCount === 0)) {
    return null;
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">
        Narystės pasiskirstymas (diagrama)
      </h2>
      <div className="h-[300px] flex items-center justify-center">
        <canvas ref={chartRef} />
      </div>
    </Card>
  );
}
