"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartArea,
  type ChartData,
} from "chart.js";
import { useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler
);

const Chart: React.FC<{
  color: "blue" | "pink";
  data: ChartData<"line">["datasets"][0]["data"];
  labels: ChartData<"line">["labels"];
}> = ({ color, data, labels }) => {
  const [gradient, setGradient] = useState<CanvasGradient | undefined>();
  const [width, setWidth] = useState<number | undefined>();
  const [height, setHeight] = useState<number | undefined>();

  const graphColor = (opacity: number) => {
    switch (color) {
      case "pink":
        return `rgba(190, 24, 93, ${opacity})`;
      case "blue":
      default:
        return `rgba(29, 78, 216, ${opacity})`;
    }
  };

  const getGradient = (ctx: CanvasRenderingContext2D, chartArea: ChartArea) => {
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    if (!gradient || width !== chartWidth || height !== chartHeight) {
      const tempGradient = ctx.createLinearGradient(
        0,
        chartArea.bottom,
        0,
        chartArea.top
      );
      tempGradient.addColorStop(0, graphColor(0.75));
      tempGradient.addColorStop(1, graphColor(0));

      setGradient(tempGradient);
      setWidth(chartWidth);
      setHeight(chartHeight);
    }

    return gradient;
  };

  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            backgroundColor: ({ chart: { ctx, chartArea } }) => {
              if (!chartArea) {
                // This case happens on initial chart load
                return;
              }

              return getGradient(ctx, chartArea);
            },
            borderColor: graphColor(1),
            data,
            fill: true,
            tension: 0.2,
          },
        ],
      }}
      options={{
        aspectRatio: 4,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#FFF",
            titleColor: graphColor(1),
            borderColor: graphColor(1),
            borderWidth: 1,
            callbacks: {
              title: (tooltipItems) => tooltipItems[0].formattedValue,
              label: () => "",
            },
            caretSize: 0,
            displayColors: false,
            position: "nearest",
            padding: { left: 10, right: 10, top: 6 },
          },
        },
        responsive: true,
        scales: {
          x: {
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            grid: { display: false },
            ticks: { maxTicksLimit: 5 },
          },
        },
      }}
    />
  );
};

export default Chart;
