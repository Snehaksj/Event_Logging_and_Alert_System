import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(CategoryScale, LinearScale, BarElement, Title, ChartDataLabels);

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
    <div className="bottom flex justify-center items-center h-[200px] w-full bg-[#0A192F] p-4 rounded-xl shadow-lg">
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
            },
          ],
        }}
        options={{
          plugins: {
            title: {
              display: true,
              text: "PACKET LOSS",
              font: { size: 18 },
              color: "#FFF",
            },
            legend: { display: false },
            datalabels: {
              color: "#FFF",
              font: { weight: "bold" },
              anchor: "end",
              align: "top",
              formatter: (value) => value,
            },
          },
          scales: {
            x: { ticks: { color: "#FFF" } },
            y: { ticks: { color: "#FFF", stepSize: 10 }, suggestedMin: 0, suggestedMax: 100 },
          },
        }}
      />
    </div>
  );
};

export default PacketLossBarChart;
