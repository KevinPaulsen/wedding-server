import React, {createContext, useContext, useState} from 'react';

// Create the Flow Context
const FlowContext = createContext();

export const useFlow = () => useContext(FlowContext);

// Provide Flow Context to the app
export const FlowProvider = ({children}) => {
    const initialStepState = {
        rsvpCompleted: false,
        preferredInfoCompleted: false,
        rsvpStatusCompleted: false,
    };

    const initialFormDataState = {
        rsvpCode: '',
        lastName: '',
        prefName: '',
        prefEmail: '',
        prefPhone: '',
        guests: [],
    };

    const [step, setStep] = useState(initialStepState);

    const [formData, setFormData] = useState(initialFormDataState);

    const resetFormData = () => {
        setFormData(initialFormDataState)
    }

    const resetStepState = () => {
        setStep(initialStepState)
    }

    return (
        <FlowContext.Provider value={{step, setStep, formData, setFormData, resetFormData, resetStepState}}>
            {children}
        </FlowContext.Provider>
    );
};
