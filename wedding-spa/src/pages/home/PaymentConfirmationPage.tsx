// pages/home/GalleryPage.tsx
import React from 'react';
import BaseLayout from '../../components/main/BaseLayout';
import PhotoGalleryComponent from '../../components/main/PhotoGalleryComponent';
import PaymentConfirmation from "../../components/main/registry/PaymentConfirmation";

const PaymentConfirmationPage: React.FC = () => {
    return (
        <BaseLayout>
          <PaymentConfirmation />
        </BaseLayout>
    );
};

export default PaymentConfirmationPage;
