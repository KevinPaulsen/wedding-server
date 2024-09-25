import React from 'react';
import InfoContainer from "./InfoContainer";

const WeddingDetails = () => {
    const details = [
        {header: 'Blessed Sacrament', body: '5050 8th Ave NE, Seattle, WA'},
        {header: 'Venue Location', body: 'TBD'},
        {header: 'Black Tie Optional', body: ''},
    ];

    return (
        <div className="container my-5">
            < InfoContainer title={'Wedding Details'} elements={details} />
        </div>
    );
};

export default WeddingDetails;
