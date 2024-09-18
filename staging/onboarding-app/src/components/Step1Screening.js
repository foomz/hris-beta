// src/components/Step1Screening.js
import React, { useState } from 'react';
import './Step1Screening.css'; // Import your CSS file

const Step1Screening = ({ formData, onNext, onSave }) => {
    const [skills, setSkills] = useState(formData.skills);
    const [workExperience, setWorkExperience] = useState(formData.workExperience);

    const handleSave = () => {
        onSave({ skills, workExperience });
    };

    return (
        <div className="step-screening">
            <h2>Step 1: Screening</h2>
            <label>
                Skills:
                <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                />
            </label>
            <label>
                Work Experience:
                <input
                    type="text"
                    value={workExperience}
                    onChange={(e) => setWorkExperience(e.target.value)}
                />
            </label>
            <div className="buttons">
                <button onClick={handleSave}>Save</button>
                <button onClick={onNext}>Next</button>
            </div>
        </div>
    );
};

export default Step1Screening;
