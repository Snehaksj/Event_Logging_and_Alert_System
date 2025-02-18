import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Legend,
  Tooltip,
  Filler,
} from "chart.js";

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Legend, Tooltip, Filler);

const TrafficGraph = () => {
  const [trafficData, setTrafficData] = useState([100, 300, 200, 300, 250, 310, 330]);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3000/api/live-traffic");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTrafficData(data.trafficValues);
    };

    return () => eventSource.close();
  }, []);

  return (
    <div className="bottom flex justify-center items-center h-[500px] w-full">
      <div className="w-full h-full bg-[#0A192F] p-3 rounded-xl shadow-lg">
        <Line
          data={{
            labels: ["T-30", "T-25", "T-20", "T-15", "T-10", "T-5", "T-0"],
            datasets: [
              {
                label: "Traffic",
                data: trafficData,
                backgroundColor: "rgba(6, 79, 240, 0.3)",
                borderColor: "#064FF0",
                borderWidth: 2,
                pointBackgroundColor: "#FFFFFF",
                pointBorderColor: "#064FF0", // circle
                pointHoverRadius: 7,
                pointRadius: 5,
                tension: 0.45,
                fill: true,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "Network Traffic Analysis",
                font: { size: 20 },
                color: "#FFFFFF",
                
              },
              datalabels: {
                anchor: "end",
                align: "top",
                color: "white",
                font: {
                  weight: "bold",
                },
                formatter: (value) => value,
              },
              legend: {
                display: true,
                position: "top",
                labels: { color: "#FFFFFF" },
                
              },
              tooltip: {
                enabled: true,
                backgroundColor: "#222",
                titleColor: "#FFF",
                bodyColor: "#FFF",
                borderColor: "#064FF0",
                borderWidth: 1,

              },
            },
            scales: {
              x: {
                grid: { color: "rgba(255, 255, 255, 0.2)" },
                ticks: { color: "#FFFFFF" },
              },
              y: {
                grid: { color: "rgba(255, 255, 255, 0.2)" },
                ticks: { color: "#FFFFFF" },
                beginAtZero: true,
                suggestedMin: 0,
                suggestedMax: 400,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default TrafficGraph;
