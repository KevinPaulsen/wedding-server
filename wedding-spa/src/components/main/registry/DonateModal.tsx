// components/main/DonateModal.tsx
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
import {
    CardElement,
    PaymentRequestButtonElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import {createPaymentIntent} from "../../../services/ApiService";

const DonateModal: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [donationAmount, setDonationAmount] = useState("50"); // default to $50
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [paymentRequest, setPaymentRequest] = useState<any>(null);

    const stripe = useStripe();
    const elements = useElements();

    const handleOpen = () => {
        setOpen(true);
        setMessage(null);
    };

    const handleClose = () => {
        setOpen(false);
        setMessage(null);
        setClientSecret(null);
        setPaymentRequest(null);
    };

    // Create PaymentIntent only when the modal opens
    useEffect(() => {
        if (open) {
            // Convert donationAmount to a number; fallback to 50 if invalid
            const amountValue = parseFloat(donationAmount);
            const amount = !isNaN(amountValue) && amountValue > 0 ? amountValue * 100 : 5000;
            createPaymentIntent(amount)
                .then(response => {
                    if (response.success && response.data) {
                        setClientSecret(response.data.clientSecret);
                    } else {
                        console.error("Error creating payment intent", response.error);
                        setMessage("Error initializing payment.");
                    }
                })
                .catch(err => {
                    console.error("Error creating payment intent", err);
                    setMessage("Error initializing payment.");
                });
        }
    }, [open]);

    // Create Payment Request object only once when modal opens
    useEffect(() => {
        if (stripe && open && !paymentRequest) {
            const initialAmount = parseFloat(donationAmount);
            const amount = !isNaN(initialAmount) && initialAmount > 0 ? initialAmount * 100 : 5000;
            const pr = stripe.paymentRequest({
                country: 'US',
                currency: 'usd',
                total: {
                    label: 'Wedding Donation',
                    amount: amount,
                },
                requestPayerName: true,
                requestPayerEmail: true,
            });

            pr.canMakePayment().then(result => {
                if (result) {
                    setPaymentRequest(pr);
                }
            });

            pr.on('paymentmethod', async (ev: any) => {
                if (!clientSecret) return;
                const { error } = await stripe.confirmCardPayment(
                    clientSecret,
                    { payment_method: ev.paymentMethod.id },
                    { handleActions: false }
                );
                if (error) {
                    ev.complete('fail');
                    setMessage(error.message || "Payment failed");
                } else {
                    ev.complete('success');
                    setMessage("Donation successful! Thank you for your generosity.");
                }
            });
        }
    }, [stripe, open, clientSecret, paymentRequest]);

    // Update Payment Request total if donationAmount changes
    useEffect(() => {
        if (paymentRequest) {
            const newAmount = parseFloat(donationAmount);
            if (!isNaN(newAmount) && newAmount > 0) {
                paymentRequest.update({
                    total: {
                        label: 'Wedding Donation',
                        amount: newAmount * 100,
                    }
                });
            }
        }
    }, [paymentRequest, donationAmount]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        setLoading(true);
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: { name: "Donor Name" }
            }
        });

        if (result.error) {
            setMessage(result.error.message || "Payment failed");
        } else {
            if (result.paymentIntent?.status === 'succeeded') {
                setMessage("Donation successful! Thank you for your generosity.");
            }
        }
        setLoading(false);
    };

    return (
        <>
            <Button variant="contained" onClick={handleOpen}>
                Donate
            </Button>
            <Dialog open={open} onClose={handleClose}>
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
                    <Divider sx={{ my: 2 }}>Or pay with</Divider>
                    {paymentRequest ? (
                        <PaymentRequestButtonElement
                            options={{
                                paymentRequest: paymentRequest,
                                style: {
                                    paymentRequestButton: {
                                        type: 'default',
                                        theme: 'light',
                                        height: '40px',
                                    },
                                },
                            }}
                        />
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            Apple Pay/Google Pay not available, please use card.
                        </Typography>
                    )}
                    <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
                        Payment Details:
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                            }}
                        />
                        {message && (
                            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                                {message}
                            </Typography>
                        )}
                        <DialogActions sx={{ mt: 2 }}>
                            <Button onClick={handleClose} color="secondary">
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" disabled={!stripe || loading}>
                                {loading ? "Processing..." : "Donate"}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DonateModal;
