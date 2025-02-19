import React, {
    forwardRef,
    useImperativeHandle,
    useState,
    ChangeEvent,
    ForwardedRef,
} from 'react';
import { Form } from 'react-bootstrap';

export interface CustomInputFieldProps {
    label?: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    name: string;
    min?: number | string;
}

export interface CustomInputFieldRef {
    validate: () => boolean;
}

const CustomInputField = forwardRef(
    (
        {
            label,
            type = 'text',
            placeholder,
            value,
            onChange,
            required = true,
            name,
            min,
        }: CustomInputFieldProps,
        ref: ForwardedRef<CustomInputFieldRef>
    ) => {
        const [, setIsTouched] = useState<boolean>(false);
        const [hasError, setHasError] = useState<boolean>(false);

        const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
            onChange(e); // Parent component manages the input value
            if (hasError && e.target.value.toString().trim() !== '') {
                setHasError(false); // Reset error if user starts typing
            }
        };

        const handleFocus = () => {
            setIsTouched(true);
        };

        const handleBlur = () => {
            if (required && (!value || value.toString().trim() === '')) {
                setHasError(true);
            }
        };

        // Expose a validate method to parent components using ref
        useImperativeHandle(ref, () => ({
            validate: () => {
                if (required && (!value || value.toString().trim() === '')) {
                    setHasError(true);
                    return false;
                }
                return true;
            },
        }));

        return (
            <Form.Group controlId={name} className="d-flex flex-column align-items-center">
                {label && <Form.Label column="lg">{label}</Form.Label>}
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
                <div style={{ height: '28px' }}>
                    {hasError && (
                        <Form.Text className="text-danger">
                            This field must not be empty
                        </Form.Text>
                    )}
                </div>
            </Form.Group>
        );
    }
);

CustomInputField.displayName = "CustomInputField";

export default CustomInputField;
