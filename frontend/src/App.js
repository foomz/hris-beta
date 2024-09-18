//apps.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import WelcomePage from "./components/WelcomePage";
import Employees from "./components/Employees"; // Import the Employees component
import Attendance from "./components/Attendance"; // Import Attendance component
import Recruiting from "./components/Recruiting"; // Import Leave component
import Onboarding from "./components/Onboarding";
import Processing from "./components/Processing";
import PayrollAccounts from "./components/PayrollAccounts";
import Payroll from "./components/Payroll";
import PayrollManagement from "./components/PayrollManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/welcome" element={<PrivateRoute component={WelcomePage} />} />
        <Route path="/employees" element={<PrivateRoute component={Employees} />} />
        <Route path="/attendance" element={<PrivateRoute component={Attendance} />} />
        <Route path="/recruiting" element={<PrivateRoute component={Recruiting} />} />
        <Route path="/onboarding" element={<PrivateRoute component={Onboarding} />} />
        <Route path="/processing" element={<PrivateRoute component={Processing} />} />
        <Route path="/payroll" element={<PrivateRoute component={Payroll} />} />
        <Route path="/payrollaccounts" element={<PrivateRoute component={PayrollAccounts} />} />
        <Route path="/payrollmanagement" element={<PrivateRoute component={PayrollManagement} />} />
        {/* Remove PrivateRoute for Employees */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

// Private route component to protect routes from unauthenticated users
const PrivateRoute = ({ component: Component }) => {
  const token = localStorage.getItem("token");

  return token ? (
    <Component />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default App;
