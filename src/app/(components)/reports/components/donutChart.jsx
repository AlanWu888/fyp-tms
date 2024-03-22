import React, { useEffect, useRef } from "react";
import Chart from "chart.js";

const DoughnutChart = ({ data }) => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  const convertDecimalToTime = (decimalTime) => {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartContainer.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: Object.keys(data).map(
            (label) => `${label}: (${convertDecimalToTime(data[label])})`,
          ),
          datasets: [
            {
              label: "Data",
              data: Object.values(data),
              backgroundColor: [
                "rgba(0, 108, 207, 1)",
                "rgba(252, 181, 0, 1)",
                "rgba(0, 252, 206, 1)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 0.5)",
                "rgba(54, 162, 235, 0.5)",
                "rgba(255, 206, 86, 0.5)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          legend: {
            position: "right",
            labels: {
              boxWidth: 15,
              boxHeight: 15,
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Doughnut Chart",
            },
          },
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                const dataset = data.datasets[tooltipItem.datasetIndex];
                const total = dataset.data.reduce((acc, cur) => acc + cur);
                const value = dataset.data[tooltipItem.index];
                const percentage = ((value / total) * 100).toFixed(2);
                return `${data.labels[tooltipItem.index]}: ${percentage}%`;
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div>
      <canvas ref={chartContainer} width={300} height={150} />
    </div>
  );
};

export default DoughnutChart;
