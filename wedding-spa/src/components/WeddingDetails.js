import React from 'react';
import '../styles/HomeElements.css'

const WeddingDetails = () => {
    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Wedding Details</h1>
            <div className="row">
                <div className="col-md-4 text-center mb-3">
                    <p className='info_element'>Blessed Sacrament</p>
                    <p className='info_element'>123 Church St, City, State</p>
                </div>
                <div className="col-md-4 text-center mb-3">
                    <p className='info_element'>Venue Location</p>
                    <p className='info_element'>456 Venue Ave, City, State</p>
                </div>
                <div className="col-md-4 text-center mb-3">
                    <p className='info_element'>Black Tie Optional</p>
                </div>
            </div>
        </div>
    );
};

export default WeddingDetails;

