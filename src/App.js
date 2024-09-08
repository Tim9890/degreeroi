import React, { useState } from 'react';
import './styles.css';
import HomePage from './components/HomePage';
import DegreeOverview from './components/DegreeOverview';

function App() {
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [selectedDegree, setSelectedDegree] = useState('');
    const [showOverview, setShowOverview] = useState(false);

    const handleSearch = (university, degree) => {
        setSelectedUniversity(university);
        setSelectedDegree(degree);
        setShowOverview(true);
    };

    const handleBack = () => {
        setShowOverview(false);
    };

    return (
        <div className="App">
            <h1>My Degree ROI</h1>
            {!showOverview ? (
                <HomePage onSearch={handleSearch} />
            ) : (
                <DegreeOverview
                    university={selectedUniversity}
                    degree={selectedDegree}
                    onBack={handleBack}
                />
            )}
        </div>
    );
}

export default App;