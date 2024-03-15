import React, { useEffect, useRef } from "react";
import Chart from "chart.js";

const LineChart = ({ data, labels, mode, width, height }) => {
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
              label: `Hours contributed per ${mode}`,
              data: data,
              fill: true,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            x: {
              type: "time",
              time: {
                unit: mode,
              },
              scaleLabel: {
                display: true,
                labelString: "Time",
              },
            },
            y: {
              scaleLabel: {
                display: true,
                labelString: "Hours contributed",
              },
            },
          },
        },
      });
    }
  }, [data, labels, mode]);

  return <canvas ref={chartRef} width={width} height={height} />;
};

export default LineChart;
