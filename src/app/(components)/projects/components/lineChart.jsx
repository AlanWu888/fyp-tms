import React, { useEffect, useRef } from "react";
import Chart from "chart.js";

const LineChart = ({ data, labels, width, height }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Data",
              data: data,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
        options: {
          maintainAspectRatio: false, // Disable the aspect ratio
        },
      });
    }
  }, [data, labels]);

  return <canvas ref={chartRef} width={width} height={height} />;
};

export default LineChart;
