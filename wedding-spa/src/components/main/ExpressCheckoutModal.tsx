// components/main/ExpressCheckoutModal.tsx
import React, { useState, useEffect } from 'react';
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
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { createPaymentIntent } from "../../services/ApiService";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51QzKvKJr833cmALT8OGod7YPuE9AAxV8HvV0vNjKoJpv0yHPVMRUjtF89PnoWnn1lMH9HuSV99bFqN7EEzsqkM2z00OeATR7bZ');

const PaymentForm: React.FC<{ clientSecret: string; onMessage: (msg: string) => void }> = ({ clientSecret, onMessage }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      // Call elements.submit() immediately upon clicking "Pay"
      await elements.submit();
    } catch (submitError: any) {
      onMessage("Submission failed: " + (submitError.message || ""));
      return;
    }

    // Now confirm the payment
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        // Make sure to use HTTPS and a valid return URL
        return_url: 'https://kevinlovesolivia.com/success',
      },
    });

    if (error) {
      onMessage(error.message || "Payment failed");
    } else {
      onMessage("Payment successful! You will be redirected shortly.");
    }
  };

  return (
      <form onSubmit={handleSubmit}>
        {/* PaymentElement always includes a credit card input,
          and—if available and your domain is verified—Apple Pay and other relevant methods */}
        <PaymentElement />
        <Button variant="contained" type="submit" disabled={!stripe} sx={{ mt: 2 }}>
          Pay
        </Button>
      </form>
  );
};

const ExpressCheckoutModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("50"); // default donation amount (USD)
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
      const amount = (!isNaN(amountValue) && amountValue > 0) ? amountValue * 100 : 5000; // convert to cents
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
  }, [open, donationAmount]);

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
                // Wrap the PaymentForm with the Elements provider, passing the clientSecret.
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm clientSecret={clientSecret} onMessage={setMessage} />
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
