"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface NutritionChartProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function NutritionChart({
  calories,
  protein,
  carbs,
  fat,
}: NutritionChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const totalGrams = protein + carbs + fat;
    const proteinPercent = Math.round((protein / totalGrams) * 100);
    const carbsPercent = Math.round((carbs / totalGrams) * 100);
    const fatPercent = Math.round((fat / totalGrams) * 100);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const canvas = chartRef.current;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const devicePixelRatio = window.devicePixelRatio || 1;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;

      canvas.style.width = width + "px";
      canvas.style.height = height + "px";

      ctx.scale(devicePixelRatio, devicePixelRatio);

      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: [
            `Baltymai (${proteinPercent}%)`,
            `Angliavandeniai (${carbsPercent}%)`,
            `Riebalai (${fatPercent}%)`,
          ],
          datasets: [
            {
              data: [protein, carbs, fat],
              backgroundColor: ["#4285F4", "#34A853", "#EA4335"],
              borderColor: ["#4285F4", "#34A853", "#EA4335"],
              borderWidth: 1,
              hoverOffset: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          cutout: "70%",
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 15,
                usePointStyle: true,
                pointStyle: "circle",
                font: {
                  size: 12,
                  family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                  weight: "normal",
                },
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || "";
                  const value = context.raw as number;
                  return `${label}: ${value.toFixed(1)}g`;
                },
              },
              titleFont: {
                size: 14,
                family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                weight: "bold",
              },
              bodyFont: {
                size: 13,
                family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
              },
              padding: 10,
              cornerRadius: 4,
            },
          },
          elements: {
            arc: {
              borderWidth: 1,
            },
          },
          animation: {
            animateScale: true,
            animateRotate: true,
          },
        },
      });

      Chart.overrides.doughnut.plugins.legend.labels.generateLabels = (
        chart
      ) => {
        const width = chart.width;
        const height = chart.height;
        const ctx = chart.ctx;

        if (ctx) {
          ctx.restore();
          ctx.font =
            "bold 20px 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
          ctx.textBaseline = "middle";
          ctx.textAlign = "center";
          ctx.fillStyle = "#333";

          ctx.shadowColor = "rgba(255, 255, 255, 0.2)";
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          ctx.fillText(
            `${calories.toFixed(0)} kcal`,
            width / 2,
            height / 2 - 10
          );

          ctx.font = "13px 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
          ctx.fillStyle = "#666";
          ctx.fillText(
            "Maisto medžiagų pasiskirstymas:",
            width / 2,
            height / 2 + 15
          );
          ctx.save();
        }

        return Chart.defaults.plugins.legend.labels.generateLabels(chart);
      };
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [calories, protein, carbs, fat]);

  return (
    <div className="w-full h-full">
      <h3 className="text-lg font-semibold mb-2 text-center">
        Maisto medžiagų pasiskirstymas:
      </h3>
      <div className="w-full max-w-[300px] mx-auto">
        <canvas ref={chartRef} height="300" width="300"></canvas>
      </div>
    </div>
  );
}
