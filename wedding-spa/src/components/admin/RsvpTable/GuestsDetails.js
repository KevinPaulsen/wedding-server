import React from 'react';
import PropTypes from 'prop-types';
import {Container, Row, Table} from 'react-bootstrap';
import '../../../styles/Card.css'

const GuestsDetails = ({guests}) => (<Container>
            <Row>
                <h5>Guests Details</h5>
            </Row>
            <Table size="sm" className="card-table">
                <thead>
                <tr>
                    <th>Guest Name</th>
                    <th>Food Option</th>
                    <th>Dietary Restrictions</th>
                    <th>Other</th>
                </tr>
                </thead>
                <tbody>
                {guests.map((guest, i) => (<tr key={i}>
                            <td>{guest.name}</td>
                            <td>{guest.foodOption}</td>
                            <td>
                                {guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0
                                 ? guest.dietaryRestrictions.join(', ') : 'None'}
                            </td>
                            <td>{guest.other || 'None'}</td>
                        </tr>))}
                </tbody>
            </Table>
        </Container>);

GuestsDetails.propTypes = {
    guests: PropTypes.arrayOf(PropTypes.shape({
                                                  name: PropTypes.string.isRequired,
                                                  foodOption: PropTypes.string,
                                                  dietaryRestrictions: PropTypes.arrayOf(PropTypes.string),
                                                  other: PropTypes.string,
                                              })).isRequired,
};

export default GuestsDetails;
