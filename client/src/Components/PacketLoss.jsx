import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const PacketLossBarChart = () => {
  const [packetLossData, setPacketLossData] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3000/api/live-data");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPacketLossData((prev) => [...prev.slice(-4), data.packetLoss]);
    };

    return () => eventSource.close();
  }, []);

  return (
    <div className="bottom flex justify-center items-center h-[350px] w-full bg-[#0A192F] p-6 rounded-2xl shadow-xl">
      <Bar
        data={{
          labels: ["T-20", "T-15", "T-10", "T-5", "T-0"],
          datasets: [
            {
              label: "Packet Loss (%)",
              data: packetLossData,
              backgroundColor: [
                "rgba(255, 99, 132, 0.7)", // Color for first bar
                "rgba(54, 162, 235, 0.7)", // Color for second bar
                "rgba(255, 206, 86, 0.7)", // Color for third bar
                "rgba(75, 192, 192, 0.7)", // Color for fourth bar
                "rgba(153, 102, 255, 0.7)", // Color for fifth bar
              ],
              borderColor: "#FFF",
              borderWidth: 2,
              hoverBackgroundColor: "rgba(255, 255, 255, 0.9)",
            },
          ],
        }}
        options={{
          maintainAspectRatio: false, // Allow the chart to resize freely
          plugins: {
            title: {
              display: true,
              text: "PACKET LOSS",
              font: { size: 20, weight: "bold" },
              color: "#FFF",
              padding: { bottom: 20 },
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
              color: "#FFF",
              font: { weight: "bold" },
              anchor: "end",
              align: "top",
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
              },
              grid: {
                color: "rgba(255, 255, 255, 0.3)",
              },
              suggestedMin: 0,
              suggestedMax: 40, // Increased suggested max for more space
            },
          },
        }}
      />
    </div>
  );
};

export default PacketLossBarChart;
