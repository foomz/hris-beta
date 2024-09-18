import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Attendance.css"; // Custom CSS for styling

const Attendance = () => {
  const [date, setDate] = useState("");
  const [id, setId] = useState("");
  const [fullName, setFullName] = useState("");
  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [employees, setEmployees] = useState([]); // State to store employee data

  const navigate = useNavigate();

  useEffect(() => {
    fetchAttendanceRecords();
    fetchEmployees(); // Fetch employees when component mounts
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/attendance/");
      setAttendanceRecords(response.data); // API now includes full_name in each record
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    }
  }; 
  
  const formatTimeWithAMPM = (time) => {
    const date = new Date(`01/01/1970 ${time}`);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };  

  // Fetch employee data
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/employees/");
      setEmployees(response.data); // Set the employee data
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newAttendance = {
      date,
      employee: id,  
      full_name: fullName, 
      time_in: timeIn,
      time_out: timeOut,
      working_hours: calculateWorkingHours(timeIn, timeOut),
    };
  
    try {
      if (editMode) {
        await axios.put(`http://localhost:8000/api/attendance/${id}/`, newAttendance);
      } else {
        await axios.post("http://localhost:8000/api/attendance/", newAttendance);
        fetchAttendanceRecords(); // Refresh the list after adding new record
      }
  
      resetFormFields();
      setShowModal(false); // Close modal after submission
    } catch (error) {
      console.error("Error creating/updating attendance:", error);
    }
  };    

  const handleEdit = (record) => {
    setDate(record.date);
    setId(record.id);
    setFullName(record.full_name);
    setTimeIn(record.time_in);
    setTimeOut(record.time_out);
    setWorkingHours(record.working_hours);
    setEditMode(true);
    setShowModal(true); // Show modal when editing
  };

  const handleDelete = async (recordId) => {
    try {
      await axios.delete(`http://localhost:8000/api/attendance/${recordId}/`);
      setAttendanceRecords(attendanceRecords.filter((record) => record.id !== recordId));
    } catch (error) {
      console.error("Error deleting attendance record:", error);
    }
  };

  const calculateWorkingHours = (timeIn, timeOut) => {
    if (!timeIn || !timeOut) return ""; // Ensure both times are set

    const startTime = new Date(`01/01/1970 ${timeIn}`);
    const endTime = new Date(`01/01/1970 ${timeOut}`);
    const hoursWorked = (endTime - startTime) / (1000 * 60 * 60); // Calculate hours worked
    return hoursWorked.toFixed(2); // Return as a string with two decimal places
  };

  const resetFormFields = () => {
    setDate("");
    setId("");
    setFullName("");
    setTimeIn("");
    setTimeOut("");
    setWorkingHours("");
    setEditMode(false); // Turn off edit mode after resetting
  };

  const handleAddAttendance = () => {
    resetFormFields(); // Reset form fields when adding new record
    setShowModal(true); // Show modal for new entry
  };

  // Update ID and fullName fields when employee is selected
  const handleEmployeeChange = (e) => {
    const selectedEmployee = employees.find(emp => emp.id === parseInt(e.target.value, 10));
    if (selectedEmployee) {
      setId(selectedEmployee.id);
      setFullName(selectedEmployee.full_name);
    }
  };

  // Automatically calculate working hours when timeIn or timeOut is updated
  useEffect(() => {
    setWorkingHours(calculateWorkingHours(timeIn, timeOut));
  }, [timeIn, timeOut]);

  return (
    <div className="attendance-page">
      {/* Modal for Attendance Form */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="exit-button" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h2>{editMode ? "Edit Attendance" : "New Attendance Record"}</h2>
            <form className="attendance-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="employee">Employee</label>
                  <select
                    id="employee"
                    onChange={handleEmployeeChange}
                    required
                    value={id}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.full_name} (ID: {emp.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="timeIn">Time In</label>
                  <input
                    type="time"
                    id="timeIn"
                    value={timeIn}
                    onChange={(e) => setTimeIn(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="timeOut">Time Out</label>
                  <input
                    type="time"
                    id="timeOut"
                    value={timeOut}
                    onChange={(e) => setTimeOut(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="workingHours">Working Hours</label>
                  <input
                    type="text"
                    id="workingHours"
                    value={workingHours}
                    readOnly
                  />
                </div>
              </div>
              <button type="submit" className="submit-button">
                {editMode ? "Update Attendance" : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="data-container">
        <button className="back-button" onClick={() => navigate("/employees")}>
          Back to Employees
        </button>
        <div className="header-container">
          <h2>Attendance Records</h2>
          <button className="add-button" onClick={handleAddAttendance}>
            Add Attendance
          </button>
        </div>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>ID#</th>
              <th>Full Name</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Working Hours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {attendanceRecords.map((record) => (
    <tr key={record.id}>
      <td>{record.date}</td>
      <td>{record.employee}</td> {/* Display employee ID here */}
      <td>{record.full_name}</td>
      <td>{formatTimeWithAMPM(record.time_in)}</td>
      <td>{formatTimeWithAMPM(record.time_out)}</td>
      <td>{record.working_hours}</td>
      <td>
        <div className="dropdown">
          <button className="dropbtn">⋮</button>
          <div className="dropdown-content">
            <button onClick={() => handleEdit(record)}>Edit</button>
            <button onClick={() => handleDelete(record.id)}>Delete</button>
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

export default Attendance;
