// src/components/ProgressBar.js
import React from 'react';
import './ProgressBar.css'; // Add CSS for styling the progress bar

const ProgressBar = ({ step }) => {
    const progressPercentage = (step / 4) * 100;

    return (
        <div className="progress-bar-container">
            <div
                className="progress-bar"
                style={{ width: `${progressPercentage}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
