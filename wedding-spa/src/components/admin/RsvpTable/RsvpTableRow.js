import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Card} from 'react-bootstrap';
import PrimaryContactInfo from './PrimaryContactInfo';
import GuestsDetails from './GuestsDetails';

const RsvpTableRow = ({ item }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleRowExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <>
            {/* Main Row */}
            <tr onClick={toggleRowExpansion}>
                <td>{item.primaryContact.name}</td>
                <td>{item.rsvpCode}</td>
                <td>{item.allowedGuestCount}</td>
                <td>{item.guestCount}</td>
            </tr>

            {/* Expanded Content Row */}
            {isExpanded && (
                <tr className="no-hover">
                    <td colSpan="4">
                        <Card className="p-3">
                            <Row>
                                {/* Primary Contact Section */}
                                <Col xs={12} md={4} className="text-center mb-4">
                                    <PrimaryContactInfo primaryContact={item.primaryContact} />
                                </Col>

                                {/* Guests Section */}
                                <Col xs={12} md={8}>
                                    <GuestsDetails guests={item.rsvpGuestDetails} />
                                </Col>
                            </Row>
                        </Card>
                    </td>
                </tr>
            )}
        </>
    );
};

RsvpTableRow.propTypes = {
    item: PropTypes.shape({
        primaryContact: PropTypes.shape({
            name: PropTypes.string.isRequired,
            email: PropTypes.string,
            phoneNumber: PropTypes.string,
            address: PropTypes.string,
        }).isRequired,
        rsvpCode: PropTypes.string.isRequired,
        allowedGuestCount: PropTypes.number.isRequired,
        guestCount: PropTypes.number.isRequired,
        rsvpGuestDetails: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                foodOption: PropTypes.string,
                dietaryRestrictions: PropTypes.string,
                other: PropTypes.string,
            })
        ).isRequired,
    }).isRequired,
};

export default RsvpTableRow;
