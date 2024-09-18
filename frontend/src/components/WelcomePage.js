import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Chart, registerables } from "chart.js"; // Import Chart.js
import axios from "axios"; // Import axios for API calls
import "./WelcomePage.css"; // Import the CSS file for styling

Chart.register(...registerables); // Register Chart.js components

const WelcomePage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to manage sidebar visibility
  const [employeesData, setEmployeesData] = useState([]); // Store employee data
  const [recruitsData, setRecruitsData] = useState([]); // Store recruits data
  const [chartInstance, setChartInstance] = useState(null); // Store employee chart instance

  useEffect(() => {
    // Retrieve the username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Fetch employee data for the chart
    const fetchEmployeesData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/employees/");
        setEmployeesData(response.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    // Fetch recruits data for the recruitment chart
    const fetchRecruitsData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/recruits/");
        setRecruitsData(response.data);
      } catch (error) {
        console.error("Error fetching recruits data:", error);
      }
    };

    fetchEmployeesData();
    fetchRecruitsData();
  }, []);

  useEffect(() => {
    if (employeesData.length > 0) {
      renderEmployeeChart();
    }
  }, [employeesData]);

  const renderEmployeeChart = () => {
    const ctx = document.getElementById("employeeChart").getContext("2d");

    // Prepare data for the employee chart
    const totalEmployees = employeesData.length;
    const departmentCounts = employeesData.reduce((acc, employee) => {
      acc[employee.department] = (acc[employee.department] || 0) + 1;
      return acc;
    }, {});

    const departmentLabels = Object.keys(departmentCounts);
    const departmentValues = Object.values(departmentCounts);

    if (chartInstance) {
      chartInstance.destroy(); // Destroy the previous chart instance to prevent memory leaks
    }

    const newChartInstance = new Chart(ctx, {
      type: "pie", // Change chart type to 'pie'
      data: {
        labels: departmentLabels,
        datasets: [
          {
            label: "Employees by Department",
            data: departmentValues,
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 99, 132, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)"
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: `Total Employees: ${totalEmployees}`,
          },
        },
      },
    });

    setChartInstance(newChartInstance);
  };

  const handleLogout = () => {
    // Remove the token and username from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    // Redirect to login page
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle sidebar open/closed
  };

  return (
    <div className="welcome-container">
      {/* Sidebar Toggle Button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2 className="sidebar-title">HRIS</h2>
        <ul className="sidebar-list">
          <li className="sidebar-item">Dashboard</li>
          <Link to="/employees" className="sidebar-item">Employees</Link>
        </ul>
        {/* Bottom section buttons */}
        <ul className="sidebar-bottom-list">
          <Link to="/recruiting" className="sidebar-item">Recruiting</Link>
          <Link to="/processing" className="sidebar-item">Processing</Link>
          <Link to="/payrollmanagement" className="sidebar-item">Payroll</Link>
          <li className="sidebar-item">Time Off</li>
          <li className="sidebar-item">Performance</li>
          <li className="sidebar-item">Reports & Analytics</li>
          <li className="sidebar-item">Settings</li>
        </ul>
        <div className="sidebar-footer">
          <p className="user-info">Logged in as {username}</p>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="content">
        <h1>Welcome to the Dashboard, {username}!</h1>
        {/* Employee Chart Canvas */}
        <canvas id="employeeChart"></canvas>
        <h2>Employees As of Now: {employeesData.length}</h2>
        <h2>Recruits As of Now: {recruitsData.length}</h2>
      </div>
    </div>
  );
};

export default WelcomePage;
