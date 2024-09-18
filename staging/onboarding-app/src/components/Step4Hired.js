// src/components/Step4Hired.js
import React, { useState } from 'react';

const Step4Hired = ({ formData, onSave, onPrev }) => {
    const [hiredDetails, setHiredDetails] = useState(formData.hiredDetails);

    const handleSave = () => {
        onSave({ hiredDetails });
    };

    return (
        <div className="step-hired">
            <h2>Step 4: Hired</h2>
            <h3>Review All Applicant Information</h3>
            {/* Display all data from Step 1, Step 2, and Step 3 */}
            {/* ... */}
            <label>
                Hired Manager Name:
                <input
                    type="text"
                    value={hiredDetails.managerName}
                    onChange={(e) => setHiredDetails({
                        ...hiredDetails,
                        managerName: e.target.value
                    })}
                />
            </label>
            <label>
                Hired Date:
                <input
                    type="date"
                    value={hiredDetails.hireDate}
                    onChange={(e) => setHiredDetails({
                        ...hiredDetails,
                        hireDate: e.target.value
                    })}
                />
            </label>

            <div className="buttons">
                <button onClick={onPrev}>Back</button>
                <button onClick={handleSave}>Save</button>
            </div>
        </div>
    );
};

export default Step4Hired;
