import React from "react";
import { Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import {CategoryScale} from 'chart.js';
 
Chart.register(CategoryScale); 

function LineChart({ chartData, chartTitle }) {
  return (
    <div className="chart-container">
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: chartTitle,
              font: {
                size: 16,
                family: "Palanquin Dark",
                weight: "normal"
              }
            },
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              min: 0, // Set the minimum value for the Y-axis
              max: 5, // Set the maximum value for the Y-axis
              ticks: {
                stepSize: 1, // Optional: Define the step size for ticks
              },
            },
          },
        }}
      />
    </div>
  );
}
export default LineChart;