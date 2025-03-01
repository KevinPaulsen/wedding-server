// CancelButton.tsx
import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useFlow} from '../../../context/FlowProvider';
import '../../../styles/rsvp/RsvpButtons.css';
import CustomButton from "../CustomButton";

interface CancelButtonProps {
    route: string;
}

const CancelButton: React.FC<CancelButtonProps> = ({ route }) => {
    const navigate = useNavigate();
    const { resetFormData, resetStepState } = useFlow();

    const handleCancel = () => {
        resetFormData();
        resetStepState();
        navigate(route);
    };

    return (
        <CustomButton text={"Cancel"} onClick={handleCancel} maxWidth={75} variant="lightOutlined"/>
    );
};

export default CancelButton;
