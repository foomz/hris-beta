// src/components/Step3FinalInterview.js
import React, { useState } from 'react';

const Step3FinalInterview = ({ formData, onNext, onSave, onPrev }) => {
    const [interviewDetails, setInterviewDetails] = useState(formData.interview);

    const handleSave = () => {
        onSave({ interview: interviewDetails });
    };

    return (
        <div className="step-final-interview">
            <h2>Step 3: Final Interview</h2>
            <h3>Review Applicant Information</h3>
            {/* Display data from Step 1 and Step 2 */}
            <p><strong>Skills:</strong> {formData.skills}</p>
            <p><strong>Work Experience:</strong> {formData.workExperience}</p>
            <p><strong>Social Media Accounts:</strong> {formData.socialMediaAccounts.join(', ')}</p>
            {/* Display family details */}
            {/* ... */}

            <label>
                Interview Manager Name:
                <input
                    type="text"
                    value={interviewDetails.managerName}
                    onChange={(e) => setInterviewDetails({
                        ...interviewDetails,
                        managerName: e.target.value
                    })}
                />
            </label>
            <label>
                Interview Date:
                <input
                    type="date"
                    value={interviewDetails.interviewDate}
                    onChange={(e) => setInterviewDetails({
                        ...interviewDetails,
                        interviewDate: e.target.value
                    })}
                />
            </label>

            <div className="buttons">
                <button onClick={onPrev}>Back</button>
                <button onClick={handleSave}>Save</button>
                <button onClick={onNext}>Next</button>
            </div>
        </div>
    );
};

export default Step3FinalInterview;
