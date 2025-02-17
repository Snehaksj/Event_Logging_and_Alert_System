import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const PacketLossBarChart = () => {
  return (
    <div className="bottom flex justify-center items-center h-[300px] w-full bg-[#0A192F] p-6 rounded-2xl shadow-xl">
      <Bar
        data={{
          labels: ["A", "B", "C", "D", "E"],
          datasets: [
            {
              label: "Packet Loss",
              data: [10, 19, 10, 15, 20],
              backgroundColor: [
                "rgba(255, 99, 132, 0.8)",
                "rgba(54, 162, 235, 0.8)",
                "rgba(255, 206, 86, 0.8)",
                "rgba(75, 192, 192, 0.8)",
                "rgba(153, 102, 255, 0.8)"
              ],
              borderColor: "#FFF",
              borderWidth: 2,
              hoverBackgroundColor: "rgba(255, 255, 255, 0.9)",
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "PACKET LOSS",
              font: { size: 20, weight: "bold" },
              color: "#FFF",
              padding: { bottom: 10 },
            },
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              titleFont: { size: 14 },
              bodyFont: { size: 12 },
            },
            datalabels: {
              anchor: "end",
              align: "top",
              color: "#FFF",
              font: {
                weight: "bold",
              },
              formatter: (value) => value + "%",
            },
          },
          scales: {
            x: {
              ticks: {
                color: "#FFF",
                font: {
                  size: 14,
                },
              },
              grid: {
                color: "rgba(255, 255, 255, 0.3)",
              },
            },
            y: {
              ticks: {
                color: "#FFF",
                font: {
                  size: 14,
                },
                stepSize: 5,
                callback: function (value) {
                  return value + "%";
                },
              },
              grid: {
                color: "rgba(255, 255, 255, 0.3)",
              },
              suggestedMin: 0,
              suggestedMax: 30,
            },
          },
        }}
      />
    </div>
  );
};

export default PacketLossBarChart;
