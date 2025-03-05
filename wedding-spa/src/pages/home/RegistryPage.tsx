// pages/home/ContactPage.tsx
import React from 'react';
import BaseLayout from '../../components/main/BaseLayout';
import RegistryComponent from "../../components/main/RegistryComponent";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";

const stripePromise = loadStripe('pk_test_51QzKvKJr833cmALT8OGod7YPuE9AAxV8HvV0vNjKoJpv0yHPVMRUjtF89PnoWnn1lMH9HuSV99bFqN7EEzsqkM2z00OeATR7bZ');

const ContactPage: React.FC = () => {
    return (
        <BaseLayout>
            <Elements stripe={stripePromise}>
                <RegistryComponent />
            </Elements>
        </BaseLayout>
    );
};

export default ContactPage;
