import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Processing.css"; // Use the existing CSS file for styling

const Processing = () => {
  // State variables
  const [recruits, setRecruits] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecruits, setFilteredRecruits] = useState([]);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedRecruit, setSelectedRecruit] = useState(null);
  const [progressStage, setProgressStage] = useState(0);
  const [lastViewedProgress, setLastViewedProgress] = useState({});
  const [screeningData, setScreeningData] = useState({ id: null, staffName: "", date: "" });
  const [screeningList, setScreeningList] = useState([]);
  const [backgroundCheckData, setBackgroundCheckData] = useState({
    social_media_accounts: "",
    additional_social_media_accounts: "",
    current_address: "",
    previous_addresses: "",
    mother_name: "",
    mother_address: "",
    mother_occupation: "",
    father_name: "",
    father_address: "",
    father_occupation: "",
    previous_employers: "",
    job_titles_responsibilities: "",
    dates_of_employment: "",
    reasons_for_leaving: "",
    supervisor_information: "",
    has_criminal_record: false,
    criminal_record_details: ""
  });
  const [backgroundCheckList, setBackgroundCheckList] = useState([]);
  const [finalInterviewData, setFinalInterviewData] = useState({
    passed: false,
    managerName: "",
    date: ""
  });
  const [finalInterviewList, setFinalInterviewList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
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
      recruit.middle_name?.toLowerCase().includes(query) ||
      recruit.last_name.toLowerCase().includes(query) ||
      recruit.address.toLowerCase().includes(query) ||
      recruit.position_applied.toLowerCase().includes(query)
    );
    setFilteredRecruits(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getProgressLabel = (progressStage) => {
    switch (progressStage) {
      case 0:
        return "Screening";
      case 1:
        return "Background Check";
      case 2:
        return "Final Interview";
      case 3:
        return "Hired";
      default:
        return "Unknown";
    }
  };

  const handleProgressClick = (recruit) => {
    setSelectedRecruit(recruit);
    setProgressStage(lastViewedProgress[recruit.id] || recruit.progress_stage || 0);
    setShowProgressModal(true);
    fetchScreeningData(recruit.id);
    fetchBackgroundCheckData(recruit.id);
    fetchFinalInterviewData(recruit.id); // Fetch Final Interview Data
  };

// Function to save progress to the backend
const saveProgressToBackend = async (stage) => {
  if (selectedRecruit && stage !== selectedRecruit.progress_stage) {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/recruits/${selectedRecruit.id}/`,
        { progress_stage: stage },
        {
          headers: {
            'Content-Type': 'application/json', // Ensure correct content type
          },
        }
      );
      
      // If the request was successful, update the state
      if (response.status === 200) {
        setRecruits((prevRecruits) =>
          prevRecruits.map((recruit) =>
            recruit.id === selectedRecruit.id
              ? { ...recruit, progress_stage: stage }
              : recruit
          )
        );
      } else {
        throw new Error("Failed to update progress stage");
      }
    } catch (error) {
      console.error("Error saving progress stage:", error);
      alert("Failed to save progress.");
    }
  }
};

  const handleSaveProgress = async () => {
    await saveProgressToBackend(progressStage);
    alert("Progress saved successfully!");
  };

  const handleCloseModal = async () => {
    await handleSaveProgress();
    const updatedProgress = {
      ...lastViewedProgress,
      [selectedRecruit.id]: progressStage,
    };
    setLastViewedProgress(updatedProgress);
    localStorage.setItem("lastViewedProgress", JSON.stringify(updatedProgress));
    setShowProgressModal(false);
    setSelectedRecruit(null);
    setProgressStage(0);
  };

  const handleStepClick = async (stage) => {
    setProgressStage(stage);
    await saveProgressToBackend(stage);
  };

  // Pagination logic
  const indexOfLastRecruit = currentPage * entriesPerPage;
  const indexOfFirstRecruit = indexOfLastRecruit - entriesPerPage;
  const currentRecruits = filteredRecruits.slice(indexOfFirstRecruit, indexOfLastRecruit);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleEntriesChange = (e) => setEntriesPerPage(parseInt(e.target.value));

  const totalPages = Math.ceil(filteredRecruits.length / entriesPerPage);

  const handleScreeningSubmit = async (e) => {
    e.preventDefault();
    if (screeningData.staffName && screeningData.date) {
      try {
        if (screeningData.id) {
          await axios.put(`http://localhost:8000/api/screening/${screeningData.id}/`, {
            staff_name: screeningData.staffName,
            screening_date: screeningData.date,
          });
          setScreeningList((prevList) =>
            prevList.map((record) =>
              record.id === screeningData.id
                ? { ...record, staff_name: screeningData.staffName, screening_date: screeningData.date }
                : record
            )
          );
        } else {
          const response = await axios.post(`http://localhost:8000/api/screening/`, {
            recruit: selectedRecruit.id,
            staff_name: screeningData.staffName,
            screening_date: screeningData.date,
          });
          setScreeningList([...screeningList, response.data]);
        }
        setScreeningData({ staffName: "", date: "" });
      } catch (error) {
        console.error("Error saving screening data:", error);
      }
    } else {
      console.error("Staff Name and Screening Date are required.");
    }
  };

  const fetchScreeningData = async (recruitId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/screening/?recruit_id=${recruitId}`);
      setScreeningList(response.data);
    } catch (error) {
      console.error("Error fetching screening data:", error);
    }
  };

  const handleEditScreening = (id) => {
    const selectedRecord = screeningList.find((record) => record.id === id);
    setScreeningData({ id: selectedRecord.id, staffName: selectedRecord.staff_name, date: selectedRecord.screening_date });
  };

  const handleDeleteScreening = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/screening/${id}/`);
      setScreeningList(screeningList.filter((record) => record.id !== id));
    } catch (error) {
      console.error("Error deleting screening record:", error);
    }
  };

  const handleBackgroundCheckSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        recruit: selectedRecruit.id,
        additional_social_media_accounts: backgroundCheckData.additional_social_media_accounts || "",
        ...backgroundCheckData,
      };
      if (backgroundCheckData.id) {
        await axios.put(`http://localhost:8000/api/background-check/${backgroundCheckData.id}/`, payload);
        // Update the existing record in the backgroundCheckList state
        const index = backgroundCheckList.findIndex((record) => record.id === backgroundCheckData.id);
        if (index !== -1) {
          backgroundCheckList[index] = payload;
          setBackgroundCheckList([...backgroundCheckList]);
        }
      } else {
        const response = await axios.post(`http://localhost:8000/api/background-check/`, payload);
        setBackgroundCheckList([...backgroundCheckList, response.data]);
      }
      setBackgroundCheckData({
        social_media_accounts: "",
        additional_social_media_accounts: "",
        current_address: "",
        previous_addresses: "",
        mother_name: "",
        mother_address: "",
        mother_occupation: "",
        father_name: "",
        father_address: "",
        father_occupation: "",
        previous_employers: "",
        job_titles_responsibilities: "",
        dates_of_employment: "",
        reasons_for_leaving: "",
        supervisor_information: "",
        has_criminal_record: false,
        criminal_record_details: "",
      });
    } catch (error) {
      console.error("Error saving background check data:", error);
    }
  };

  const fetchBackgroundCheckData = async (recruitId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/background-check/?recruit_id=${recruitId}`);
      setBackgroundCheckList(response.data);
    } catch (error) {
      console.error("Error fetching background check data:", error);
    }
  };

  const handleEditBackgroundCheck = (id) => {
    const selectedRecord = backgroundCheckList.find((record) => record.id === id);
    setBackgroundCheckData({ ...selectedRecord });
  };

  const handleDeleteBackgroundCheck = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/background-check/${id}/`);
      setBackgroundCheckList(backgroundCheckList.filter((record) => record.id !== id));
    } catch (error) {
      console.error("Error deleting background check record:", error);
    }
  };

  // Final Interview submit
  const handleFinalInterviewSubmit = async (e) => {
    e.preventDefault();
    const { passed, managerName, date } = finalInterviewData;

    if (managerName && date) {
      try {
        if (finalInterviewData.id) {
          // Update existing interview record
          await axios.put(`http://localhost:8000/api/final-interview/${finalInterviewData.id}/`, {
            passed: passed,
            manager_name: managerName,
            interview_date: date,
          });
          setFinalInterviewList((prevList) =>
            prevList.map((record) =>
              record.id === finalInterviewData.id
                ? { ...record, passed: passed, manager_name: managerName, interview_date: date }
                : record
            )
          );
        } else {
          // Create new interview record
          const response = await axios.post('http://localhost:8000/api/final-interview/', {
            recruit: selectedRecruit.id,
            passed: passed,
            manager_name: managerName,
            interview_date: date,
          });
          setFinalInterviewList([...finalInterviewList, response.data]);
        }
        // Reset final interview data
        setFinalInterviewData({ passed: false, managerName: "", date: "" });
      } catch (error) {
        console.error("Error saving final interview data:", error);
      }
    } else {
      console.error("Manager Name and Interview Date are required.");
    }
  };

  // Fetch final interview data for the selected recruit
  const fetchFinalInterviewData = async (recruitId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/final-interview/?recruit_id=${recruitId}`);
      setFinalInterviewList(response.data);
    } catch (error) {
      console.error("Error fetching final interview data:", error);
    }
  };

  // Edit final interview data
  const handleEditFinalInterview = (id) => {
    const selectedRecord = finalInterviewList.find((record) => record.id === id);
    if (selectedRecord) {
      setFinalInterviewData({
        id: selectedRecord.id,
        passed: selectedRecord.passed,
        managerName: selectedRecord.manager_name,
        date: selectedRecord.interview_date,
      });
    } else {
      console.error("Selected record not found.");
    }
  };

  // Delete final interview data
  const handleDeleteFinalInterview = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/final-interview/${id}/`);
      setFinalInterviewList((prevList) => prevList.filter((record) => record.id !== id));
    } catch (error) {
      console.error("Error deleting final interview record:", error);
    }
  };

  return (
    <div className="employees-page">
      <div className="data-container">
        <button className="back-button" onClick={() => navigate("/welcome")}>
          Back to Dashboard
        </button>
        <div className="header-container">
          <h2>Processing List</h2>
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
        </div>
        <table className="employees-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>Position Applied</th>
              <th>Onboarding Stage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecruits.map((recruit) => (
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
                <td>{recruit.middle_name || ""}</td>
                <td>{recruit.last_name}</td>
                <td>{recruit.address}</td>
                <td>{recruit.position_applied}</td>
                <td>{getProgressLabel(lastViewedProgress[recruit.id] || recruit.progress_stage)}</td>
                <td>
                  <button
                    className="progress-button"
                    onClick={() => handleProgressClick(recruit)}
                  >
                    {lastViewedProgress[recruit.id]
                      ? `Resume at ${getProgressLabel(lastViewedProgress[recruit.id])}`
                      : "View Progress"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="pagination-controls">
          <div className="entries-limit">
            <label>Show </label>
            <select value={entriesPerPage} onChange={handleEntriesChange}>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <label> entries</label>
          </div>
          <div className="pagination-buttons">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
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

      {showProgressModal && selectedRecruit && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="exit-button" onClick={handleCloseModal}>
              ×
            </button>
            <h2>
              {selectedRecruit.first_name} {selectedRecruit.last_name}'s Onboarding Process
            </h2>

            <div className="progress-bar">
              <div
                className={`progress-step ${progressStage >= 0 ? "active" : ""}`}
                onClick={() => handleStepClick(0)}
              >
                <span>1. Screening</span>
                {progressStage > 0 && <span className="checkmark">✓</span>}
              </div>
              <div
                className={`progress-step ${progressStage >= 1 ? "active" : ""}`}
                onClick={() => handleStepClick(1)}
              >
                <span>2. Background Check</span>
                {progressStage > 1 && <span className="checkmark">✓</span>}
              </div>
              <div
                className={`progress-step ${progressStage >= 2 ? "active" : ""}`}
                onClick={() => handleStepClick(2)}
              >
                <span>3. Final Interview</span>
                {progressStage > 2 && <span className="checkmark">✓</span>}
              </div>
              <div
                className={`progress-step ${progressStage >= 3 ? "active" : ""}`}
                onClick={() => handleStepClick(3)}
              >
                <span>4. Hired</span>
                {progressStage > 3 && <span className="checkmark">✓</span>}
              </div>
            </div>

            <div className="onboarding-form">
              <h3>{getProgressLabel(progressStage)}</h3>
              {progressStage === 0 && (
                <div>
                  <form onSubmit={handleScreeningSubmit}>
                    <label>
                      Screening Staff Name:
                      <input
                        type="text"
                        value={screeningData.staffName}
                        onChange={(e) => setScreeningData({ ...screeningData, staffName: e.target.value })}
                        required
                      />
                    </label>
                    <br />
                    <label>
                      Screening Date:
                      <input
                        type="date"
                        value={screeningData.date}
                        onChange={(e) => setScreeningData({ ...screeningData, date: e.target.value })}
                        required
                      />
                    </label>
                    <br />
                    <button type="submit">Add Screening</button>
                  </form>
                  <h4>Screening Records</h4>
                  <table className="screening-table">
                    <thead>
                      <tr>
                        <th>Staff Name</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {screeningList.map((record, index) => (
                        <tr key={index}>
                          <td>{record.staff_name}</td>
                          <td>{record.screening_date}</td>
                          <td>
                            <button onClick={() => handleEditScreening(record.id)}>Edit</button>
                            <button onClick={() => handleDeleteScreening(record.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {progressStage === 1 && (
                <div>
                  <form onSubmit={handleBackgroundCheckSubmit}>
                    <label>
                      Social Media Accounts:
                      <input style={{ width: "500px" }}
                        type="text"
                        value={backgroundCheckData.social_media_accounts}
                        onChange={(e) => setBackgroundCheckData({ ...backgroundCheckData, social_media_accounts: e.target.value })}
                      />
                    </label>
                    <br />
                    <label>
                      Additional Social Media Account:
                      <input style={{ width: "434px" }}
                        type="text"
                        value={backgroundCheckData.additional_social_media_accounts}
                        onChange={(e) =>
                          setBackgroundCheckData({ ...backgroundCheckData, additional_social_media_accounts: e.target.value })
                        }
                      />
                    </label>
                    <br />
                    <label>
                      Current Address:
                      <input style={{ width: "545px" }}
                        type="text"
                        value={backgroundCheckData.current_address}
                        onChange={(e) => setBackgroundCheckData({ ...backgroundCheckData, current_address: e.target.value })}
                      />
                    </label>
                    <br />
                    <label>
                      Previous Addresses:
                      <input style={{ width: "520px" }}
                        type="text"
                        value={backgroundCheckData.previous_addresses}
                        onChange={(e) => setBackgroundCheckData({ ...backgroundCheckData, previous_addresses: e.target.value })}
                      />
                    </label>
                    <br />
                    <label>
                      Mother Name:
                      <input style={{ width: "565px" }}
                        type="text"
                        value={backgroundCheckData.mother_name}
                        onChange={(e) => setBackgroundCheckData({ ...backgroundCheckData, mother_name: e.target.value })}
                      />
                    </label>
                    <br />
                    <label>
                      Mother Address:
                      <input style={{ width: "550px" }}
                        type="text"
                        value={backgroundCheckData.mother_address}
                        onChange={(e) => setBackgroundCheckData({ ...backgroundCheckData, mother_address: e.target.value })}
                      />
                    </label>
                    <br />
                    <label>
                      Mother Occupation:
                      <input style={{ width: "527px" }}
                        type="text"
                        value={backgroundCheckData.mother_occupation}
                        onChange={(e) => setBackgroundCheckData({ ...backgroundCheckData, mother_occupation: e.target.value })}
                      />
                    </label>
                    <br />
                    <label>
                      Father Name:
                      <input style={{ width: "570px" }}
                        type="text"
                        value={backgroundCheckData.father_name}
                        onChange={(e) => setBackgroundCheckData({ ...backgroundCheckData, father_name: e.target.value })}
                      />
                    </label>
                    <br />
                    <label>
                      Father Address:
                      <input style={{ width: "556px" }}
                        type="text"
                        value={backgroundCheckData.father_address}
                        onChange={(e) => setBackgroundCheckData({ ...backgroundCheckData, father_address: e.target.value })}
                      />
                    </label>
                    <br />
                    <label>
                      Father Occupation:
                      <input style={{ width: "533px" }}
                        type="text"
                        value={backgroundCheckData.father_occupation}
                        onChange={(e) => setBackgroundCheckData({ ...backgroundCheckData, father_occupation: e.target.value })}
                      />
                    </label>
                    <br />
                    <label>
                      Previous Employers:
                      <input style={{ width: "522px" }}
                        type="text"
                        value={backgroundCheckData.previous_employers}
                        onChange={(e) => setBackgroundCheckData({ ...backgroundCheckData, previous_employers: e.target.value })}
                      />
                    </label>
                    <br />
                    <label>
                      Job Titles and Responsibilities:
                      <input style={{ width: "450px" }}
                        type="text"
                        value={backgroundCheckData.job_titles_responsibilities}
                        onChange={(e) => setBackgroundCheckData({ ...backgroundCheckData, job_titles_responsibilities: e.target.value })}
                      />
                    </label>
                    <br />
                    <label>
                      Dates of Employment:
                      <input style={{ width: "510px" }}
                        type="text"
                        value={backgroundCheckData.dates_of_employment}
                        onChange={(e) => setBackgroundCheckData({ ...backgroundCheckData, dates_of_employment: e.target.value })}
                      />
                    </label>
                    <br />
                    <label>
                      Reasons for Leaving:
                      <input style={{ width: "516px" }}
                        type="text"
                        value={backgroundCheckData.reasons_for_leaving}
                        onChange={(e) => setBackgroundCheckData({ ...backgroundCheckData, reasons_for_leaving: e.target.value })}
                      />
                    </label>
                    <br />
                    <label>
                      Supervisor Information:
                      <input style={{ width: "503px" }}
                        type="text"
                        value={backgroundCheckData.supervisor_information}
                        onChange={(e) => setBackgroundCheckData({ ...backgroundCheckData, supervisor_information: e.target.value })}
                      />
                    </label>
                    <br />
                    <label>
                      <input
                        type="checkbox"
                        checked={backgroundCheckData.has_criminal_record}
                        onChange={(e) =>
                          setBackgroundCheckData({ ...backgroundCheckData, has_criminal_record: e.target.checked })
                        }
                      />
                      Has Criminal Record
                    </label>
                    <br />
                    {backgroundCheckData.has_criminal_record && (
                      <label>
                        Criminal Record Details:
                        <textarea style={{ width: "500px" }}
                          value={backgroundCheckData.criminal_record_details}
                          onChange={(e) =>
                            setBackgroundCheckData({ ...backgroundCheckData, criminal_record_details: e.target.value })
                          }
                        />
                      </label>
                    )}
                    <br />
                    <button type="submit">Add Background Check</button>
                  </form>

                  <h4>Background Check Records</h4>
                  {backgroundCheckList.length > 0 ? (
                    backgroundCheckList.map((record, index) => (
                      <div key={index} className="background-check-record">
                        <table className="background-check-table">
                          <tbody>
                            <tr>
                              <th>Social Media Accounts:</th>
                              <td>{record.social_media_accounts}</td>
                            </tr>
                            <tr>
                              <th>Additional Social Media Accounts:</th>
                              <td>{record.additional_social_media_accounts}</td>
                            </tr>
                            <tr>
                              <th>Current Address:</th>
                              <td>{record.current_address}</td>
                            </tr>
                            <tr>
                              <th>Previous Addresses:</th>
                              <td>{record.previous_addresses}</td>
                            </tr>
                            <tr>
                              <th>Mother Name:</th>
                              <td>{record.mother_name}</td>
                            </tr>
                            <tr>
                              <th>Mother Address:</th>
                              <td>{record.mother_address}</td>
                            </tr>
                            <tr>
                              <th>Mother Occupation:</th>
                              <td>{record.mother_occupation}</td>
                            </tr>
                            <tr>
                              <th>Father Name:</th>
                              <td>{record.father_name}</td>
                            </tr>
                            <tr>
                              <th>Father Address:</th>
                              <td>{record.father_address}</td>
                            </tr>
                            <tr>
                              <th>Father Occupation:</th>
                              <td>{record.father_occupation}</td>
                            </tr>
                            <tr>
                              <th>Previous Employers:</th>
                              <td>{record.previous_employers}</td>
                            </tr>
                            <tr>
                              <th>Job Titles and Responsibilities:</th>
                              <td>{record.job_titles_responsibilities}</td>
                            </tr>
                            <tr>
                              <th>Dates of Employment:</th>
                              <td>{record.dates_of_employment}</td>
                            </tr>
                            <tr>
                              <th>Reasons for Leaving:</th>
                              <td>{record.reasons_for_leaving}</td>
                            </tr>
                            <tr>
                              <th>Supervisor Information:</th>
                              <td>{record.supervisor_information}</td>
                            </tr>
                            <tr>
                              <th>Criminal Record:</th>
                              <td>{record.has_criminal_record ? "Yes" : "No"}</td>
                            </tr>
                            <tr>
                              <th>Criminal Record Details:</th>
                              <td>{record.criminal_record_details}</td>
                            </tr>
                            <tr>
                              <th>Actions:</th>
                              <td>
                                <button onClick={() => handleEditBackgroundCheck(record.id)}>Edit</button>
                                <button onClick={() => handleDeleteBackgroundCheck(record.id)}>Delete</button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ))
                  ) : (
                    <p>No background check records available</p>
                  )}
                </div>
              )}
             {progressStage === 2 && (
  <div>
    {/* Final Interview Form */}
    <form onSubmit={handleFinalInterviewSubmit}>
      <label>
        Interview Passed:
        <input
          type="checkbox"
          checked={finalInterviewData.passed}
          onChange={(e) =>
            setFinalInterviewData({ ...finalInterviewData, passed: e.target.checked })
          }
        />
      </label>
      <br />
      <label>
        Interview Manager Name:
        <input
          type="text"
          value={finalInterviewData.managerName}
          onChange={(e) =>
            setFinalInterviewData({ ...finalInterviewData, managerName: e.target.value })
          }
          required
        />
      </label>
      <br />
      <label>
        Interview Date:
        <input
          type="date"
          value={finalInterviewData.date}
          onChange={(e) =>
            setFinalInterviewData({ ...finalInterviewData, date: e.target.value })
          }
          required
        />
      </label>
      <br />
      <button type="submit">Save Final Interview</button>
    </form>

    {/* Final Interview Records */}
    <h4>Final Interview Records</h4>
    {finalInterviewList.length > 0 ? (
      finalInterviewList.map((record, index) => (
        <div key={index} className="final-interview-record">
          <table className="final-interview-table">
            <tbody>
              <tr>
                <th>Passed:</th>
                <td>{record.passed ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <th>Manager Name:</th>
                <td>{record.manager_name}</td>
              </tr>
              <tr>
                <th>Interview Date:</th>
                <td>{record.interview_date}</td>
              </tr>
              <tr>
                <th>Actions:</th>
                <td>
                  <button onClick={() => handleEditFinalInterview(record.id)}>Edit</button>
                  <button onClick={() => handleDeleteFinalInterview(record.id)}>Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))
    ) : (
      <p>No final interview records available</p>
    )}

    {/* Background Check Records */}
    {backgroundCheckList.length > 0 ? (
      backgroundCheckList.map((record, index) => (
        <div key={index} className="background-check-record">
          <table className="background-check-table">
            <tbody>
              <tr>
                <th>Social Media Accounts:</th>
                <td>{record.social_media_accounts}</td>
              </tr>
              <tr>
                <th>Additional Social Media Accounts:</th>
                <td>{record.additional_social_media_accounts}</td>
              </tr>
              <tr>
                <th>Current Address:</th>
                <td>{record.current_address}</td>
              </tr>
              <tr>
                <th>Previous Addresses:</th>
                <td>{record.previous_addresses}</td>
              </tr>
              <tr>
                <th>Mother Name:</th>
                <td>{record.mother_name}</td>
              </tr>
              <tr>
                <th>Mother Address:</th>
                <td>{record.mother_address}</td>
              </tr>
              <tr>
                <th>Mother Occupation:</th>
                <td>{record.mother_occupation}</td>
              </tr>
              <tr>
                <th>Father Name:</th>
                <td>{record.father_name}</td>
              </tr>
              <tr>
                <th>Father Address:</th>
                <td>{record.father_address}</td>
              </tr>
              <tr>
                <th>Father Occupation:</th>
                <td>{record.father_occupation}</td>
              </tr>
              <tr>
                <th>Previous Employers:</th>
                <td>{record.previous_employers}</td>
              </tr>
              <tr>
                <th>Job Titles and Responsibilities:</th>
                <td>{record.job_titles_responsibilities}</td>
              </tr>
              <tr>
                <th>Dates of Employment:</th>
                <td>{record.dates_of_employment}</td>
              </tr>
              <tr>
                <th>Reasons for Leaving:</th>
                <td>{record.reasons_for_leaving}</td>
              </tr>
              <tr>
                <th>Supervisor Information:</th>
                <td>{record.supervisor_information}</td>
              </tr>
              <tr>
                <th>Criminal Record:</th>
                <td>{record.has_criminal_record ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <th>Criminal Record Details:</th>
                <td>{record.criminal_record_details}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))
    ) : (
      <p>No background check records available</p>
    )}
  </div>
)}

              {progressStage === 3 && (
                <div>
                  <p>Hired details go here...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Processing;