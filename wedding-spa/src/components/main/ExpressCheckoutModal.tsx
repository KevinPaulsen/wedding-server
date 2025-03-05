// components/main/ExpressCheckoutModal.tsx
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
  Box,
  CircularProgress,
  IconButton
} from '@mui/material';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { createPaymentIntent } from "../../services/ApiService";
import CustomButton from "../shared/CustomButton";
import * as stripeJs from "@stripe/stripe-js";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51QzKvKJr833cmALT8OGod7YPuE9AAxV8HvV0vNjKoJpv0yHPVMRUjtF89PnoWnn1lMH9HuSV99bFqN7EEzsqkM2z00OeATR7bZ');

// Define your appearance object using your theme colors
const appearance = {
  theme: 'flat',
  variables: {
    colorPrimary: '#574c3f',        // primaryMainDark
    colorBackground: '#ece4da',     // secondaryMainLight
    colorText: '#574c3f',           // primaryMainDark
    fontFamily: "EB Garamond"
  },
  rules: {
    '.Input': {
      border: '2px solid #574c3f',
      borderRadius: '4px',
      padding: '8px',
    },
    '.Label': {
      color: '#574c3f',
    },
  },
};

interface PaymentFormProps {
  clientSecret: string;
  onMessage: (msg: string) => void;
  setPaymentLoading: (loading: boolean) => void;
  onPaymentCompleteChange?: (complete: boolean) => void;
}

export interface PaymentFormHandle {
  submitPayment: () => Promise<void>;
}

/**
 * PaymentForm is wrapped in a <form> so that pressing Enter triggers its onSubmit.
 * It now wraps the PaymentElement in a Box with a 2px dark brown border.
 */
const PaymentForm = forwardRef<PaymentFormHandle, PaymentFormProps>(
    ({ clientSecret, onMessage, setPaymentLoading, onPaymentCompleteChange }, ref) => {
      const stripe = useStripe();
      const elements = useElements();

      const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        if (!stripe || !elements) return;

        setPaymentLoading(true);
        try {
          // Run PaymentElement validations
          await elements.submit();
        } catch (submitError: any) {
          onMessage("Submission failed: " + (submitError.message || ""));
          setPaymentLoading(false);
          return;
        }
        // Confirm the payment
        const { error } = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: 'https://kevinlovesolivia.com/success',
          },
        });
        if (error) {
          onMessage(error.message || "Payment failed");
        } else {
          onMessage("Payment successful! You will be redirected shortly.");
        }
        setPaymentLoading(false);
      };

      useImperativeHandle(ref, () => ({
        submitPayment: () => handleSubmit(),
      }));

      return (
          <form onSubmit={handleSubmit}>
            <PaymentElement
                onChange={(e) => {
                  if (onPaymentCompleteChange) onPaymentCompleteChange(e.complete);
                }}
            />
            {/* Hidden submit button ensures Enter key submission */}
            <button type="submit" style={{ display: 'none' }}>Submit</button>
          </form>
      );
    }
);

