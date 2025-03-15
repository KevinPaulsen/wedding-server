// pages/home/PaymentConfirmationPage.tsx
import React from 'react';
import BaseLayout from '../../components/main/BaseLayout';
import PaymentConfirmation from "../../components/main/registry/PaymentConfirmation";

const PaymentConfirmationPage: React.FC = () => {
  return (
      <BaseLayout>
        <PaymentConfirmation/>
      </BaseLayout>
  );
};

export default PaymentConfirmationPage;
