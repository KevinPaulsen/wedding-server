// components/main/registry/PaymentConfirmation.tsx
import React from 'react';
import {Box, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import CustomButton from "../../shared/CustomButton";

interface RsvpConfirmationProps {
  returnPage?: string | null;
}

const PaymentConfirmation: React.FC<RsvpConfirmationProps> = ({returnPage}) => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate(returnPage ? returnPage : '/');
  };

  return (
      <Box sx={{p: 3, textAlign: 'center'}}>
        <Typography>Thank you for your Gift! Your Payment has been successfully
          submitted.</Typography>
        <CustomButton text="Return Home" onClick={handleReturnHome} width="auto" variant="dark"/>
      </Box>
  );
};

export default PaymentConfirmation;
