import React, {createContext, useContext, useState} from 'react';

const FormContext = createContext();

export const useFormContext = () => {
    return useContext(FormContext);
};

export const FormProvider = ({children}) => {
    const [formData, setFormData] = useState({
        rsvpCode: '',
        lastName: '',
        prefName: '',
        prefEmail: '',
        prefPhone: '',
    });

    return (
        <FormContext.Provider value={{formData, setFormData}}>
            {children}
        </FormContext.Provider>
    );
};
