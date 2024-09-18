import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import "./Employees.css";

const Employees = () => {
  const [id, setId] = useState("");
  const [fullName, setFullName] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [contacts, setContacts] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState("");
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]); 
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [entriesToShow, setEntriesToShow] = useState(20); // State for the number of entries to display
  const [currentPage, setCurrentPage] = useState(1); // State for the current page

  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/employees/");
        setEmployees(response.data);
        setFilteredEmployees(response.data); 
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (!editMode) {
      const generateNewId = () => {
        const maxId = employees.reduce((max, employee) => Math.max(max, parseInt(employee.id, 10)), 0);
        return (maxId + 1).toString().padStart(4, "0");
      };
      setId(generateNewId());
    }
  }, [editMode, employees]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("employee_id", id);
    formData.append("full_name", fullName);
    formData.append("position", position);
    formData.append("department", department);
    formData.append("type", type);
    formData.append("status", status);
    formData.append("location", location);
    formData.append("contacts", contacts);
  
    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }
  
    try {
      if (editMode) {
        // Remove leading zeros before making the request
        const numericId = parseInt(id, 10); // Convert to an integer
  
        await axios.put(`http://localhost:8000/api/employees/${numericId}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const response = await axios.get("http://localhost:8000/api/employees/");
        setEmployees(response.data);
        setFilteredEmployees(response.data);
        setEditMode(false);
      } else {
        const response = await axios.post(
          "http://localhost:8000/api/employees/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setEmployees([...employees, response.data]);
        setFilteredEmployees([...employees, response.data]);
      }
      resetFormFields();
      setShowModal(false);
    } catch (error) {
      console.error("Error creating/updating employee:", error);
    }
  };  

  const handleEdit = (employee) => {
    setId(employee.employee_id);
    setFullName(employee.full_name);
    setPosition(employee.position);
    setDepartment(employee.department);
    setType(employee.type);
    setStatus(employee.status);
    setLocation(employee.location);
    setContacts(employee.contacts);
    setProfilePicturePreview(
      employee.profile_picture ? `http://localhost:8000${employee.profile_picture}` : ""
    );
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (employeeId) => {
    try {
        const url = `http://localhost:8000/api/employees/${employeeId}/`;  // Ensure URL has a trailing slash
        await axios.delete(url);

        // Update employees and filteredEmployees in a single operation
        setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.employee_id !== employeeId));
        setFilteredEmployees((prevFilteredEmployees) => prevFilteredEmployees.filter((employee) => employee.employee_id !== employeeId));
    } catch (error) {
        console.error(`Error deleting employee with ID ${employeeId}:`, error);
    }
};


  const handleAddEmployee = () => {
    resetFormFields();
    setEditMode(false);
    setShowModal(true);
  };

  const resetFormFields = () => {
    setId("");
    setFullName("");
    setPosition("");
    setDepartment("");
    setType("");
    setStatus("");
    setLocation("");
    setContacts("");
    setProfilePicture(null);
    setProfilePicturePreview("");
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to filter employees when search button is clicked
  const handleSearch = () => {
    const filtered = employees.filter(
      (employee) =>
        employee.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredEmployees.length / entriesToShow);

  // Calculate the starting and ending index for the current page
  const startIndex = (currentPage - 1) * entriesToShow;
  const endIndex = startIndex + entriesToShow;

  // Get the employees to show on the current page
  const employeesToShow = filteredEmployees.slice(startIndex, endIndex);

  const handleEntriesChange = (e) => {
    setEntriesToShow(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when entries per page changes
  };

  const handleAttendanceClick = () => {
    navigate("/attendance"); 
  };

  return (
    <div className="employees-page">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="exit-button" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h2>{editMode ? "Edit Employee" : "Employee Sign-Up"}</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
              {/* Form Fields */}
              <div className="form-row">
              <div className="form-group">
  <label htmlFor="id">ID#</label>
  <input
    type="text"
    id="id"
    value={id}
    placeholder="Auto-generated ID"
    disabled
  />
</div>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter Full Name"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="position">Position</label>
                  <input
                    type="text"
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Enter Position"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <input
                    type="text"
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Enter Department"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="type">Type</label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter Location"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contacts">Contacts</label>
                  <input
                    type="text"
                    id="contacts"
                    value={contacts}
                    onChange={(e) => setContacts(e.target.value)}
                    placeholder="Enter Contacts"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="profilePicture">Profile Picture</label>
                <input
                  type="file"
                  id="profilePicture"
                  onChange={handleProfilePictureChange}
                />
                {profilePicturePreview && (
                  <img
                    src={profilePicturePreview}
                    alt="Profile Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      marginTop: "10px",
                    }}
                  />
                )}
              </div>
              <button type="submit" className="submit-button">
                {editMode ? "Save Changes" : "Sign Up"}
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
          <h2>Employee List</h2>
          <div className="button-group">
            <button className="add-button" onClick={handleAddEmployee}>
              Add Employee
            </button>
            <button className="attendance-button" onClick={handleAttendanceClick}>
              View Attendance List
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, department, or position"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <table className="employees-table">
          <thead>
            <tr>
              <th>ID#</th>
              <th>Profile Picture</th>
              <th>Full Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Type</th>
              <th>Status</th>
              <th>Location</th>
              <th>Contacts</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employeesToShow.map((employee) => (
              <tr key={employee.employee_id}>
                <td>{employee.employee_id}</td>
                <td>
                  {employee.profile_picture ? (
                    <img
                      src={
                        employee.profile_picture.startsWith("http://") ||
                        employee.profile_picture.startsWith("https://")
                          ? employee.profile_picture
                          : `http://localhost:8000${employee.profile_picture}`
                      }
                      alt="Profile"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/50";
                        e.target.alt = "Fallback";
                      }}
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/50"
                      alt="Fallback"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </td>
                <td>{employee.full_name}</td>
                <td>{employee.position}</td>
                <td>{employee.department}</td>
                <td>{employee.type}</td>
                <td>{employee.status}</td>
                <td>{employee.location}</td>
                <td>{employee.contacts}</td>
                <td>
                  <div className="dropdown">
                    <button className="dropbtn">⋮</button>
                    <div className="dropdown-content">
                      <button onClick={() => handleEdit(employee)}>Edit</button>
                      <button onClick={() => handleDelete(employee.employee_id)}>Delete</button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Entries Display Dropdown */}
        <div className="entries-display">
          <label htmlFor="entries">Show</label>
          <select id="entries" value={entriesToShow} onChange={handleEntriesChange}>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>entries</span>
        </div>

        {/* Pagination Controls */}
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Employees;