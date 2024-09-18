import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Onboarding.css";

const Onboarding = () => {
  const [recruits, setRecruits] = useState([]);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedRecruit, setSelectedRecruit] = useState(null);
  const [progressStage, setProgressStage] = useState(0);
  const [formData, setFormData] = useState({
    skills: "",
    rate: "",
    workExperience: "",
    socialMedia1: "",
    socialMedia2: "",
    hasPendingCases: false,
    pendingCaseDetails: "",
    fatherName: "",
    fatherAddress: "",
    fatherOccupation: "",
    motherName: "",
    motherAddress: "",
    motherOccupation: "",
    siblingName: "",
    siblingAddress: "",
    siblingOccupation: "",
    religion: "",
    passedInterview: false,
    interviewManager: "",
    hiringManager: "",
    hiringDate: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchRecruits();
  }, []);

  const fetchRecruits = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/recruits/");
      setRecruits(response.data);
    } catch (error) {
      console.error("Error fetching recruits:", error);
    }
  };

  const handleProgressClick = async (recruit) => {
    setSelectedRecruit(recruit);
    setProgressStage(recruit.progress_stage || 0);
  
    try {
      // Fetch recruit's stored data from the backend
      const response = await axios.get(`http://localhost:8000/api/recruits/${recruit.id}/`);
      const recruitData = response.data;

      console.log("Fetched recruit data:", recruitData);
      console.log("Updated formData:", formData);

  
      // Set the state with the recruit's data
      setFormData({
        skills: recruitData.skills || "",
        rate: recruitData.rate || "",
        workExperience: recruitData.work_experience || "",
        socialMedia1: recruitData.social_media_1 || "",
        socialMedia2: recruitData.social_media_2 || "",
        hasPendingCases: recruitData.has_pending_cases || false,
        pendingCaseDetails: recruitData.pending_case_details || "",
        fatherName: recruitData.father_name || "",
        fatherAddress: recruitData.father_address || "",
        fatherOccupation: recruitData.father_occupation || "",
        motherName: recruitData.mother_name || "",
        motherAddress: recruitData.mother_address || "",
        motherOccupation: recruitData.mother_occupation || "",
        siblingName: recruitData.sibling_name || "",
        siblingAddress: recruitData.sibling_address || "",
        siblingOccupation: recruitData.sibling_occupation || "",
        religion: recruitData.religion || "",
        passedInterview: recruitData.passed_interview || false,
        interviewManager: recruitData.interview_manager || "",
        hiringManager: recruitData.hiring_manager || "",
        hiringDate: recruitData.hiring_date || ""
      });
  
      setShowProgressModal(true);
    } catch (error) {
      console.error("Error fetching recruit data:", error);
    }
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSaveData = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/recruits/${selectedRecruit.id}/progress/`,
        formData
      );
      console.log("Data Saved:", response.data);
      alert("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleNextStage = async () => {
    await handleSaveData();
  
    if (progressStage < 3) {
      setProgressStage(progressStage + 1);
    } else {
      // Update formData to display the final saved data
      setFormData({
        // ... final values
      });
      alert('Onboarding process completed!');
      setShowProgressModal(false);
    }
  };
  const handleBackStage = () => {
    if (progressStage > 0) {
      setProgressStage(progressStage - 1);
    }
  };

  const handleCloseModal = () => {
    setShowProgressModal(false);
    setSelectedRecruit(null);
    setFormData({
      skills: "",
      rate: "",
      workExperience: "",
      socialMedia1: "",
      socialMedia2: "",
      hasPendingCases: false,
      pendingCaseDetails: "",
      fatherName: "",
      fatherAddress: "",
      fatherOccupation: "",
      motherName: "",
      motherAddress: "",
      motherOccupation: "",
      siblingName: "",
      siblingAddress: "",
      siblingOccupation: "",
      religion: "",
      passedInterview: false,
      interviewManager: "",
      hiringManager: "",
      hiringDate: ""
    });
  };

  return (
    <div className="onboarding-page">
      {showProgressModal && selectedRecruit && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="exit-button" onClick={handleCloseModal}>
              ×
            </button>
            <h2>
              {selectedRecruit.first_name} {selectedRecruit.last_name}
            </h2>
            <div className="progress-bar">
              <div className={`progress-step ${progressStage >= 0 ? "active" : ""}`}>
                <span>1. Screening</span>
                {progressStage > 0 && <span className="checkmark">✓</span>}
              </div>
              <div className={`progress-step ${progressStage >= 1 ? "active" : ""}`}>
                <span>2. Background Check</span>
                {progressStage > 1 && <span className="checkmark">✓</span>}
              </div>
              <div className={`progress-step ${progressStage >= 2 ? "active" : ""}`}>
                <span>3. Final Interview</span>
                {progressStage > 2 && <span className="checkmark">✓</span>}
              </div>
              <div className={`progress-step ${progressStage >= 3 ? "active" : ""}`}>
                <span>4. Hired</span>
                {progressStage > 3 && <span className="checkmark">✓</span>}
              </div>
            </div>

            <form>
              {progressStage === 0 && (
                <div className="screening-form">
                  <h3>Screening</h3>
                  <div className="form-group">
                    <label htmlFor="skills">Skills</label>
                    <input
                      type="text"
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      placeholder="Enter skills"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="rate">Rate</label>
                    <input
                      type="text"
                      id="rate"
                      name="rate"
                      value={formData.rate}
                      onChange={handleInputChange}
                      placeholder="Enter rate"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="workExperience">Work Experience</label>
                    <textarea
                      id="workExperience"
                      name="workExperience"
                      value={formData.workExperience}
                      onChange={handleInputChange}
                      placeholder="Enter work experience"
                    />
                  </div>
                </div>
              )}

              {progressStage === 1 && (
                <div className="background-check-form">
                  <h3>Background Check</h3>
                  <div className="form-group">
                    <label htmlFor="socialMedia1">Social Media Account 1</label>
                    <input
                      type="text"
                      id="socialMedia1"
                      name="socialMedia1"
                      value={formData.socialMedia1}
                      onChange={handleInputChange}
                      placeholder="Enter social media account"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="socialMedia2">Social Media Account 2</label>
                    <input
                      type="text"
                      id="socialMedia2"
                      name="socialMedia2"
                      value={formData.socialMedia2}
                      onChange={handleInputChange}
                      placeholder="Enter social media account"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="hasPendingCases">
                      <input
                        type="checkbox"
                        id="hasPendingCases"
                        name="hasPendingCases"
                        checked={formData.hasPendingCases}
                        onChange={handleInputChange}
                      />
                      Has Pending Cases?
                    </label>
                    {formData.hasPendingCases && (
                      <input
                        type="text"
                        id="pendingCaseDetails"
                        name="pendingCaseDetails"
                        value={formData.pendingCaseDetails}
                        onChange={handleInputChange}
                        placeholder="Enter pending case details"
                      />
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="fatherName">Father's Name</label>
                    <input
                      type="text"
                      id="fatherName"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      placeholder="Enter father's name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="fatherAddress">Father's Address</label>
                    <input
                      type="text"
                      id="fatherAddress"
                      name="fatherAddress"
                      value={formData.fatherAddress}
                      onChange={handleInputChange}
                      placeholder="Enter father's address"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="fatherOccupation">Father's Occupation</label>
                    <input
                      type="text"
                      id="fatherOccupation"
                      name="fatherOccupation"
                      value={formData.fatherOccupation}
                      onChange={handleInputChange}
                      placeholder="Enter father's occupation"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="motherName">Mother's Name</label>
                    <input
                      type="text"
                      id="motherName"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleInputChange}
                      placeholder="Enter mother's name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="motherAddress">Mother's Address</label>
                    <input
                      type="text"
                      id="motherAddress"
                      name="motherAddress"
                      value={formData.motherAddress}
                      onChange={handleInputChange}
                      placeholder="Enter mother's address"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="motherOccupation">Mother's Occupation</label>
                    <input
                      type="text"
                      id="motherOccupation"
                      name="motherOccupation"
                      value={formData.motherOccupation}
                      onChange={handleInputChange}
                      placeholder="Enter mother's occupation"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="siblingName">Sibling's Name</label>
                    <input
                      type="text"
                      id="siblingName"
                      name="siblingName"
                      value={formData.siblingName}
                      onChange={handleInputChange}
                      placeholder="Enter sibling's name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="siblingAddress">Sibling's Address</label>
                    <input
                      type="text"
                      id="siblingAddress"
                      name="siblingAddress"
                      value={formData.siblingAddress}
                      onChange={handleInputChange}
                      placeholder="Enter sibling's address"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="siblingOccupation">Sibling's Occupation</label>
                    <input
                      type="text"
                      id="siblingOccupation"
                      name="siblingOccupation"
                      value={formData.siblingOccupation}
                      onChange={handleInputChange}
                      placeholder="Enter sibling's occupation"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="religion">Religion</label>
                    <select
                      id="religion"
                      name="religion"
                      value={formData.religion}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Religion</option>
                      <option value="Catholic">Catholic</option>
                      <option value="Roman Catholic">Roman Catholic</option>
                      <option value="INC">INC</option>
                      <option value="Jehova">Jehova</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              )}

              {progressStage === 2 && (
                <div className="final-interview-form">
                  <h3>Final Interview</h3>
                  <div className="form-group">
                    <label>Skills</label>
                    <p>{formData.skills}</p>
                  </div>
                  <div className="form-group">
                    <label>Rate</label>
                    <p>{formData.rate}</p>
                  </div>
                  <div className="form-group">
                    <label>Work Experience</label>
                    <p>{formData.workExperience}</p>
                  </div>
                  <div className="form-group">
                    <label>Social Media Account 1</label>
                    <p>{formData.socialMedia1}</p>
                  </div>
                  <div className="form-group">
                    <label>Social Media Account 2</label>
                    <p>{formData.socialMedia2}</p>
                  </div>
                  <div className="form-group">
                    <label>Has Pending Cases?</label>
                    <p>{formData.hasPendingCases ? "Yes" : "No"}</p>
                  </div>
                  {formData.hasPendingCases && (
                    <div className="form-group">
                      <label>Pending Case Details</label>
                      <p>{formData.pendingCaseDetails}</p>
                    </div>
                  )}
                  <div className="form-group">
                    <label>Father's Name</label>
                    <p>{formData.fatherName}</p>
                  </div>
                  <div className="form-group">
                    <label>Father's Address</label>
                    <p>{formData.fatherAddress}</p>
                  </div>
                  <div className="form-group">
                    <label>Father's Occupation</label>
                    <p>{formData.fatherOccupation}</p>
                  </div>
                  <div className="form-group">
                    <label>Mother's Name</label>
                    <p>{formData.motherName}</p>
                  </div>
                  <div className="form-group">
                    <label>Mother's Address</label>
                    <p>{formData.motherAddress}</p>
                  </div>
                  <div className="form-group">
                    <label>Mother's Occupation</label>
                    <p>{formData.motherOccupation}</p>
                  </div>
                  <div className="form-group">
                    <label>Sibling's Name</label>
                    <p>{formData.siblingName}</p>
                  </div>
                  <div className="form-group">
                    <label>Sibling's Address</label>
                    <p>{formData.siblingAddress}</p>
                  </div>
                  <div className="form-group">
                    <label>Sibling's Occupation</label>
                    <p>{formData.siblingOccupation}</p>
                  </div>
                  <div className="form-group">
                    <label>Religion</label>
                    <p>{formData.religion}</p>
                  </div>
                  <div className="form-group">
                    <label>Interview Result</label>
                    <label>
                      <input
                        type="radio"
                        name="passedInterview"
                        value="passed"
                        checked={formData.passedInterview === true}
                        onChange={() => setFormData({ ...formData, passedInterview: true })}
                      />
                      Passed
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="passedInterview"
                        value="failed"
                        checked={formData.passedInterview === false}
                        onChange={() => setFormData({ ...formData, passedInterview: false })}
                      />
                      Failed
                    </label>
                  </div>
                </div>
              )}

              {progressStage === 3 && (
                <div className="hired-form">
                  <h3>Hired</h3>
                  <div className="form-group">
                    <label>Skills</label>
                    <p>{formData.skills}</p>
                  </div>
                  <div className="form-group">
                    <label>Rate</label>
                    <p>{formData.rate}</p>
                  </div>
                  <div className="form-group">
                    <label>Work Experience</label>
                    <p>{formData.workExperience}</p>
                  </div>
                  <div className="form-group">
                    <label>Social Media Account 1</label>
                    <p>{formData.socialMedia1}</p>
                  </div>
                  <div className="form-group">
                    <label>Social Media Account 2</label>
                    <p>{formData.socialMedia2}</p>
                  </div>
                  <div className="form-group">
                    <label>Has Pending Cases?</label>
                    <p>{formData.hasPendingCases ? "Yes" : "No"}</p>
                  </div>
                  {formData.hasPendingCases && (
                    <div className="form-group">
                      <label>Pending Case Details</label>
                      <p>{formData.pendingCaseDetails}</p>
                    </div>
                  )}
                  <div className="form-group">
                    <label>Father's Name</label>
                    <p>{formData.fatherName}</p>
                  </div>
                  <div className="form-group">
                    <label>Father's Address</label>
                    <p>{formData.fatherAddress}</p>
                  </div>
                  <div className="form-group">
                    <label>Father's Occupation</label>
                    <p>{formData.fatherOccupation}</p>
                  </div>
                  <div className="form-group">
                    <label>Mother's Name</label>
                    <p>{formData.motherName}</p>
                  </div>
                  <div className="form-group">
                    <label>Mother's Address</label>
                    <p>{formData.motherAddress}</p>
                  </div>
                  <div className="form-group">
                    <label>Mother's Occupation</label>
                    <p>{formData.motherOccupation}</p>
                  </div>
                  <div className="form-group">
                    <label>Sibling's Name</label>
                    <p>{formData.siblingName}</p>
                  </div>
                  <div className="form-group">
                    <label>Sibling's Address</label>
                    <p>{formData.siblingAddress}</p>
                  </div>
                  <div className="form-group">
                    <label>Sibling's Occupation</label>
                    <p>{formData.siblingOccupation}</p>
                  </div>
                  <div className="form-group">
                    <label>Religion</label>
                    <p>{formData.religion}</p>
                  </div>

                  <div className="form-group">
                    <label>Interview Result</label>
                    <p>{formData.passedInterview ? "Passed" : "Failed"}</p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="interviewManager">Interview Manager</label>
                    <input
                      type="text"
                      id="interviewManager"
                      name="interviewManager"
                      value={formData.interviewManager}
                      onChange={handleInputChange}
                      placeholder="Enter Interview Manager's full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="hiringManager">Hiring Manager</label>
                    <input
                      type="text"
                      id="hiringManager"
                      name="hiringManager"
                      value={formData.hiringManager}
                      onChange={handleInputChange}
                      placeholder="Enter Hiring Manager's full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="hiringDate">Hiring Date</label>
                    <input
                      type="date"
                      id="hiringDate"
                      name="hiringDate"
                      value={formData.hiringDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              <div className="form-actions">
                {progressStage > 0 && (
                  <button className="back-button" type="button" onClick={handleBackStage}>
                    Back
                  </button>
                )}
                <button className="save-button" type="button" onClick={handleSaveData}>
                  Save
                </button>
                <button className="next-stage-button" type="button" onClick={handleNextStage}>
                  {progressStage < 3 ? "Next Step" : "Complete"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="data-container">
        <button className="back-button" onClick={() => navigate("/welcome")}>
          Back to Dashboard
        </button>
        <div className="header-container">
          <h2>Onboarding Progress</h2>
        </div>

        <table className="employees-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Position Applied</th>
              <th>Onboarding Progress</th>
            </tr>
          </thead>
          <tbody>
            {recruits.map((recruit) => (
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
                <td>{recruit.last_name}</td>
                <td>{recruit.position_applied}</td>
                <td>
                  <button
                    className="progress-button"
                    onClick={() => handleProgressClick(recruit)}
                  >
                    {getProgressLabel(recruit.progress_stage)} ({recruit.progress_stage + 1}/4)
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Onboarding;