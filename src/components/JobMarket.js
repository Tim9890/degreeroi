import React from 'react';

function JobMarketInfo({ jobMarketData }) {
    if (!jobMarketData) return null;

    return (
        <div className="job-market-info">
            <h3>Job Market Information</h3>
            <p><strong>Field:</strong> {jobMarketData.field}</p>
            <p><strong>Current Demand:</strong> {jobMarketData.currentDemand}/10</p>
            <p><strong>Future Demand:</strong> {jobMarketData.futureDemand}/10</p>
            <p><strong>Average Salary:</strong> ${jobMarketData.averageSalary.toLocaleString()}</p>
            <p><strong>Top Employers:</strong> {jobMarketData.topEmployers.join(', ')}</p>
            <p><strong>Growth Rate:</strong> {jobMarketData.growthRate}%</p>
        </div>
    );
}

export default JobMarketInfo;