import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Card, Col, Row} from 'react-bootstrap';
import PrimaryContactInfo from './PrimaryContactInfo';
import GuestsDetails from './GuestsDetails';
import "../../../styles/Table.css"
import {FaTrash} from "react-icons/fa";
import {useDeleteRsvp} from "../../../hooks/useDeleteRsvp";
import LoadingSpinner from "./LoadingSpinner";

const RsvpTableRow = ({item}) => {
    const {deleteRsvp, loading, error} = useDeleteRsvp();
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleRowExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const handleDeleteGuest = async (rsvpCode) => {
        try {
            await deleteRsvp(rsvpCode);
        } catch (error) {
            console.error('Failed to delete RSVP:', error);
        }
    };

    return (
        <>
            {/* Main Row */}
            <tr onClick={toggleRowExpansion}>
                <td>{item.primaryContact.name}</td>
                <td>{item.rsvpCode}</td>
                <td>{item.allowedGuestCount}</td>
                <td>{item.guestCount}</td>
                <td className="align-middle">
                    {loading ? <LoadingSpinner /> : <Button
                        variant="link"
                        className="p-0"
                        onClick={() => handleDeleteGuest(item.rsvpCode)}>
                        <FaTrash size={20} color="var(--main-dark)"/>
                    </Button>
                    }
                </td>
            </tr>

            {/* Expanded Content Row */}
            {isExpanded && (
                <tr className="expanded-row no-hover drop-down-animation">
                    <td colSpan="5">
                        <Card className="p-3">
                            <Row className="justify-content-center">
                                {/* Primary Contact Section */}
                                <Col xs={11} md={4} className="text-center mb-4">
                                    <PrimaryContactInfo primaryContact={item.primaryContact}
                                                        lastNames={item.lastNames}/>
                                </Col>

                                {/* Guests Section */}
                                {item.guestCount > 0 ?
                                    <Col xs={12} md={8}>
                                        <GuestsDetails guests={item.rsvpGuestDetails}/>
                                    </Col> : null}
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
        lastNames: PropTypes.arrayOf(PropTypes.string),
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
