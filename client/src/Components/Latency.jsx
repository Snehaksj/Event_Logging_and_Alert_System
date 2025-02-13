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

Chart.register(RadialLinearScale, PointElement, LineElement, Title, Legend);

const Latency = () => {
  return (
    <div className="bottom flex justify-center items-center w-full bg-black p-4">
      <div className="w-5/6">
        <Radar
          data={{
            labels: ["A", "B", "C", "D", "E"],
            datasets: [
              {
                label: "Latency",
                data: [100, 300, 200, 300, 250],
                backgroundColor: "rgba(0, 191, 255, 0.7)",
                borderColor: "#00BFFF",
                borderWidth: 3,
                pointBackgroundColor: "#00BFFF",
                pointBorderColor: "#00BFFF",
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
                position: "top",
                labels: {
                  color: "#FFF",
                },
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
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Latency;
