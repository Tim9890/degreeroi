import React from 'react';

function CareerAdviceInfo({ careerAdviceData }) {
    if (!careerAdviceData) return null;

    return (
        <div className="career-advice-info">
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
        </div>
    );
}

export default CareerAdviceInfo;