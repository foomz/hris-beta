import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import './PayrollManagement.css';

Chart.register(...registerables); // Register chart.js components

const API_BASE_URL = 'http://localhost:8000/api';

function PayrollManagement() {
  const navigate = useNavigate();
  const [payrollData, setPayrollData] = useState([]);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    // Fetch payroll data for the chart
    const fetchPayrollData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/payroll/`);
        setPayrollData(response.data);
      } catch (error) {
        console.error('Error fetching payroll data:', error);
      }
    };

    fetchPayrollData();
  }, []);

  useEffect(() => {
    if (payrollData.length > 0) {
      renderPayrollChart();
    }
  }, [payrollData]);

  const renderPayrollChart = () => {
    const ctx = document.getElementById('payrollChart').getContext('2d');

    // Extract month, gross pay, and net pay data for the chart
    const payrollByMonth = payrollData.reduce((acc, payroll) => {
      const month = new Date(payroll.start_date).toLocaleString('default', { month: 'long' });

      if (!acc[month]) {
        acc[month] = { gross_pay: 0, net_pay: 0 };
      }

      acc[month].gross_pay += parseFloat(payroll.gross_pay || 0);
      acc[month].net_pay += parseFloat(payroll.net_pay || 0);

      return acc;
    }, {});

    const months = Object.keys(payrollByMonth);
    const grossPays = months.map(month => payrollByMonth[month].gross_pay);
    const netPays = months.map(month => payrollByMonth[month].net_pay);

    if (chartInstance) {
      chartInstance.destroy(); // Destroy the previous chart instance to prevent memory leaks
    }

    const newChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Gross Pay',
            data: grossPays,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
          {
            label: 'Net Pay',
            data: netPays,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Monthly Gross Pay and Net Pay',
          },
        },
      },
    });

    setChartInstance(newChartInstance);
  };

  return (
    <div className="container">
      <nav className="navbar">
        <button className="back-button" onClick={() => navigate("/welcome")}>
          Back to Dashboard
        </button>
        <ul>
          <li><Link to="/payrollaccounts">Payroll Accounts</Link></li>
          <li><Link to="/payroll">Payroll Accounting</Link></li>
        </ul>
      </nav>
      <div className="content">
        <h1>Welcome to Payroll Management</h1>
        {/* Bar Chart for Payroll */}
        <canvas id="payrollChart"></canvas>
      </div>
    </div>
  );
}

export default PayrollManagement;
