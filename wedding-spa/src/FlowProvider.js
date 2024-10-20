import React, {createContext, useContext, useState} from 'react';

// Create the Flow Context
const FlowContext = createContext();

export const useFlow = () => useContext(FlowContext);

// Provide Flow Context to the app
export const FlowProvider = ({children}) => {
    const initialStepState = {
        rsvpCompleted: false, preferredInfoCompleted: false, rsvpStatusCompleted: false, guestInfoCompleted: false,
    };

    const initialFormDataState = {
        rsvpCode: '', lastName: '', prefName: '', prefEmail: '', prefPhone: '', guests: [],
    };

    const [step, setStep] = useState(initialStepState);

    const [formData, setFormData] = useState(initialFormDataState);

    const [editingGuest, setEditingGuest] = useState(null);

    const resetFormData = () => {
        setFormData(initialFormDataState)
    }

    const resetStepState = () => {
        setStep(initialStepState)
    }

    const addGuest = (guest) => {
        setFormData(prevFormData => ({
            ...prevFormData, guests: [...prevFormData.guests, guest]
        }));
    };

    return (<FlowContext.Provider value={{
                step,
                setStep,
                formData,
                setFormData,
                editingGuest,
                setEditingGuest,
                resetFormData,
                resetStepState,
                addGuest
            }}>
                {children}
            </FlowContext.Provider>);
};
