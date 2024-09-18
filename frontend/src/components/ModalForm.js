import React, { useState } from 'react';

const ModalForm = ({ employees, selectedEmployeeId, selectedEmployeeName, onEmployeeSelection, onSubmit, onClose }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onEmployeeSelection(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="exit-button" onClick={onClose}>×</button>
        <h2>Add Payroll Record</h2>
        <form className="signup-form" onSubmit={handleFormSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="employee">Select Employee</label>
              <input
                list="employees"
                id="employee"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Select ID# or Employee Name"
                required
              />
              <datalist id="employees">
                {employees.map(employee => (
                  <option key={employee.id} value={`${employee.id} - ${employee.full_name}`}>
                    {employee.id} - {employee.full_name}
                  </option>
                ))}
              </datalist>
            </div>
          </div>
          {/* Additional payroll fields go here */}
          <button type="submit" className="submit-button">Add Payroll</button>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
