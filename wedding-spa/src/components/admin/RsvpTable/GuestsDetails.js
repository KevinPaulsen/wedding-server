import React from 'react';
import PropTypes from 'prop-types';
import {Table} from 'react-bootstrap';

const GuestsDetails = ({guests}) => (
    <div>
        <h5 className="text-center">Guests Details</h5>
        <Table size="sm">
            <thead>
            <tr>
                <th>Guest Name</th>
                <th>Food Option</th>
                <th>Dietary Restrictions</th>
                <th>Other</th>
            </tr>
            </thead>
            <tbody>
            {guests.map((guest, i) => (
                <tr key={i}>
                    <td>{guest.name}</td>
                    <td>{guest.foodOption}</td>
                    <td>
                        {guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0
                            ? guest.dietaryRestrictions.join(', ')
                            : 'None'}
                    </td>
                    <td>{guest.other || 'None'}</td>
                </tr>
            ))}
            </tbody>
        </Table>
    </div>
);

GuestsDetails.propTypes = {
    guests: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            foodOption: PropTypes.string,
            dietaryRestrictions: PropTypes.arrayOf(PropTypes.string),
            other: PropTypes.string,
        })
    ).isRequired,
};

export default GuestsDetails;
