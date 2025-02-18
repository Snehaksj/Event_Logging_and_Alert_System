import React, { useState, useEffect } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  ChartDataLabels
);

const Latency = () => {
  const [latencyData, setLatencyData] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3000/api/live-data");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received data:", data); // Log received data for debugging
      setLatencyData((prev) => {
        const updatedData = [...prev.slice(-4), data.latency]; // Keep only the last 5 latency values
        console.log("Updated Latency Data:", updatedData); // Log updated latency data
        return updatedData;
      });
    };

    eventSource.onerror = (error) => {
      console.error("Error in SSE:", error); // Log any errors in the SSE connection
    };

    return () => eventSource.close();
  }, []);

  return (
    <div className="bottom flex justify-center items-center w-full bg-[#0A192F] p-4 rounded-xl shadow-lg">
      <div className="w-5/6">
        <Radar
          data={{
            labels: ["1", "2", "3", "4", "5"], // You can customize these labels if needed
            datasets: [
              {
                label: "Latency (ms)",
                data: latencyData.length === 5 ? latencyData : [...latencyData], // Ensure the data length matches 5
                backgroundColor: "rgba(6, 79, 240, 0.3)",
                borderColor: "#064FF0",
                borderWidth: 3,
                pointBackgroundColor: "#FFFFFF",
                pointBorderColor: "#064FF0",
                pointRadius: 5,
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: "LATENCY",
                font: { size: 20 },
                color: "#FFF",
              },

              legend: { display: false },

              datalabels: {
                color: "rgba(252, 250, 250, 0.74)",
                font: { weight: "bold" },
                formatter: (value) => value,
                anchor: "end",
                align: "top",
              },
            },
            scales: {
              r: {
                grid: {
                  color: "rgba(255, 255, 255, 0.3)",
                },
                pointLabels: {
                  color: "#FFF",
                },
                angleLines: {
                  color: "rgba(255, 255, 255, 0.7)",
                },
                ticks: {
                  display: false, // Removes Y-axis (radial) labels
                },
              },
            },            
          }}
        />
      </div>
    </div>
  );
};

export default Latency;
