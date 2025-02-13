import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Legend,
} from "chart.js";
Chart.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Legend
);

const TrafficGraph = () => {
  return (
    <>
      <div className="bottom flex justify-center items-center w-full">
        <div className="w-5/6">
          <Line
            data={{
              labels: ["A", "B", "C", "D", "E"],
              datasets: [
                {
                  label: "Latency",
                  data: [100, 300, 200, 300, 250],
                  backgroundColor: "#064FF0",
                  borderColor: "#064FF0",
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: "TRAFFIC",
                  font: { size: 16 },
                  color: "#000",
                },
                legend: {
                  display: true,
                  position: "top",
                },
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default TrafficGraph;
