import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import {
  Box, Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import * as stripeJs from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { createPaymentIntent } from "../../../services/ApiService";
import CustomButton from "../../shared/CustomButton";

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51QzKvKJr833cmALT8OGod7YPuE9AAxV8HvV0vNjKoJpv0yHPVMRUjtF89PnoWnn1lMH9HuSV99bFqN7EEzsqkM2z00OeATR7bZ');

const appearance = {
  theme: 'flat',
  variables: {
    colorPrimary: '#574c3f',
    colorBackground: '#ece4da',
    colorText: '#574c3f',
    fontFamily: "EB Garamond"
  },
  rules: {
    '.Input': { border: '2px solid #574c3f', borderRadius: '4px', padding: '8px' },
    '.Label': { color: '#574c3f' },
  },
};

interface ExpressCheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

interface PaymentFormProps {
  clientSecret: string;
  onMessage: (msg: string) => void;
  setPaymentLoading: (loading: boolean) => void;
  onPaymentCompleteChange?: (complete: boolean) => void;
}

export interface PaymentFormHandle {
  submitPayment: () => Promise<void>;
}

const PaymentForm = forwardRef<PaymentFormHandle, PaymentFormProps>(
    ({ clientSecret, onMessage, setPaymentLoading, onPaymentCompleteChange }, ref) => {
      const stripe = useStripe();
      const elements = useElements();

      const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        if (!stripe || !elements) return;

        setPaymentLoading(true);
        try {
          await elements.submit();
        } catch (submitError: any) {
          onMessage("Submission failed: " + (submitError.message || ""));
          setPaymentLoading(false);
          return;
        }

        const { error } = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: { return_url: 'https://kevinlovesolivia.com/success' },
        });

        onMessage(error ? error.message || "Payment failed" : "Payment successful! You will be redirected shortly.");
        setPaymentLoading(false);
      };

      useImperativeHandle(ref, () => ({ submitPayment: () => handleSubmit() }));

      return (
          <form onSubmit={handleSubmit}>
            <PaymentElement onChange={(e) => onPaymentCompleteChange?.(e.complete)} />
            <button type="submit" style={{ display: 'none' }}>Submit</button>
          </form>
      );
    }
);

const ExpressCheckoutDialog: React.FC<ExpressCheckoutModalProps> = ({ open, onClose }) => {
  const [step, setStep] = useState<'selection' | 'payment'>('selection');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const paymentFormRef = useRef<PaymentFormHandle>(null);

  // When modal opens, reset state
  useEffect(() => {
    if (open) {
      setStep('selection');
      setMessage(null);
      setClientSecret(null);
      setShowCustomInput(false);
      setCustomAmount("");
    }
  }, [open]);

  const handleBack = () => {
    setStep('selection');
    setClientSecret(null);
    setMessage(null);
  };

  const donationAmount = showCustomInput ? customAmount : selectedPreset.toString();
  const isCustomValid = !showCustomInput || (customAmount.trim() !== "" && !isNaN(parseFloat(customAmount)) && parseFloat(customAmount) >= 0.5);
  const isPayEnabled = !paymentLoading && isPaymentComplete && isCustomValid;

  const handleContinue = () => {
    const amountValue = parseFloat(donationAmount);
    const amount = !isNaN(amountValue) && amountValue > 0 ? amountValue * 100 : 5000;
    createPaymentIntent(amount)
    .then(response => {
      if (response.success && response.data) {
        setClientSecret(response.data.clientSecret);
        setStep('payment');
      } else {
        setMessage("Error initializing payment.");
      }
    })
    .catch(() => setMessage("Error initializing payment."));
  };

  return (
      <Dialog
          open={open}
          onClose={onClose}
          fullWidth
          maxWidth="sm"
          slotProps={{
            paper: {
              sx: { width: "400px", minHeight: 500, display: 'flex', flexDirection: 'column' }
            }
          }}
      >
        <DialogTitle sx={{ textAlign: 'center', position: 'relative' }}>
          Donate to Our Wedding
          <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {step === 'selection' && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                    Select a donation amount (USD):
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2, width: '100%', alignItems: 'center' }}>
                    {[25, 50, 100].map(amount => (
                        <CustomButton
                            key={amount}
                            variant={!showCustomInput && selectedPreset === amount ? 'dark' : 'light'}
                            onClick={() => { setSelectedPreset(amount); setShowCustomInput(false); }}
                            text={'$' + amount}
                            height={50}
                        />
                    ))}
                    {/* Either show the "Other amount" button or the custom input field */}
                    {!showCustomInput && (
                        <CustomButton
                            variant="light"
                            onClick={() => { setShowCustomInput(true); setCustomAmount(""); }}
                            text={"Other Amount"}
                            height={50}
                        />
                    )}
                    {showCustomInput && (
                        <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              bgcolor: 'primary.main',
                              borderRadius: 1,
                              padding: '8px 12px',
                              color: 'primary.contrastText',
                              height: "50px",
                              width: '100%',
                              maxWidth: 300,
                              mt: 0,
                              mb: 0,
                            }}
                        >
                          <Typography variant="h6" sx={{ mr: 1, color: 'inherit' }}>
                            $
                          </Typography>
                          <TextField
                              autoFocus
                              fullWidth
                              variant="standard"
                              type="text"
                              size="small"
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
                                input: { fontSize: '1.25rem', color: 'primary.contrastText' },
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
                  </Box>
                </>
            )}

            {step === 'payment' && (
                <>
                  <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                    Processing Payment of ${parseFloat(donationAmount).toFixed(2)}
                  </Typography>
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
                      <CircularProgress />
                  )}
                  {message && (
                      <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                        {message}
                      </Typography>
                  )}
                </>
            )}
          </DialogContent>
        </Box>
        <DialogActions
            sx={{
              justifyContent: step === 'selection' ? 'center' : 'space-between',
              width: '100%'
            }}
        >
          {step === 'payment' && (
              <CustomButton width="auto" text="Back" onClick={handleBack} variant="lightOutlined" />
          )}
          <CustomButton
              text={step === 'selection' ? "Continue to Payment" : "Pay"}
              onClick={step === 'selection' ? handleContinue : () => paymentFormRef.current?.submitPayment()}
              variant="dark"
              disabled={step === 'selection' ? !isCustomValid : !isPayEnabled}
              width="auto"
          />
        </DialogActions>
      </Dialog>
  );
};

export default ExpressCheckoutDialog;
