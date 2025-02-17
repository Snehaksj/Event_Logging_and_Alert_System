import React from "react";
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

Chart.register(RadialLinearScale, PointElement, LineElement, Title, Legend, ChartDataLabels);

const Latency = () => {
  return (
    <div className="bottom flex justify-center items-center w-full bg-[#0A192F] p-4 rounded-xl shadow-lg">
      <div className="w-5/6">
        <Radar
          data={{
            labels: ["A", "B", "C", "D", "E"],
            datasets: [
              {
                label: "Latency",
                data: [100, 300, 200, 300, 250],
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
                font: { size: 18 },
                color: "#FFF",
              },
              legend: {
                display: false,
              },
              datalabels: {
                color: "rgba(252, 250, 250, 0.74)",
                font: {
                  weight: "bold",
                },
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
