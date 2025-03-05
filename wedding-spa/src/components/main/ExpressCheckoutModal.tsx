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

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51QzKvKJr833cmALT8OGod7YPuE9AAxV8HvV0vNjKoJpv0yHPVMRUjtF89PnoWnn1lMH9HuSV99bFqN7EEzsqkM2z00OeATR7bZ');

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
 * PaymentForm is now wrapped in a <form> so that pressing Enter triggers its onSubmit.
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
  const [open, setOpen] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<number>(25);
  // For the user’s custom amount entry
  const [customAmount, setCustomAmount] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);

  // Ref to the PaymentForm so we can call submitPayment()
  const paymentFormRef = useRef<PaymentFormHandle>(null);

  const handleOpen = () => {
    setOpen(true);
    setMessage(null);
    setClientSecret(null);
  };

  const handleClose = () => {
    setOpen(false);
    setMessage(null);
    setClientSecret(null);
    setShowCustomInput(false);
    setCustomAmount("");
  };

  /**
   * Derive the final donation amount in dollars from either
   * a preset or the custom input.
   */
  const donationAmount = showCustomInput ? customAmount : selectedPreset.toString();

  // Validate custom amount: must be a positive number if in custom mode.
  const isCustomValid =
      !showCustomInput ||
      (customAmount.trim() !== "" &&
          !isNaN(parseFloat(customAmount)) &&
          parseFloat(customAmount) > 0);

  // Determine if the Pay button should be enabled.
  const isPayEnabled = !paymentLoading && isPaymentComplete && isCustomValid;

  // Fetch the PaymentIntent clientSecret when the modal opens or donationAmount changes.
  useEffect(() => {
    if (open) {
      const amountValue = parseFloat(donationAmount);
      // Convert to cents; fallback to 5000 if invalid
      const amount =
          !isNaN(amountValue) && amountValue > 0 ? amountValue * 100 : 5000;
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
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
              Select a donation amount (USD):
            </Typography>

            {/* If not in custom mode, show the row of preset buttons. */}
            {!showCustomInput && (
                <Box
                    sx={{
                      display: 'flex',
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
                      sx={{ fontSize: '1rem', padding: '12px 24px', width: 70 }}
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
                      sx={{ fontSize: '1rem', padding: '12px 24px', width: 70 }}
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
                      sx={{ fontSize: '1rem', padding: '12px 24px', width: 70 }}
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
                      sx={{ fontSize: '1rem', padding: '12px 24px', minWidth: 120 }}
                  >
                    Other amount
                  </Button>
                </Box>
            )}

            {/* If in custom mode, show a single large field with a currency symbol and an X. */}
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
                        // Allow only digits and one optional decimal point.
                        const newValue = e.target.value;
                        if (/^\d*\.?\d*$/.test(newValue)) {
                          setCustomAmount(newValue);
                        }
                      }}
                      placeholder="0.00"
                      required
                      // Block disallowed keys
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

            <Divider sx={{ my: 2 }} />

            {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm
                      ref={paymentFormRef}
                      clientSecret={clientSecret}
                      onMessage={setMessage}
                      setPaymentLoading={setPaymentLoading}
                      onPaymentCompleteChange={setIsPaymentComplete}
                  />
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

          <DialogActions sx={{ justifyContent: 'space-between' }}>
            <CustomButton
                text="Cancel"
                onClick={handleClose}
                variant="lightOutlined"
                width="75px"
                marginRight={1}
            />
            <Button
                variant="contained"
                onClick={() => paymentFormRef.current?.submitPayment()}
                disabled={!isPayEnabled}
            >
              {paymentLoading ? <CircularProgress size={24} color="inherit" /> : "Pay"}
            </Button>
          </DialogActions>
        </Dialog>
      </>
  );
};

export default ExpressCheckoutModal;
