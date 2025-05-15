// src/components/main/registry/ExpressCheckoutDialog.tsx
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  Box, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, Slide, TextField, Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import * as stripeJs from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { createPaymentIntent } from '../../../services/ApiService';
import CustomButton from '../../shared/CustomButton';

// Initialize Stripe
const stripePromise = loadStripe('pk_live_51...');

const appearance = {
  theme: 'flat',
  variables: {
    colorPrimary: '#574c3f',
    colorBackground: '#ece4da',
    colorText: '#574c3f',
    fontFamily: 'EB Garamond',
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
          onMessage('Submission failed: ' + (submitError.message || ''));
          setPaymentLoading(false);
          return;
        }

        const { error } = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: 'https://kevinlovesolivia.com/payment-confirmation',
          },
        });

        onMessage(error ? error.message || 'Payment failed' : 'Payment successful! You will be redirected shortly.');
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
  const [payerName, setPayerName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const paymentFormRef = useRef<PaymentFormHandle>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setStep('selection');
      setClientSecret(null);
      setMessage(null);
      setShowCustomInput(false);
      setCustomAmount('');
      setPayerName('');
    }
  }, [open]);

  const handleBack = () => {
    setStep('selection');
    setClientSecret(null);
    setMessage(null);
  };

  const donationAmount = showCustomInput ? customAmount : selectedPreset.toString();
  const isCustomValid = !showCustomInput ||
      (customAmount.trim() !== '' && !isNaN(parseFloat(customAmount)) && parseFloat(customAmount) >= 0.5);
  const canContinue = payerName.trim() !== '' && isCustomValid;
  const isPayEnabled = !paymentLoading && isPaymentComplete && isCustomValid;

  const handleContinue = () => {
    const amountValue = parseFloat(donationAmount);
    const amount = !isNaN(amountValue) && amountValue > 0
        ? Math.round(amountValue * 100)
        : 5000;

    createPaymentIntent({ amount, payerName })
    .then(response => {
      if (response.success && response.data) {
        setClientSecret(response.data.clientSecret);
        setStep('payment');
      } else {
        setMessage('Error initializing payment.');
      }
    })
    .catch(() => setMessage('Error initializing payment.'));
  };

  return (
      <Dialog
          open={open}
          onClose={onClose}
          fullWidth
          maxWidth="sm"
          slotProps={{ paper: { sx: { width: '400px', minHeight: 500, display: 'flex', flexDirection: 'column' } } }}
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
                <Slide direction="right" in mountOnEnter unmountOnExit>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2, width: '100%', alignItems: 'center' }}>
                    <TextField
                        label="Your Name"
                        size="small"
                        value={payerName}
                        onChange={e => setPayerName(e.target.value)}
                        required
                        sx={{
                          width: "100%",
                          maxWidth: 300,
                        }}
                    />

                    <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                      Select an amount (USD):
                    </Typography>
                    {[25, 50, 100].map(amount => (
                        <CustomButton
                            key={amount}
                            text={`$${amount}`}
                            onClick={() => { setSelectedPreset(amount); setShowCustomInput(false); }}
                            variant={!showCustomInput && selectedPreset === amount ? 'dark' : 'light'}
                            height={50}
                        />
                    ))}
                    {!showCustomInput ? (
                        <CustomButton
                            variant="light"
                            onClick={() => { setShowCustomInput(true); setCustomAmount(''); }}
                            text="Other Amount"
                            height={50}
                        />
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'primary.main', borderRadius: 1, p: '8px 12px', color: 'primary.contrastText', height: 50, width: '100%', maxWidth: 300 }}>
                          <Typography variant="h6" sx={{ mr: 1, color: 'inherit' }}>$</Typography>
                          <TextField
                              autoFocus
                              fullWidth
                              variant="standard"
                              type="text"
                              size="small"
                              value={customAmount}
                              onChange={e => {
                                const v = e.target.value;
                                if (/^\d*\.?\d*$/.test(v)) setCustomAmount(v);
                              }}
                              placeholder="0.00"
                              required
                              onKeyDown={e => {
                                const allowed = ['Backspace','Tab','Enter','Escape','ArrowLeft','ArrowRight','Home','End'];
                                if (allowed.includes(e.key) || e.ctrlKey || e.metaKey) return;
                                if (/\d/.test(e.key)) return;
                                if (e.key === '.' && !customAmount.includes('.')) return;
                                e.preventDefault();
                              }}
                              slotProps={{ input: { disableUnderline: true } }}
                              sx={{ flex: 1, input: { fontSize: '1.25rem', color: 'primary.contrastText' } }}
                          />
                          <IconButton onClick={() => { setShowCustomInput(false); setCustomAmount(''); }} sx={{ color: 'primary.contrastText' }}>
                            <CloseIcon />
                          </IconButton>
                        </Box>
                    )}
                  </Box>
                </Slide>
            )}

            {step === 'payment' && (
                <Slide direction="left" in mountOnEnter unmountOnExit>
                  <Box>
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
                  </Box>
                </Slide>
            )}
          </DialogContent>
        </Box>

        <DialogActions sx={{ justifyContent: step === 'selection' ? 'center' : 'space-between', width: '100%' }}>
          {step === 'payment' && (
              <CustomButton width="auto" text="Back" onClick={handleBack} variant="lightOutlined" />
          )}
          <CustomButton
              text={step === 'selection' ? 'Continue to Payment' : 'Pay'}
              onClick={step === 'selection' ? handleContinue : () => paymentFormRef.current?.submitPayment()}
              variant="dark"
              disabled={step === 'selection' ? !canContinue : !isPayEnabled}
              width="auto"
          />
        </DialogActions>
      </Dialog>
  );
};

export default ExpressCheckoutDialog;
