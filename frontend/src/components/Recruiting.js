import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Recruiting.css";

const Recruiting = () => {
  const [photo, setPhoto] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [positionApplied, setPositionApplied] = useState("");
  const [pdfFile, setPdfFile] = useState(null); // State for PDF file
  const [pdfPreview, setPdfPreview] = useState(null); // Preview PDF link
  const [recruits, setRecruits] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [recruitId, setRecruitId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecruits, setFilteredRecruits] = useState([]);
  const [entriesToShow, setEntriesToShow] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecruits();
  }, []);

  const fetchRecruits = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/recruits/");
      setRecruits(response.data);
      setFilteredRecruits(response.data);
    } catch (error) {
      console.error("Error fetching recruits:", error);
    }
  };

  const filterRecruits = () => {
    const query = searchQuery.toLowerCase();
    const filtered = recruits.filter((recruit) =>
      recruit.first_name.toLowerCase().includes(query) ||
      recruit.middle_name.toLowerCase().includes(query) ||
      recruit.last_name.toLowerCase().includes(query) ||
      recruit.address.toLowerCase().includes(query) ||
      recruit.email.toLowerCase().includes(query) ||
      recruit.phone_number.includes(query) ||
      recruit.position_applied.toLowerCase().includes(query)
    );
    setFilteredRecruits(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
  
      const formData = new FormData();
  
      // Only append the photo if a new one is selected
      if (photo) {
          formData.append("photo", photo);
      }
  
      formData.append("first_name", firstName);
      formData.append("middle_name", middleName);
      formData.append("last_name", lastName);
      formData.append("birthday", birthday);
      formData.append("address", address);
      formData.append("email", email);
      formData.append("phone_number", phoneNumber);
      formData.append("gender", gender);
      formData.append("position_applied", positionApplied);
  
      // Only append the PDF if a new one is selected
      if (pdfFile) {
          formData.append("pdf_file", pdfFile);
      }
  
      try {
          if (editMode) {
              await axios.put(`http://localhost:8000/api/recruits/${recruitId}/`, formData, {
                  headers: {
                      "Content-Type": "multipart/form-data",
                  },
              });
          } else {
              await axios.post("http://localhost:8000/api/recruits/", formData, {
                  headers: {
                      "Content-Type": "multipart/form-data",
                  },
              });
          }
  
          // Fetch the updated recruits list
          fetchRecruits();
  
          // Reset the form fields
          resetFormFields();
  
          // Close the modal
          setShowModal(false);
  
      } catch (error) {
          console.error("Error saving recruit:", error);
  
          // Optionally handle specific error cases
          if (error.response) {
              // The request was made, and the server responded with a status code
              console.error("Response data:", error.response.data);
              console.error("Response status:", error.response.status);
          } else if (error.request) {
              // The request was made, but no response was received
              console.error("Request data:", error.request);
          } else {
              // Something happened in setting up the request that triggered an error
              console.error("Error message:", error.message);
          }
      }
  };  

  const handleEdit = (recruit) => {
    setRecruitId(recruit.id);
    setPhoto(null);
    setFirstName(recruit.first_name);
    setMiddleName(recruit.middle_name);
    setLastName(recruit.last_name);
    setBirthday(recruit.birthday);
    setAddress(recruit.address);
    setEmail(recruit.email);
    setPhoneNumber(recruit.phone_number);
    setGender(recruit.gender);
    setPositionApplied(recruit.position_applied);
    setPdfFile(null);
    setPdfPreview(recruit.pdf_file ? `http://localhost:8000${recruit.pdf_file}` : null);
    setPhotoPreview(recruit.photo ? `http://localhost:8000${recruit.photo}` : null);
    setEditMode(true);
    setShowModal(true);
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/recruits/${id}/`);
      fetchRecruits();
    } catch (error) {
      console.error("Error deleting recruit:", error);
    }
  };

  const handleAddRecruit = () => {
    resetFormFields();
    setEditMode(false);
    setShowModal(true);
  };

  const resetFormFields = () => {
    setPhoto(null);
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setBirthday("");
    setAddress("");
    setEmail("");
    setPhoneNumber("");
    setGender("");
    setPositionApplied("");
    setPdfFile(null);
    setPdfPreview(null);
    setRecruitId(null);
    setPhotoPreview(null);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
    setPdfPreview(URL.createObjectURL(file)); // This will create a preview link for the PDF
  };

  const handleEntriesChange = (e) => {
    setEntriesToShow(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleViewResume = (recruit) => {
    if (recruit.pdf_file) {
      const pdfUrl = recruit.pdf_file.startsWith("http")
        ? recruit.pdf_file
        : `http://localhost:8000${recruit.pdf_file}`;
      window.open(pdfUrl, "_blank");
    }
  };

  const totalPages = Math.ceil(filteredRecruits.length / entriesToShow);
  const startIndex = (currentPage - 1) * entriesToShow;
  const endIndex = startIndex + entriesToShow;
  const recruitsToShow = filteredRecruits.slice(startIndex, endIndex);

  return (
    <div className="employees-page">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="exit-button" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h2>{editMode ? "Edit Recruit" : "New Recruit"}</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="photo">Photo</label>
                  <input
                    type="file"
                    id="photo"
                    onChange={handlePhotoChange}
                  />
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt={`${firstName} ${lastName}`}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginTop: "10px",
                      }}
                    />
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter First Name"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="middleName">Middle Name</label>
                  <input
                    type="text"
                    id="middleName"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    placeholder="Enter Middle Name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter Last Name"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="birthday">Birthday</label>
                  <input
                    type="date"
                    id="birthday"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter Address"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="number"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter Phone Number"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="positionApplied">Position Applied</label>
                  <input
                    type="text"
                    id="positionApplied"
                    value={positionApplied}
                    onChange={(e) => setPositionApplied(e.target.value)}
                    placeholder="Enter Position Applied"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pdfFile">Resume/CV (PDF)</label>
                  <input
                    type="file"
                    id="pdfFile"
                    accept=".pdf"
                    onChange={handlePdfChange}
                  />
                  {pdfPreview && (
                    <a
                      href={pdfPreview}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "block", marginTop: "10px", color: "#007bff" }}
                    >
                      View Uploaded PDF
                    </a>
                  )}
                </div>
              </div>
              <button type="submit" className="submit-button">
                {editMode ? "Save Changes" : "Add Recruit"}
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
          <h2>Recruit List</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search recruits..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button className="search-button" onClick={filterRecruits}>
              Search
            </button>
          </div>
          <div className="button-group">
            <button className="add-button" onClick={handleAddRecruit}>
              Add Recruit
            </button>
          </div>
        </div>

        <table className="employees-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Last Name</th>
              <th>Birthday</th>
              <th>Address</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Gender</th>
              <th>Position Applied</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recruitsToShow.map((recruit) => (
              <tr key={recruit.id}>
                <td>
                  {recruit.photo ? (
                    <img
                      src={
                        recruit.photo.startsWith("http://") || recruit.photo.startsWith("https://")
                          ? recruit.photo
                          : `http://localhost:8000${recruit.photo}`
                      }
                      alt={`${recruit.first_name} ${recruit.last_name}`}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/50"
                      alt={`${recruit.first_name} ${recruit.last_name}`}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </td>
                <td>{recruit.first_name}</td>
                <td>{recruit.middle_name}</td>
                <td>{recruit.last_name}</td>
                <td>{recruit.birthday}</td>
                <td>{recruit.address}</td>
                <td>{recruit.email}</td>
                <td>{recruit.phone_number}</td>
                <td>{recruit.gender}</td>
                <td>{recruit.position_applied}</td>
                <td>
                  <div className="dropdown">
                    <button className="dropbtn">⋮</button>
                    <div className="dropdown-content">
                      <button onClick={() => handleEdit(recruit)}>Edit</button>
                      <button onClick={() => handleDelete(recruit.id)}>Delete</button>
                      <button
    onClick={() => handleViewResume(recruit)}
    disabled={!recruit.pdf_file}
    className={!recruit.pdf_file ? "disabled-button" : ""}
  >
    View Resume
  </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="entries-display">
          <label htmlFor="entries">Show</label>
          <select id="entries" value={entriesToShow} onChange={handleEntriesChange}>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>entries</span>
        </div>

        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
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

export default Recruiting;
