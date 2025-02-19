// Schedule.js
import React from 'react';
import InfoContainer from "./InfoContainer";

const Schedule = () => {
    const schedule = [
        {header: '10:00 AM', body: 'Mass'},
        {header: '5:00 PM', body: 'Cocktail'},
        {header: '6:30 PM', body: 'Dinner'},
        {header: '8:00 PM', body: 'Dance'},
    ];

    return (<div className="bg-dark text-white py-5">
                <InfoContainer title={"Schedule"} elements={schedule}/>
            </div>);
};

export default Schedule;

