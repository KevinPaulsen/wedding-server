import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'react-bootstrap';
import "../../../styles/Table.css"
import {FaTrash} from "react-icons/fa";
import {useDeleteRsvp} from "../../../hooks/useDeleteRsvp";
import LoadingSpinner from "../LoadingSpinner";
import RsvpInfoCard from "./RsvpInfoCard";

const RsvpTableRow = ({rsvp}) => {
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
                <td>{rsvp.primaryContact ? rsvp.primaryContact.name : rsvp.lastNames}</td>
                <td>{rsvp.rsvpCode}</td>
                <td>{rsvp.allowedGuestCount}</td>
                <td>{rsvp.guestCount}</td>
                <td className="align-middle">
                    {loading ? <LoadingSpinner /> : <Button
                        variant="link"
                        className="p-0"
                        onClick={() => handleDeleteGuest(rsvp.rsvpCode)}>
                        <FaTrash size={20} color="var(--main-dark)"/>
                    </Button>
                    }
                </td>
            </tr>

            {/* Expanded Content Row */}
            {isExpanded && (
                <tr className="no-hover">
                    <td colSpan="100%"> {/* Ensure it spans all columns */}
                        <RsvpInfoCard rsvp={rsvp} />
                    </td>
                </tr>
            )}
        </>
    );
};

RsvpTableRow.propTypes = {
    rsvp: PropTypes.shape({
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
