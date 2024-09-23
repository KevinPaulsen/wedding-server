import React from 'react';

const Schedule = () => {
    const schedule = [
        { time: '10:00 AM', event: 'Mass' },
        { time: '5:00 PM', event: 'Cocktail' },
        { time: '6:30 PM', event: 'Dinner' },
        { time: '8:00 PM', event: 'Dance' },
    ];

    return (
        <div className="bg-dark text-white py-4">
            <h3 className="text-center mb-4">Schedule</h3>
            <div className="container d-flex justify-content-around">
                {schedule.map((item, index) => (
                    <div key={index} className="text-center">
                        <h5>{item.time}</h5>
                        <p>{item.event}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Schedule;

