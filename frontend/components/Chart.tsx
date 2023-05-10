"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler
);

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data: ChartData<"line"> = {
  labels,
  datasets: [
    {
      fill: true,
      label: "Dataset 2",
      data: [2, 5, 1, 6, 9, 3, 5],
      borderColor: "rgb(29, 78, 216)",
      backgroundColor: "rgba(59, 130, 246, 0.5)",
      tension: 0.2,
    },
  ],
};

const Chart: React.FC<{ color: "blue" | "pink" }> = ({ color }) => {
  const graphColor = (opacity: number) => {
    switch (color) {
      case "pink":
        return `rgba(190, 24, 93, ${opacity})`;
      case "blue":
      default:
        return `rgba(29, 78, 216, ${opacity})`;
    }
  };

  return (
    <Line
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
      data={data}
    />
  );
};

export default Chart;
