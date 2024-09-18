import React from 'react';
import OnboardingPage from './components/OnboardingPage';
import ProgressBar from './components/ProgressBar'; 
import Step1Screening from './components/Step1Screening'; 
import Step2BackgroundCheck from './components/Step2BackgroundCheck'; 
import Step3FinalInterview from './components/Step3FinalInterview'; 
import Step4Hired from './components/Step4Hired'; 

function App() {
    return (
        <div className="App">
            <OnboardingPage />
            <ProgressBar />
            <Step1Screening />
            <Step2BackgroundCheck />
            <Step3FinalInterview />
            <Step4Hired />
        </div>
    );
}

export default App;
