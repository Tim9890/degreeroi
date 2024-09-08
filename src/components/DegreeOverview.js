import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/config';
import './ROICalculator.css';

function DegreeOverview({ university, degree, onBack }) {
    const [universityData, setUniversityData] = useState(null);
    const [degreeData, setDegreeData] = useState(null);
    const [financialAid, setFinancialAid] = useState('');
    const [inStateROI, setInStateROI] = useState('N/A');
    const [outOfStateROI, setOutOfStateROI] = useState('N/A');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [jobMarketData, setJobMarketData] = useState(null);
    const [careerAdviceData, setCareerAdviceData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const universityDoc = doc(db, 'institutions', university);
                const degreeDoc = doc(db, 'degrees', degree);

                const [universitySnapshot, degreeSnapshot] = await Promise.all([
                    getDoc(universityDoc),
                    getDoc(degreeDoc)
                ]);

                if (universitySnapshot.exists() && degreeSnapshot.exists()) {
                    const uniData = universitySnapshot.data();
                    const degData = degreeSnapshot.data();
                    setUniversityData(uniData);
                    setDegreeData(degData);

                    // Fetch JobMarket data
                    if (degData.jobMarket) {
                        const jobMarketDoc = doc(db, 'jobMarkets', degData.jobMarket);
                        const jobMarketSnapshot = await getDoc(jobMarketDoc);
                        if (jobMarketSnapshot.exists()) {
                            setJobMarketData(jobMarketSnapshot.data());
                        }
                    }

                    // Fetch CareerAdvice data
                    if (degData.careerAdvice) {
                        const careerAdviceDoc = doc(db, 'careerAdvice', degData.careerAdvice);
                        const careerAdviceSnapshot = await getDoc(careerAdviceDoc);
                        if (careerAdviceSnapshot.exists()) {
                            setCareerAdviceData(careerAdviceSnapshot.data());
                        }
                    }
                } else {
                    throw new Error('University or degree data not found');
                }
            } catch (err) {
                setError('Error fetching data. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [university, degree]);

    const calculateROI = (tuition) => {
        const aid = parseFloat(financialAid) || 0;
        const salary = parseFloat(degreeData.averageFirstYearSalary);
        const netCost = tuition - aid;
        if (netCost <= 0) return 'Infinite';
        if (isNaN(salary) || isNaN(netCost)) return 'N/A';
        const roi = (salary / netCost) * 100;
        return roi.toFixed(2) + '%';
    };

    const handleCalculate = () => {
        if (universityData && degreeData) {
            setInStateROI(calculateROI(universityData.inStateTuition));
            setOutOfStateROI(calculateROI(universityData.outOfStateTuition));
        }
    };

    const handleFinancialAidChange = (e) => {
        setFinancialAid(e.target.value);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!universityData || !degreeData) return <div>No data available</div>;

    return (
        <div className="degree-overview-container">
            <div className="career-advice-info">
                {careerAdviceData && (
                    <>
                        <h3>Career Advice</h3>
                        <p><strong>Field:</strong> {careerAdviceData.field}</p>
                        <div>
                            <strong>Potential Job Titles:</strong>
                            <ul>
                                {careerAdviceData.potentialJobTitles.map((title, index) => (
                                    <li key={index}>{title}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <strong>Required Skills:</strong>
                            <ul>
                                {careerAdviceData.requiredSkills.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <strong>Recommended Certifications:</strong>
                            <ul>
                                {careerAdviceData.recommendedCertifications.map((cert, index) => (
                                    <li key={index}>{cert}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <strong>Career Pathways:</strong>
                            <ul>
                                {careerAdviceData.careerPathways.map((pathway, index) => (
                                    <li key={index}>{pathway}</li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </div>

            <div className="degree-overview">
                <h2>Degree Overview</h2>
                <p><strong>Institution:</strong> {universityData.Name}</p>
                <p><strong>Degree:</strong> {degreeData.Name}</p>
                <p><strong>Average First Year Salary:</strong> ${degreeData.averageFirstYearSalary.toLocaleString()}</p>
                <p><strong>In-State Tuition:</strong> ${universityData.inStateTuition.toLocaleString()}</p>
                <p><strong>Out-of-State Tuition:</strong> ${universityData.outOfStateTuition.toLocaleString()}</p>

                <div className="financial-aid-input">
                    <label htmlFor="financial-aid">Financial Aid: $</label>
                    <input
                        type="number"
                        id="financial-aid"
                        value={financialAid}
                        onChange={handleFinancialAidChange}
                        min="0"
                        max={Math.max(universityData.inStateTuition, universityData.outOfStateTuition)}
                    />
                </div>

                <button onClick={handleCalculate}>Calculate ROI</button>

                <h3>Return on Investment (ROI)</h3>
                <p><strong>In-State ROI:</strong> {inStateROI}</p>
                <p><strong>Out-of-State ROI:</strong> {outOfStateROI}</p>
            </div>

            <div className="job-market-info">
                {jobMarketData && (
                    <>
                        <h3>Job Market Information</h3>
                        <p><strong>Field:</strong> {jobMarketData['field']}</p>
                        <p><strong>Current Demand:</strong> {jobMarketData['currentDemand 1-10']}/10</p>
                        <p><strong>Future Demand:</strong> {jobMarketData['futureDemand 1-10']}/10</p>
                        <p><strong>Top Employers:</strong> {jobMarketData['topEmployers'].join(', ')}</p>
                        <p><strong>Growth Rate:</strong> {jobMarketData['growthRate %']}%</p>
                        <p><strong>Mid-Career Salary:</strong> ${jobMarketData['midCareerSalary'].toLocaleString()}</p>
                    </>
                )}
            </div>

            <button className="back-button" onClick={onBack}>Back to Search</button>
        </div>
    );


}

export default DegreeOverview;