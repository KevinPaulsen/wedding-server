import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Form} from 'react-bootstrap';

const CustomInputField = forwardRef(({
                                         label,
                                         type = 'text',
                                         placeholder,
                                         value,
                                         onChange,
                                         required = true,
                                         name,
                                         min
                                     }, ref) => {
    const [isTouched, setIsTouched] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Handle input change
    const handleInputChange = (e) => {
        onChange(e); // Parent component manages the input value
        if (hasError && e.target.value.trim() !== '') {
            setHasError(false); // Reset error if user starts typing
        }
    };

    // Handle focus (user selects input)
    const handleFocus = () => {
        setIsTouched(true);
    };

    // Handle blur (user deselects input)
    const handleBlur = () => {
        if (required && value.trim() === '') {
            setHasError(true);
        }
    };

    // Expose a validate method to parent components using ref
    useImperativeHandle(ref, () => ({
        validate: () => {
            if (required && value.toString().trim() === '') {
                setHasError(true);
                return false;
            }
            return true;
        }
    }));

    return (
        <Form.Group controlId={name} className="d-flex flex-column align-items-center">
            {label && <Form.Label column={"lg"}>{label}</Form.Label>}
            <Form.Control
                name={name}
                type={type}
                value={value}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                min={min}
                style={{
                    width: '300px',
                    outline: hasError ? '2px solid red' : '2px solid var(--main-dark)',
                }}
                className={hasError ? 'is-invalid' : ''}
            />
            <div style={{height: "28px"}}>
                {hasError && (
                    <Form.Text className="text-danger">
                        This field must not be empty
                    </Form.Text>
                )}
            </div>
        </Form.Group>
    );
});

export default CustomInputField;
