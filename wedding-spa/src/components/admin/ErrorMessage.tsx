// components/admin/ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
    error: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => (
    <div className="text-danger text-center">Error: {error}</div>
);

export default ErrorMessage;
