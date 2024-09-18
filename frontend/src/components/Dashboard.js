import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../axiosConfig"; // Axios instance with JWT token handling

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const history = useHistory();

  useEffect(() => {
    // Fetch data from the protected API endpoint
    const fetchData = async () => {
      try {
        const response = await api.get("/protected-endpoint/");
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data. Please try again.");
        setLoading(false);

        // If the token is invalid or expired, redirect to login
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          history.push("/login");
        }
      }
    };

    fetchData();
  }, [history]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/login");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      <div>
        {/* Render the data from the API */}
        {data ? (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
