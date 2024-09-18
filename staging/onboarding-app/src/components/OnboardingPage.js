// src/OnboardingPage.js
import React, { useState } from 'react';
import Step1Screening from './Step1Screening';
import Step2BackgroundCheck from './Step2BackgroundCheck';
import Step3FinalInterview from './Step3FinalInterview';
import Step4Hired from './Step4Hired';
import ProgressBar from './ProgressBar';
import './OnboardingPage.css'; // Import your CSS file

const OnboardingPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        skills: '',
        workExperience: '',
        socialMediaAccounts: [],
        familyDetails: {
            father: {},
            mother: {},
            spouse: {},
            sibling: {},
        },
        interview: {
            managerName: '',
            interviewDate: '',
            result: '',
        },
        hiredDetails: {
            managerName: '',
            hireDate: '',
        },
    });

    const handleNextStep = () => {
        if (step < 4) setStep(step + 1);
    };

    const handlePrevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleFormDataChange = (newData) => {
        setFormData({ ...formData, ...newData });
    };

    return (
        <div className="onboarding-page">
            <ProgressBar step={step} />
            <div className="step-container">
                {step === 1 && (
                    <Step1Screening
                        formData={formData}
                        onNext={handleNextStep}
                        onSave={handleFormDataChange}
                    />
                )}
                {step === 2 && (
                    <Step2BackgroundCheck
                        formData={formData}
                        onNext={handleNextStep}
                        onSave={handleFormDataChange}
                        onPrev={handlePrevStep}
                    />
                )}
                {step === 3 && (
                    <Step3FinalInterview
                        formData={formData}
                        onNext={handleNextStep}
                        onSave={handleFormDataChange}
                        onPrev={handlePrevStep}
                    />
                )}
                {step === 4 && (
                    <Step4Hired
                        formData={formData}
                        onSave={handleFormDataChange}
                        onPrev={handlePrevStep}
                    />
                )}
            </div>
        </div>
    );
};

export default OnboardingPage;
