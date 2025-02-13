import React from "react";
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
  return (
    <div className="bottom flex justify-center items-center h-[200px] w-full bg-black p-4">
       {/* <div className="h-[300px]"> */}
        <Bar
          data={{
            labels: ["A", "B", "C", "D", "E"],
            datasets: [
              {
                label: "Packet Loss",
                data: [10, 19, 10, 15, 20, 25],
                backgroundColor: [
                  "rgba(255, 99, 132, 0.7)",
                  "rgba(54, 162, 235, 0.7)",
                  "rgba(255, 206, 86, 0.7)",
                  "rgba(75, 192, 192, 0.7)",
                  "rgba(153, 102, 255, 0.7)",
                  "rgba(255, 159, 64, 0.7)"
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
              legend: {
                display: false,
              },
              tooltip: {
                enabled: true,
              },
              datalabels: {
                anchor: "end",
                align: "top",
                color: "#FFF",
                font: {
                  weight: "bold",
                },
                formatter: (value) => value,
              },
            },
            scales: {
              x: {
                ticks: {
                  color: "#FFF",
                },
                grid: {
                  color: "rgba(255, 255, 255, 0.3)",
                },
              },
              y: {
                ticks: {
                  color: "#FFF",
                  stepSize: 5,
                  callback: function (value) {
                    return value;
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
    //  </div>
  );
};

export default PacketLossBarChart;