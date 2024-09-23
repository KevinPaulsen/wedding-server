import React from 'react';

const WeddingDetails = () => {
    return (
        <div className="container my-5">
            <h3 className="text-center mb-4">Wedding Details</h3>
            <div className="row">
                <div className="col-md-4 text-center mb-3">
                    <h5>Blessed Sacrament</h5>
                    <p>123 Church St, City, State</p>
                </div>
                <div className="col-md-4 text-center mb-3">
                    <h5>Venue Location</h5>
                    <p>456 Venue Ave, City, State</p>
                </div>
                <div className="col-md-4 text-center mb-3">
                    <h5>Black Tie Optional</h5>
                </div>
            </div>
        </div>
    );
};

export default WeddingDetails;

