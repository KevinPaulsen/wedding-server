// components/ErrorMessage.js
import React from 'react';

const ErrorMessage = ({ error }) => (
    <div className="text-danger text-center">Error: {error}</div>
);

export default ErrorMessage;
