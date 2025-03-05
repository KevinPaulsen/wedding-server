// components/main/ExpressCheckoutModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Divider
} from '@mui/material';
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { createPaymentIntent } from "../../services/ApiService";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51QzKvKJr833cmALT8OGod7YPuE9AAxV8HvV0vNjKoJpv0yHPVMRUjtF89PnoWnn1lMH9HuSV99bFqN7EEzsqkM2z00OeATR7bZ');

// Child component that mounts the expressCheckout element
const ExpressCheckoutContent: React.FC<{ clientSecret: string; onMessage: (msg: string) => void }> = ({ clientSecret, onMessage }) => {
  const stripe = useStripe();
  const elements = useElements();
  const containerRef = useRef<HTMLDivElement>(null);
  const [checkoutElem, setCheckoutElem] = useState<any>(null);

  useEffect(() => {
    if (stripe && elements && !checkoutElem && containerRef.current) {
      // Create the expressCheckout element with clientSecret included in options
      const checkoutElem = elements.create("expressCheckout", {
        emailRequired: true,
      });
      checkoutElem.mount(containerRef.current);
      setCheckoutElem(checkoutElem);

      // Listen for the confirm event
      checkoutElem.on('confirm', async () => {
        const { error } = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            // Replace with your actual return URL
            return_url: 'http://kevinlovesolivia.com',
          },
        });
        if (error) {
          onMessage(error.message || "Payment failed");
        } else {
          onMessage("Payment successful! You will be redirected shortly.");
        }
      });

      // Cleanup when the component is unmounted
      return () => {
        if (checkoutElem) {
          checkoutElem.unmount();
          setCheckoutElem(null);
        }
      };
    }
  }, [stripe, elements, checkoutElem, clientSecret, onMessage]);

  return <div ref={containerRef} style={{ minHeight: '60px' }} />;
};

const ExpressCheckoutModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("50"); // default donation amount
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleOpen = () => {
    setOpen(true);
    setMessage(null);
    setClientSecret(null);
  };

  const handleClose = () => {
    setOpen(false);
    setMessage(null);
    setClientSecret(null);
  };

  // Fetch the PaymentIntent clientSecret when the modal opens
  useEffect(() => {
    if (open) {
      const amountValue = parseFloat(donationAmount);
      // Multiply by 100 to convert dollars to cents
      const amount = (!isNaN(amountValue) && amountValue > 0) ? amountValue * 100 : 5000;
      createPaymentIntent(amount)
      .then(response => {
        if (response.success && response.data) {
          setClientSecret(response.data.clientSecret);
        } else {
          console.error("Error creating PaymentIntent", response.error);
          setMessage("Error initializing payment.");
        }
      })
      .catch(err => {
        console.error("Error creating PaymentIntent", err);
        setMessage("Error initializing payment.");
      });
    }
  }, [open]);

  return (
      <>
        <Button variant="contained" onClick={handleOpen}>
          Donate
        </Button>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Donate to Our Wedding</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Enter your donation amount (USD):
            </Typography>
            <TextField
                label="Donation Amount"
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" gutterBottom>
              Payment:
            </Typography>
            {clientSecret ? (
                // Wrap the payment element with the Elements provider, passing clientSecret as an option
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <ExpressCheckoutContent clientSecret={clientSecret} onMessage={setMessage} />
                </Elements>
            ) : (
                <div>Loading payment details...</div>
            )}
            {message && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                  {message}
                </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </>
  );
};

export default ExpressCheckoutModal;
