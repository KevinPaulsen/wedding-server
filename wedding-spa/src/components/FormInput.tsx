import React, { ChangeEvent } from 'react';

interface FormInputProps {
    label: string;
    type: string;
    id: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
                                                 label,
                                                 type,
                                                 id,
                                                 value,
                                                 onChange,
                                                 required = false,
                                             }) => {
    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label">
                {label}
            </label>
            <input
                type={type}
                className="form-control"
                id={id}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
};

export default FormInput;
