import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Transitions.css';
import {useFlow} from '../../FlowProvider';
import RsvpLayout from "../../components/rsvp/RsvpLayout";
import {Button, Container, Row, Table, Modal, Form} from "react-bootstrap";

const GuestsPage = () => {
    const navigate = useNavigate();
    const [currentGuestIndex, setCurrentGuestIndex] = useState(null);
    const [editGuest, setEditGuest] = useState({
        name: "",
        foodOption: "",
        dietaryRestrictions: [],
        other: "",
    });
    const [showModal, setShowModal] = useState(false);

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
            guests: [...(prevData.guests || [])].filter((_, i) => i !== index),
        }));
    };

    const handleEditGuest = (index) => {
        setCurrentGuestIndex(index);
        setEditGuest(formData.guests[index]);
        setShowModal(true);
    };

    const handleSaveEdit = () => {
        setFormData((prevData) => ({
            ...prevData,
            guests: [...(prevData.guests || [])].map((guest, index) =>
                index === currentGuestIndex ? editGuest : guest
            )
        }));
        setShowModal(false);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditGuest((prevGuest) => ({
            ...prevGuest,
            [name]: value,
        }));
    };

    return (
        <RsvpLayout
            title={"Add Guests (including yourself)"}
            cancel={true}
            children={
                <Container className="" style={{width: "90vw", maxWidth: "600px"}}>
                    <Row className="mb-4">
                        {formData.guests.length === 0 ?
                            "" :
                            <>
                                <Table striped bordered hover>
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Food Option</th>
                                        <th>Dietary Restrictions</th>
                                        <th>Other</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {formData.guests.map((guest, index) => (
                                        <tr key={index}>
                                            <td>{guest.name}</td>
                                            <td>{guest.foodOption}</td>
                                            <td>{guest.dietaryRestrictions.join(', ')}</td>
                                            <td>{guest.other}</td>
                                            <td>
                                                <Button
                                                    variant="warning"
                                                    className="me-2"
                                                    onClick={() => handleEditGuest(index)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDeleteGuest(index)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>

                                {/* Edit Guest Modal */}
                                <Modal show={showModal} onHide={() => setShowModal(false)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Edit Guest</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form>
                                            <Form.Group controlId="formName">
                                                <Form.Label column={"lg"}>Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    value={editGuest.name}
                                                    onChange={handleEditChange}
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="formFoodOption" className="mt-3">
                                                <Form.Label column={"lg"}>Food Option</Form.Label>
                                                <Form.Select
                                                    name="foodOption"
                                                    value={editGuest.foodOption}
                                                    onChange={handleEditChange}
                                                >
                                                    <option value="MEAT">MEAT</option>
                                                    <option value="VEGGIE">VEGGIE</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group controlId="formDietaryRestrictions" className="mt-3">
                                                <Form.Label column={"lg"}>Dietary Restrictions</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="dietaryRestrictions"
                                                    value={editGuest.dietaryRestrictions.join(', ')}
                                                    onChange={(e) =>
                                                        setEditGuest((prevGuest) => ({
                                                            ...prevGuest,
                                                            dietaryRestrictions: e.target.value.split(',').map((res) => res.trim()),
                                                        }))
                                                    }
                                                    placeholder="Enter restrictions separated by commas"
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="formOther" className="mt-3">
                                                <Form.Label column={"lg"}>Other</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="other"
                                                    value={editGuest.other}
                                                    onChange={handleEditChange}
                                                />
                                            </Form.Group>
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                                            Cancel
                                        </Button>
                                        <Button variant="primary" onClick={handleSaveEdit}>
                                            Save Changes
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </>
                        }
                    </Row>
                    <Row className="d-flex justify-content-between px-2">
                        <Button className='rsvp-button dark' onClick={handleBack}> Back </Button>
                        <Button className='rsvp-button dark long' onClick={handleNewGuest}> Add Guest </Button>
                        <Button className='rsvp-button dark' onClick={handleNext}> Next </Button>
                    </Row>
                </Container>
            }/>
    );
};

export default GuestsPage;
