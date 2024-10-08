// components/FormInput.js
import React from 'react';

function FormInput({ label, type, id, value, onChange, required = false }) {
    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label">{label}</label>
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
}

export default FormInput;