// components/PrimaryContactInfo.js
import React from 'react';
import PropTypes from 'prop-types';

const PrimaryContactInfo = ({ primaryContact }) => (
    <div>
        <h5>Primary Contact Information</h5>
        <div className="text-start">
            <div>{primaryContact.name}</div>
            <div>{primaryContact.email}</div>
            <div>{primaryContact.phoneNumber}</div>
            <div>{primaryContact.address}</div>
        </div>
    </div>
);

PrimaryContactInfo.propTypes = {
    primaryContact: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string,
        phoneNumber: PropTypes.string,
        address: PropTypes.string,
    }).isRequired,
};

export default PrimaryContactInfo;
