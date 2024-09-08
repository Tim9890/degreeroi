import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/config';
import './HomePage.css';

function HomePage({ onSearch }) {
    const [universities, setUniversities] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [selectedDegree, setSelectedDegree] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUniversities();
    }, []);

    const fetchUniversities = async () => {
        try {
            setLoading(true);
            const universitiesCollection = collection(db, 'institutions');
            const universitiesSnapshot = await getDocs(universitiesCollection);
            const universitiesList = universitiesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUniversities(universitiesList);
        } catch (err) {
            setError('Error fetching universities. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUniversityChange = (e) => {
        const universityId = e.target.value;
        setSelectedUniversity(universityId);
        if (universityId) {
            fetchDegrees(universityId);
        } else {
            setDegrees([]);
        }
        setSelectedDegree('');
    };
// Dropdowns
    const fetchDegrees = async (universityId) => {
        try {
            setLoading(true);
            const universityDoc = doc(db, 'institutions', universityId);
            const universitySnapshot = await getDoc(universityDoc);
            if (universitySnapshot.exists()) {
                const universityData = universitySnapshot.data();
                const degreeIds = universityData.degreeIds || [];
                const degreePromises = degreeIds.map(degreeId => {
                    const degreeDoc = doc(db, 'degrees', degreeId);
                    return getDoc(degreeDoc);
                });
                const degreeSnapshots = await Promise.all(degreePromises);
                const degreesList = degreeSnapshots.map(degreeSnapshot => {
                    if (degreeSnapshot.exists()) {
                        return {
                            id: degreeSnapshot.id,
                            ...degreeSnapshot.data()
                        };
                    } else {
                        return null;
                    }
                }).filter(degree => degree !== null);
                setDegrees(degreesList);
            } else {
                throw new Error('University not found');
            }
        } catch (err) {
            setError('Error fetching degrees. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedUniversity && selectedDegree) {
            console.log('Submitting:', selectedUniversity, selectedDegree);
            onSearch(selectedUniversity, selectedDegree);
        } else {
            setError('Please select both a university and a degree.');
        }
    };



    return (
        <div className="home-page">
            <h1>Let's Make Some Good Investments</h1>
            <form onSubmit={handleSubmit}>
                <select
                    value={selectedUniversity}
                    onChange={handleUniversityChange}
                >
                    <option value="">Select a university</option>
                    {universities.map((uni) => (
                        <option key={uni.id} value={uni.id}>
                            {uni.Name} {/* Assumes your university documents have a 'name' field */}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedDegree}
                    onChange={(e) => setSelectedDegree(e.target.value)}
                    disabled={!selectedUniversity}
                >
                    <option value="">Select a degree</option>
                    {degrees.map((degree) => (
                        <option key={degree.id} value={degree.id}>
                            {degree.Name} {/* Assumes your degree documents have a 'name' field */}
                        </option>
                    ))}
                </select>

                <button type="submit">Search</button>
            </form>
            <div className="top-ten">
                <h2>Top 10 ROI Degrees</h2>
                {/* Add your top 10 ROI degrees list here */}
            </div>
        </div>
    );
}

export default HomePage;
