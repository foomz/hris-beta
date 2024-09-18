import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Employees.css"; // Reuse the CSS from Employees

const PayrollRecords = () => {
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [basicPay, setBasicPay] = useState("");
  const [gsisContribution, setGsisContribution] = useState("");
  const [sssContribution, setSssContribution] = useState("");
  const [philhealthContribution, setPhilhealthContribution] = useState("");
  const [pagibigContribution, setPagibigContribution] = useState("");
  const [loanCash, setLoanCash] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPayrollRecords();
    fetchEmployees();
  }, []);

  const fetchPayrollRecords = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/payroll-records/");
      setPayrollRecords(response.data);
    } catch (error) {
      console.error("Error fetching payroll records:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/employees/");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleAddPayroll = () => {
    setShowModal(true);
    setEditMode(false);
    resetForm();
  };

  const handleEditPayroll = (record) => {
    setSelectedEmployee(`${record.employee.id} - ${record.employee.full_name} (${record.employee.department})`);
    setBasicPay(record.basic_pay);
    setGsisContribution(record.gsis_contribution);
    setSssContribution(record.sss_contribution);
    setPhilhealthContribution(record.philhealth_contribution);
    setPagibigContribution(record.pagibig_contribution);
    setLoanCash(record.loan_cash);
    setEditMode(true);
    setCurrentRecordId(record.id);
    setShowModal(true);
  };

  const handleDeletePayroll = async (recordId) => {
    try {
      await axios.delete(`http://localhost:8000/api/payroll-records/${recordId}/`);
      setPayrollRecords(payrollRecords.filter((record) => record.id !== recordId));
    } catch (error) {
      console.error("Error deleting payroll record:", error);
    }
  };

  const resetForm = () => {
    setSelectedEmployee("");
    setBasicPay("");
    setGsisContribution("");
    setSssContribution("");
    setPhilhealthContribution("");
    setPagibigContribution("");
    setLoanCash("");
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    const employeeId = selectedEmployee.split(" - ")[0];

    const payrollData = {
      employee: employeeId,
      basic_pay: basicPay,
      gsis_contribution: gsisContribution,
      sss_contribution: sssContribution,
      philhealth_contribution: philhealthContribution,
      pagibig_contribution: pagibigContribution,
      loan_cash: loanCash,
    };

    try {
      if (editMode) {
        await axios.put(`http://localhost:8000/api/payroll-records/${currentRecordId}/`, payrollData);
      } else {
        await axios.post("http://localhost:8000/api/payroll-records/", payrollData);
      }
      fetchPayrollRecords();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving payroll record:", error);
    }
  };

  return (
    <div className="employees-page">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="exit-button" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h2>{editMode ? "Edit Payroll Record" : "Add Payroll Record"}</h2>
            <form className="signup-form" onSubmit={handleModalSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="employee">Select Employee</label>
                  <input
                    list="employees"
                    id="employee"
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    placeholder="Select ID# - Full Name (Department)"
                    required
                  />
                  <datalist id="employees">
                    {employees.map((employee) => (
                      <option
                        key={employee.id}
                        value={`${employee.id} - ${employee.full_name} (${employee.department})`}
                      >
                        {employee.full_name}
                      </option>
                    ))}
                  </datalist>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="basicPay">Basic Pay</label>
                  <input
                    type="number"
                    id="basicPay"
                    value={basicPay}
                    onChange={(e) => setBasicPay(e.target.value)}
                    placeholder="Enter Basic Pay"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gsisContribution">GSIS Contribution</label>
                  <input
                    type="number"
                    id="gsisContribution"
                    value={gsisContribution}
                    onChange={(e) => setGsisContribution(e.target.value)}
                    placeholder="Enter GSIS Contribution"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="sssContribution">SSS Contribution</label>
                  <input
                    type="number"
                    id="sssContribution"
                    value={sssContribution}
                    onChange={(e) => setSssContribution(e.target.value)}
                    placeholder="Enter SSS Contribution"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="philhealthContribution">PhilHealth Contribution</label>
                  <input
                    type="number"
                    id="philhealthContribution"
                    value={philhealthContribution}
                    onChange={(e) => setPhilhealthContribution(e.target.value)}
                    placeholder="Enter PhilHealth Contribution"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pagibigContribution">PAG-IBIG Contribution</label>
                  <input
                    type="number"
                    id="pagibigContribution"
                    value={pagibigContribution}
                    onChange={(e) => setPagibigContribution(e.target.value)}
                    placeholder="Enter PAG-IBIG Contribution"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="loanCash">Loan Cash</label>
                  <input
                    type="number"
                    id="loanCash"
                    value={loanCash}
                    onChange={(e) => setLoanCash(e.target.value)}
                    placeholder="Enter Loan Cash"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="submit-button">
                {editMode ? "Save Changes" : "Add Payroll"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="data-container">
        <button className="back-button" onClick={() => navigate("/welcome")}>
          Back to Dashboard
        </button>

        <div className="header-container">
          <h2>Payroll Records</h2>
          <button className="add-button" onClick={handleAddPayroll}>
            Add Payroll Record
          </button>
        </div>

        <table className="employees-table">
          <thead>
            <tr>
              <th>ID#</th>
              <th>Employee Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Basic Pay</th>
              <th>GSIS Contribution</th>
              <th>SSS Contribution</th>
              <th>PhilHealth Contribution</th>
              <th>PAG-IBIG Contribution</th>
              <th>Loan Cash</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payrollRecords.map((record) => (
              <tr key={record.id}>
                <td>{record.employee.id}</td>
                <td>{record.employee.full_name}</td>
                <td>{record.employee.position}</td>
                <td>{record.employee.department}</td>
                <td>{record.basic_pay}</td>
                <td>{record.gsis_contribution}</td>
                <td>{record.sss_contribution}</td>
                <td>{record.philhealth_contribution}</td>
                <td>{record.pagibig_contribution}</td>
                <td>{record.loan_cash}</td>
                <td>
                  <div className="dropdown">
                    <button className="dropbtn">⋮</button>
                    <div className="dropdown-content">
                      <button onClick={() => handleEditPayroll(record)}>Edit</button>
                      <button onClick={() => handleDeletePayroll(record.id)}>Delete</button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollRecords;
