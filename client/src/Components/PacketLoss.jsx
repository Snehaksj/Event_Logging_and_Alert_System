import React, { useState, useEffect } from "react";
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
    <div className="bottom flex justify-center items-center h-[300px] w-full bg-[#0A192F] p-6 rounded-2xl shadow-xl">
      <Bar
        data={{
          labels: ["1", "2", "3", "4", "5"],
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
              color: "#FFF",
              font: { weight: "bold" },
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