const ExpressCheckoutModal: React.FC = () => {
  // step can be 'selection' or 'payment'
  const [step, setStep] = useState<'selection' | 'payment'>('selection');
  const [showCustomInput, setShowCustomInput] = useState(false);
  // Preset donation amounts
  const [selectedPreset, setSelectedPreset] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);

  // Ref to the PaymentForm so we can call submitPayment()
  const paymentFormRef = useRef<PaymentFormHandle>(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpen = () => {
    setStep('selection');
    setDialogOpen(true);
    setMessage(null);
    setClientSecret(null);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setStep('selection');
    setMessage(null);
    setClientSecret(null);
    setShowCustomInput(false);
    setCustomAmount("");
  };

  // Determine final donation amount from preset or custom input
  const donationAmount = showCustomInput ? customAmount : selectedPreset.toString();

  // Validate custom amount when in custom mode
  const isCustomValid =
      !showCustomInput ||
      (customAmount.trim() !== "" &&
          !isNaN(parseFloat(customAmount)) &&
          parseFloat(customAmount) > 0);

  // Payment is enabled if PaymentElement is complete and custom input is valid (if shown)
  const isPayEnabled = !paymentLoading && isPaymentComplete && isCustomValid;

  // When the user clicks "Continue to Payment", create a PaymentIntent
  const handleContinue = () => {
    const amountValue = parseFloat(donationAmount);
    const amount =
        !isNaN(amountValue) && amountValue > 0 ? amountValue * 100 : 5000;
    createPaymentIntent(amount)
    .then(response => {
      if (response.success && response.data) {
        setClientSecret(response.data.clientSecret);
        // Now move to payment step
        setStep('payment');
      } else {
        console.error("Error creating PaymentIntent", response.error);
        setMessage("Error initializing payment.");
      }
    })
    .catch(err => {
      console.error("Error creating PaymentIntent", err);
      setMessage("Error initializing payment.");
    });
  };

  return (
      <>
        <Button variant="contained" onClick={handleOpen}>
          Donate
        </Button>

        <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { minHeight: 400 } }}>
          <DialogContent
              sx={{
                minHeight: 400,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
          >
            {step === 'selection' && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                    Select a donation amount (USD):
                  </Typography>
                  {!showCustomInput && (
                      <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexWrap: 'wrap',
                            gap: 2,
                            mb: 2,
                            justifyContent: 'center',
                          }}
                      >
                        <Button
                            variant={selectedPreset === 25 ? 'contained' : 'outlined'}
                            onClick={() => {
                              setSelectedPreset(25);
                              setShowCustomInput(false);
                            }}
                            size="large"
                            sx={{ fontSize: '1rem', padding: '12px 24px', width: "100%" }}
                        >
                          $25
                        </Button>
                        <Button
                            variant={selectedPreset === 50 ? 'contained' : 'outlined'}
                            onClick={() => {
                              setSelectedPreset(50);
                              setShowCustomInput(false);
                            }}
                            size="large"
                            sx={{ fontSize: '1rem', padding: '12px 24px', width: "100%" }}
                        >
                          $50
                        </Button>
                        <Button
                            variant={selectedPreset === 100 ? 'contained' : 'outlined'}
                            onClick={() => {
                              setSelectedPreset(100);
                              setShowCustomInput(false);
                            }}
                            size="large"
                            sx={{ fontSize: '1rem', padding: '12px 24px', width: "100%" }}
                        >
                          $100
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => {
                              setShowCustomInput(true);
                              setCustomAmount("");
                            }}
                            size="large"
                            sx={{ fontSize: '1rem', padding: '12px 24px', width: "100%" }}
                        >
                          Other amount
                        </Button>
                      </Box>
                  )}

                  {showCustomInput && (
                      <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: 'primary.main',
                            borderRadius: 2,
                            padding: '8px 12px',
                            color: 'primary.contrastText',
                            mb: 2,
                          }}
                      >
                        <Typography variant="h4" sx={{ mr: 1, color: 'inherit' }}>
                          $
                        </Typography>
                        <TextField
                            variant="standard"
                            type="text"
                            value={customAmount}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              if (/^\d*\.?\d*$/.test(newValue)) {
                                setCustomAmount(newValue);
                              }
                            }}
                            placeholder="0.00"
                            required
                            onKeyDown={(e) => {
                              const allowedKeys = [
                                'Backspace',
                                'Tab',
                                'Enter',
                                'Escape',
                                'ArrowLeft',
                                'ArrowRight',
                                'Home',
                                'End'
                              ];
                              if (allowedKeys.includes(e.key)) return;
                              if (e.ctrlKey || e.metaKey) return;
                              if (/\d/.test(e.key)) return;
                              if (e.key === '.') {
                                if (customAmount.includes('.')) {
                                  e.preventDefault();
                                }
                                return;
                              }
                              e.preventDefault();
                            }}
                            InputProps={{ disableUnderline: true }}
                            sx={{
                              flex: 1,
                              input: {
                                fontSize: '1.25rem',
                                color: 'primary.contrastText',
                              },
                            }}
                        />
                        <IconButton
                            onClick={() => {
                              setShowCustomInput(false);
                              setCustomAmount("");
                            }}
                            sx={{ color: 'primary.contrastText' }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                  )}

                  <DialogActions sx={{ justifyContent: 'space-between', width: '100%' }}>
                    <CustomButton
                        text="Cancel"
                        onClick={handleClose}
                        variant="lightOutlined"
                        width="75px"
                        marginRight={1}
                    />
                    <CustomButton
                        text="Continue to Payment"
                        variant="light"
                        onClick={handleContinue}
                        disabled={!isCustomValid}
                        width="auto"
                    />
                  </DialogActions>
                </>
            )}

            {step === 'payment' && (
                <>
                  {clientSecret ? (
                      <Elements stripe={stripePromise} options={{ clientSecret, appearance } as stripeJs.StripeElementsOptions}>
                        <PaymentForm
                            ref={paymentFormRef}
                            clientSecret={clientSecret}
                            onMessage={setMessage}
                            setPaymentLoading={setPaymentLoading}
                            onPaymentCompleteChange={setIsPaymentComplete}
                        />
                      </Elements>
                  ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px' }}>
                        <CircularProgress aria-label="Loading..." />
                      </Box>
                  )}
                  {message && (
                      <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                        {message}
                      </Typography>
                  )}
                  <DialogActions
                      sx={{
                        justifyContent: 'space-between',
                        gap: 2,
                        width: '100%',
                        mt: 2,
                      }}
                  >
                    <CustomButton
                        text="Cancel"
                        onClick={handleClose}
                        variant="lightOutlined"
                        width="75px"
                    />
                    <CustomButton
                        text={paymentLoading ? <CircularProgress size={24} color="inherit" /> : "Pay"}
                        variant="light"
                        onClick={() => paymentFormRef.current?.submitPayment()}
                        disabled={!isPaymentComplete}
                        width="75px"
                    />
                  </DialogActions>
                </>
            )}
          </DialogContent>
        </Dialog>
      </>
  );
};

export default ExpressCheckoutModal;
