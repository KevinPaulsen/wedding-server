import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import {useFlow} from '../../FlowProvider';
import RsvpLayout from "../../components/rsvp/RsvpLayout";
import {Button, Container, Row, Table} from "react-bootstrap";
import "../../styles/rsvp/RsvpTable.css"
import {FaEdit, FaTrash} from 'react-icons/fa';

const GuestsPage = () => {
    const navigate = useNavigate();
    const {formData, setFormData, step, setStep} = useFlow();

    // Redirect to RSVP page if RSVP hasn't been completed
    useEffect(() => {
        if (!step.preferredInfoCompleted) {
            navigate('/rsvp-info');
        }
    }, [step, navigate]);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleNext = () => {
        setStep((prevStep) => ({...prevStep, guestInfoCompleted: true}));
        navigate('/rsvp-status');
    };

    const handleBack = () => {
        navigate('/rsvp-info');
    };

    const handleNewGuest = () => {
        navigate('/rsvp-add-guest');
    };

    const handleDeleteGuest = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            guests: prevData.guests.filter((_, i) => i !== index),
        }));
    };

    const handleEditGuest = (index) => {
        navigate('/rsvp-add-guest', { state: { guest: formData.guests[index], index } });
    };

    return (
        <RsvpLayout
            title={"Add Guests (including yourself)"}
            cancel={true}
            children={
                <Container style={{maxWidth: "900px"}}>
                    <Row className="mb-4">
                        {formData.guests.length === 0 ? (
                            ""
                        ) : (
                            <Table hover className="custom-table">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Dietary Restrictions</th>
                                    <th>
                                        {formData.guests.some(
                                            (guest) => guest.other && guest.other.trim() !== ""
                                        ) && "Other"}
                                    </th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {formData.guests &&
                                    formData.guests.map((guest, index) => (
                                        <tr key={index}>
                                            <td className="align-middle">
                                                {guest.fName + " " + guest.lName}
                                            </td>
                                            <td className="align-middle">
                                                {guest.dietaryRestrictions.map((restriction, idx) => (
                                                    <span key={idx}>
                                            {restriction}
                                                        <br/>
                                        </span>
                                                ))}
                                            </td>
                                            <td className="align-middle">{guest.other}</td>
                                            <td className="align-middle">
                                                <Button
                                                    variant="link"
                                                    className="me-2 p-0"
                                                    onClick={() => handleEditGuest(index)}
                                                >
                                                    <FaEdit size={20} color="var(--main-dark)"/>
                                                </Button>
                                                <Button
                                                    variant="link"
                                                    className="p-0"
                                                    onClick={() => handleDeleteGuest(index)}
                                                >
                                                    <FaTrash size={20} color="var(--main-dark)"/>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Row>
                    <Row className="d-flex justify-content-evenly my-5 px-2">
                        <Button className="rsvp-button dark" onClick={handleBack}>
                            Back
                        </Button>
                        <Button className="rsvp-button dark long" onClick={handleNewGuest}>
                            Add Guest
                        </Button>
                        <Button className="rsvp-button dark" onClick={handleNext}>
                            Next
                        </Button>
                    </Row>
                </Container>
            }/>
    );
};

export default GuestsPage;
