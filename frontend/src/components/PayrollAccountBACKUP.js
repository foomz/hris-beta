// Import necessary libraries and components
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PayrollAccount.css";

const PayrollAccount = () => {
  const [employees, setEmployees] = useState([]); // State to store the list of employees
  const [selectedEmployee, setSelectedEmployee] = useState({
    id: '',
    bankName: '',
    bankAccountName: '',
    bankAccountNumber: '',
    basicPay: 0,
    gsisContribution: 0,
    sssContribution: 0,
    philHealthContribution: 0,
    pagIbigContribution: 0,
    loanCash: 0,
  }); // State to store the selected employee's payroll details
  const [showModal, setShowModal] = useState(false); // State to control the visibility of the modal
  const [isLoading, setIsLoading] = useState(false); // State to indicate whether data is being loaded
  const [error, setError] = useState(null); // State to store any error messages
  const navigate = useNavigate(); // Hook to navigate to different routes

  // Fetch employees data when the component is mounted
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/employees/");
        setEmployees(response.data); // Set the fetched employees data to state
      } catch (error) {
        console.error("Error fetching employees:", error); // Log any errors in fetching data
      }
    };
    fetchEmployees();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Handle input changes in the modal form
  const handleInputChange = (field, value) => {
    setSelectedEmployee((prevEmployee) => ({
      ...prevEmployee,
      [field]: value, // Dynamically update the field in selectedEmployee state
    }));
  };

  // Function to handle payroll account updates
  const handleUpdatePayroll = async () => {
    if (!selectedEmployee.payrollId) return;

    if (!selectedEmployee.bankAccountName || !selectedEmployee.bankAccountNumber) {
      setError("Bank account name and number cannot be empty.");
      return;
    }

    const data = {
      employee: selectedEmployee.id, // Explicitly include employee ID
      bank_name: selectedEmployee.bankName || '',
      bank_account_name: selectedEmployee.bankAccountName,
      bank_account_number: selectedEmployee.bankAccountNumber,
      basic_pay: selectedEmployee.basicPay || 0,
      gsis_contribution: selectedEmployee.gsisContribution || 0,
      sss_contribution: selectedEmployee.sssContribution || 0,
      philhealth_contribution: selectedEmployee.philHealthContribution || 0,
      pagibig_contribution: selectedEmployee.pagIbigContribution || 0,
      loan_cash: selectedEmployee.loanCash || 0,
    };

    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.put(
        `http://localhost:8000/api/payroll-account/${selectedEmployee.payrollId}/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Payroll account updated successfully:", response.data);

      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.id === selectedEmployee.id ? { ...employee, ...response.data } : employee
        )
      );

      setShowModal(false);
      setError(null);
    } catch (error) {
      console.error("Error updating payroll account:", error);
      setError("Failed to update payroll account. Please try again.");
    }
  };

  // Function to open the modal and load the employee's payroll data
  const openModal = async (employee) => { 
    setIsLoading(true); 
    setError(null); 
    const token = localStorage.getItem("authToken");  // Add this line to get the token

    try { 
      const response = await axios.get(`http://localhost:8000/api/payroll-account/${employee.employee_id}/`); 
      setSelectedEmployee({ ...employee, payrollId: response.data.id, ...response.data }); 
    } catch (error) { 
      if (error.response && error.response.status === 404) { 
        console.error("Payroll account not found. Creating a new one...");

        const newPayrollAccount = { 
          bank_name: '', 
          bank_account_name: '', 
          bank_account_number: '', 
          basic_pay: '0.00', 
          gsis_contribution: '0.00', 
          sss_contribution: '0.00', 
          philhealth_contribution: '0.00', 
          pagibig_contribution: '0.00', 
          loan_cash: '0.00', 
        }; 

        try { 
          const createResponse = await axios.post( 
            "http://localhost:8000/api/payroll-account/", 
            newPayrollAccount, 
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ); 
          setSelectedEmployee({ ...employee, payrollId: createResponse.data.id, ...createResponse.data }); 
        } catch (createError) { 
          console.error("Error creating new payroll account:", createError); 
          setError("Failed to create new payroll account. Please try again."); 
        } 
      } else { 
        console.error("Error fetching payroll account:", error); 
        setError("Failed to fetch payroll account. Please try again."); 
      } 
    } finally { 
      setIsLoading(false); 
    } 

    setShowModal(true); 
  };

  // Function to close the modal and clear the selected employee data
  const closeModal = () => {
    setSelectedEmployee(null); // Clear the selected employee state
    setShowModal(false); // Hide the modal
  };

  return (
    <div className="payroll-account-page">
      <div className="data-container">
        <div className="header-container">
          <button className="back-button" onClick={() => navigate("/welcome")}>
            Back
          </button>
          <h2>Payroll Account Management</h2>
        </div>

        <div className="payroll-details-container">
          <h2>Payroll Account Details</h2>
          <table className="employees-table">
            <thead>
              <tr>
                <th>ID#</th>
                <th>Full Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Bank Name</th>
                <th>Bank Account Name</th>
                <th>Bank Account Number</th>
                <th>Basic Pay</th>
                <th>GSIS Contribution</th>
                <th>SSS Contribution</th>
                <th>PhilHealth Contribution</th>
                <th>Pag-IBIG Contribution</th>
                <th>Loan Cash</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.employee_id}>
                  <td>{employee.employee_id}</td>
                  <td>{employee.full_name}</td>
                  <td>{employee.position}</td>
                  <td>{employee.department}</td>
                  <td>{employee.bank_name || 'N/A'}</td>
                  <td>{employee.bank_account_name || 'N/A'}</td>
                  <td>{employee.bank_account_number || 'N/A'}</td>
                  <td>{employee.basic_pay || '0.00'}</td>
                  <td>{employee.gsis_contribution || '0.00'}</td>
                  <td>{employee.sss_contribution || '0.00'}</td>
                  <td>{employee.philhealth_contribution || '0.00'}</td>
                  <td>{employee.pagibig_contribution || '0.00'}</td>
                  <td>{employee.loan_cash || '0.00'}</td>
                  <td>
                    <button onClick={() => openModal(employee)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="exit-button" onClick={closeModal}>
              ×
            </button>
            <h3>Edit Payroll Account</h3>
            {isLoading ? (
              <div className="loading-spinner">Loading...</div>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="bankName">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={selectedEmployee.bankName}
                    onChange={(e) => handleInputChange("bankName", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bankAccountName">Bank Account Name</label>
                  <input
                    type="text"
                    name="bankAccountName"
                    value={selectedEmployee.bankAccountName}
                    onChange={(e) => handleInputChange("bankAccountName", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bankAccountNumber">Bank Account Number</label>
                  <input
                    type="text"
                    name="bankAccountNumber"
                    value={selectedEmployee.bankAccountNumber}
                    onChange={(e) => handleInputChange("bankAccountNumber", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="basicPay">Basic Pay</label>
                  <input
                    type="number"
                    name="basicPay"
                    value={selectedEmployee.basicPay}
                    onChange={(e) => handleInputChange("basicPay", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gsisContribution">GSIS Contribution</label>
                  <input
                    type="number"
                    name="gsisContribution"
                    value={selectedEmployee.gsisContribution}
                    onChange={(e) => handleInputChange("gsisContribution", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="sssContribution">SSS Contribution</label>
                  <input
                    type="number"
                    name="sssContribution"
                    value={selectedEmployee.sssContribution}
                    onChange={(e) => handleInputChange("sssContribution", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="philHealthContribution">PhilHealth Contribution</label>
                  <input
                    type="number"
                    name="philHealthContribution"
                    value={selectedEmployee.philHealthContribution}
                    onChange={(e) => handleInputChange("philHealthContribution", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pagIbigContribution">Pag-IBIG Contribution</label>
                  <input
                    type="number"
                    name="pagIbigContribution"
                    value={selectedEmployee.pagIbigContribution}
                    onChange={(e) => handleInputChange("pagIbigContribution", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="loanCash">Loan Cash</label>
                  <input
                    type="number"
                    name="loanCash"
                    value={selectedEmployee.loanCash}
                    onChange={(e) => handleInputChange("loanCash", e.target.value)}
                  />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button className="submit-button" onClick={handleUpdatePayroll}>
                  Save
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollAccount;
