// src/components/PayrollLineChart.js
import React, { useEffect, useRef } from 'react';
import { Chart, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components of Chart.js
Chart.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function PayrollLineChart({ monthlyData = {} }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Destroy the previous chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Format the data
      const labels = Object.keys(monthlyData);
      const grossPayData = labels.map(label => monthlyData[label]?.grossPay || 0);
      const netPayData = labels.map(label => monthlyData[label]?.netPay || 0);

      // Create a new Chart instance
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line', // Chart type
        data: {
          labels,
          datasets: [
            {
              label: 'Gross Pay',
              data: grossPayData,
              fill: false,
              borderColor: 'rgba(75, 192, 192, 1)',
              tension: 0.1,
            },
            {
              label: 'Net Pay',
              data: netPayData,
              fill: false,
              borderColor: 'rgba(255, 99, 132, 1)',
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += `${context.parsed.y.toLocaleString()}`;
                  }
                  return label;
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Month',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Amount',
              },
              ticks: {
                callback: (value) => value.toLocaleString(),
              },
            },
          },
        },
      });
    }

    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [monthlyData]);

  return (
    <div className="chart-container">
      <h2>Payroll Line Chart</h2>
      <canvas ref={chartRef} />
    </div>
  );
}

export default PayrollLineChart;
