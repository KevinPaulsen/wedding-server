// RsvpAddGuest.tsx
import React, {useEffect, useRef, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/Transitions.css';
import '../../../styles/rsvp/RsvpButtons.css';
import {RsvpGuestDetailWithIndex, useFlow} from '../../../context/FlowProvider';
import {Button, Form, Row} from 'react-bootstrap';
import CustomInputField from '../CustomInputField';
import {RSVP_GUESTS_PAGE} from './RsvpGuests';
import {RSVP_PRIMARY_CONTACT_STEP} from "./RsvpPrimaryContact";

interface RsvpAddGuestProps {
    changePage: (step: number) => void;
    requireAnswers: boolean;
}

interface Validateable {
    validate: () => boolean;
}

const RsvpAddGuest: React.FC<RsvpAddGuestProps> = ({ changePage, requireAnswers }) => {
    const { formData, addGuest, updateGuest, editingGuest, setEditingGuest } = useFlow();
    const guestName = useRef<Validateable>(null);
    const otherRef = useRef<Validateable>(null);

    const [newGuest, setNewGuest] = useState<RsvpGuestDetailWithIndex>({
        name: '',
        foodOption: '',
        dietaryRestrictions: [],
        other: '',
    });

    const dietaryOptions = [
        'VEGAN',
        'SHELLFISH_FREE',
        'DAIRY_FREE',
        'VEGETARIAN',
        'GLUTEN_FREE',
        'NUT_FREE',
        'OTHER',
    ];

    useEffect(() => {
        if (editingGuest) {
            setNewGuest(editingGuest);
        }
    }, [editingGuest]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewGuest((prevGuest) => ({
            ...prevGuest,
            [e.target.name]: e.target.value,
        }));
    };

    const handleDietaryChange = (option: string) => {
        setNewGuest((prevGuest) => {
            const updatedRestrictions = prevGuest.dietaryRestrictions.includes(option)
                ? prevGuest.dietaryRestrictions.filter((restriction) => restriction !== option)
                : [...prevGuest.dietaryRestrictions, option];
            return {
                ...prevGuest,
                dietaryRestrictions: updatedRestrictions,
            };
        });
    };

    const handleBack = () => {
        setEditingGuest(null);
        if (formData.rsvpGuestDetails.length === 0) {
            changePage(RSVP_PRIMARY_CONTACT_STEP);
        } else {
            changePage(RSVP_GUESTS_PAGE);
        }
    };

    const handleAddGuest = () => {
        const guestNameValid = guestName.current!.validate();
        if (guestNameValid) {
            if (editingGuest && editingGuest.index !== undefined) {
                updateGuest(editingGuest.index, newGuest);
            } else {
                addGuest(newGuest);
            }
            setEditingGuest(null);
            changePage(RSVP_GUESTS_PAGE);
        }
    };

    return (
        <Form>
            <CustomInputField
                ref={guestName}
                name="name"
                type="text"
                placeholder="Guest full name"
                value={newGuest.name}
                onChange={handleChange}
                required={requireAnswers}
            />

            <h4 className="pb-2">Dietary Restrictions</h4>
            {dietaryOptions.map((option) => (
                <Button
                    key={option}
                    onClick={() => handleDietaryChange(option)}
                    className={`m-2 rsvp-button width-auto dark ${newGuest.dietaryRestrictions.includes(option) ? '' : 'wire'}`}
                >
                    {option.replace('_', ' ')}
                </Button>
            ))}

            {newGuest.dietaryRestrictions.includes('OTHER') && (
                <div className="pt-2">
                    <CustomInputField
                        ref={otherRef}
                        name="other"
                        type="text"
                        placeholder="Other Restrictions"
                        value={newGuest.other || ''}
                        onChange={handleChange}
                        required={requireAnswers}
                    />
                </div>
            )}

            <Row className="d-flex justify-content-evenly pt-4 px-2">
                <Button className="rsvp-button dark hover" onClick={handleBack}>
                    Back
                </Button>
                <Button className="rsvp-button dark hover width-auto" onClick={handleAddGuest}>
                    {editingGuest ? 'Save Changes' : 'Add Guest'}
                </Button>
            </Row>
        </Form>
    );
};

export default RsvpAddGuest;
export const RSVP_ADD_GUEST_STEP = 4;
