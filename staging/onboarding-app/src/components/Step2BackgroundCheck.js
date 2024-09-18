// src/components/Step2BackgroundCheck.js
import React, { useState } from 'react';

const Step2BackgroundCheck = ({ formData, onNext, onSave, onPrev }) => {
    const [socialMediaAccounts, setSocialMediaAccounts] = useState(formData.socialMediaAccounts);
    const [familyDetails, setFamilyDetails] = useState(formData.familyDetails);

    const handleSave = () => {
        onSave({ socialMediaAccounts, familyDetails });
    };

    return (
        <div className="step-background-check">
            <h2>Step 2: Background Check</h2>
            {/* Social Media Accounts Input */}
            <label>
                Social Media Accounts:
                <input
                    type="text"
                    value={socialMediaAccounts.join(', ')}
                    onChange={(e) => setSocialMediaAccounts(e.target.value.split(', '))}
                />
            </label>

            {/* Family Details */}
            <h3>Family Details</h3>
            {/* Father Details */}
            <label>
                Father's Name:
                <input
                    type="text"
                    value={familyDetails.father.name || ''}
                    onChange={(e) => setFamilyDetails({
                        ...familyDetails,
                        father: { ...familyDetails.father, name: e.target.value }
                    })}
                />
            </label>
            {/* Similar inputs for Father's Address, Occupation, Mother's details, etc. */}
            {/* ... */}

            <div className="buttons">
                <button onClick={onPrev}>Back</button>
                <button onClick={handleSave}>Save</button>
                <button onClick={onNext}>Next</button>
            </div>
        </div>
    );
};

export default Step2BackgroundCheck;
