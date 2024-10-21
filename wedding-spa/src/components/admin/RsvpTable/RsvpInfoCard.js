import React from 'react';
import PropTypes from 'prop-types';
import {Card, Col, Row} from "react-bootstrap";
import GuestsDetails from "./GuestsDetails";
import PrimaryContactInfo from "./PrimaryContactInfo";
import {useFlow} from "../../../FlowProvider";
import '../../../styles/Card.css'
import {useNavigate} from "react-router-dom";
import {transformGuestDetails} from "../../../services/DataTransformService";

const RsvpInfoCard = ({rsvp}) => {
    const {setFormData} = useFlow();
    const navigate = useNavigate();

    const handleClick = () => {
        const prefName = rsvp.primaryContact ? (rsvp.primaryContact.name ? rsvp.primaryContact.name : '') : '';
        const email = rsvp.primaryContact ? (rsvp.primaryContact.email ? rsvp.primaryContact.email : '') : '';
        const phone = rsvp.primaryContact ? (rsvp.primaryContact.phoneNumber ? rsvp.primaryContact.phoneNumber : '')
                                          : '';

        setFormData({
                        rsvpCode: rsvp.rsvpCode,
                        lastname: rsvp.lastnames && rsvp.lastnames.length > 0 ? rsvp.lastnames[0] : '',
                        prefName: prefName,
                        prefEmail: email,
                        prefPhone: phone,
                        guests: transformGuestDetails(rsvp.rsvpGuestDetails),
                    })
        navigate('/admin/edit-rsvp');
    }

    return (<Card className="p-3 dark-card" onClick={handleClick}>
                <Row className="justify-content-center">
                    {/* Primary Contact Section */}
                    <Col xs={11} md={4} className="text-center mb-4">
                        <PrimaryContactInfo primaryContact={rsvp.primaryContact}
                                            lastnames={rsvp.lastnames}/>
                    </Col>

                    {/* Guests Section */}
                    {rsvp.rsvpGuestDetails && rsvp.rsvpGuestDetails.length > 0 ? <Col xs={12} md={8}
                                                                                      className="text-center mb-4">
                        <GuestsDetails guests={rsvp.rsvpGuestDetails}/>
                    </Col> : null}
                </Row>
            </Card>);
}

RsvpInfoCard.propTypes = {
    rsvp: PropTypes.shape({
                              primaryContact: PropTypes.shape({
                                                                  name: PropTypes.string.isRequired,
                                                                  email: PropTypes.string,
                                                                  phoneNumber: PropTypes.string,
                                                                  address: PropTypes.string,
                                                              }).isRequired,
                              lastnames: PropTypes.arrayOf(PropTypes.string),
                              rsvpCode: PropTypes.string.isRequired,
                              allowedGuestCount: PropTypes.number.isRequired,
                              guestCount: PropTypes.number.isRequired,
                              rsvpGuestDetails: PropTypes.arrayOf(PropTypes.shape({
                                                                                      name: PropTypes.string.isRequired,
                                                                                      foodOption: PropTypes.string,
                                                                                      dietaryRestrictions: PropTypes.arrayOf(
                                                                                              PropTypes.string),
                                                                                      other: PropTypes.string,
                                                                                  })).isRequired,
                          }).isRequired,
};

export default RsvpInfoCard;
