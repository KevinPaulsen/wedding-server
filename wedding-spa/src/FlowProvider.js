import React, { createContext, useContext, useState } from 'react';

// Create the Flow Context
const FlowContext = createContext();

export const useFlow = () => useContext(FlowContext);

// Provide Flow Context to the app
export const FlowProvider = ({ children }) => {
    const [step, setStep] = useState({
        rsvpCompleted: false,
        preferredInfoCompleted: false,
        rsvpStatusCompleted: false,
    });

    return (
        <FlowContext.Provider value={{ step, setStep }}>
            {children}
        </FlowContext.Provider>
    );
};
