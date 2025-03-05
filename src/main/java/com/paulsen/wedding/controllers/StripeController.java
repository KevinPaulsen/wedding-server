package com.paulsen.wedding.controllers;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StripeController {

    // Set your secret key (switch to live key in production)
    static {
        Stripe.apiKey = "sk_test_51QzKvKJr833cmALTA01BSrKZQo7y5dwbLrfb6ksAzCeQiedOdtsPWqzVWAAnL5mwG3hPr9egQ76JEd2Bn84eHfp200fJLYAc3Y";
    }

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestBody Map<String, Object> data) throws StripeException {
        long amount = 5000L; // default to $50 if no amount provided
        if (data.get("amount") != null) {
            amount = ((Number) data.get("amount")).longValue();
        }
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount(amount)
            .setCurrency("usd")
            // Enable automatic payment methods (which powers the Express Checkout Element)
            .setAutomaticPaymentMethods(
                PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                    .setEnabled(true)
                    .build()
            )
            .build();
        PaymentIntent paymentIntent = PaymentIntent.create(params);
        return ResponseEntity.ok(Map.of("clientSecret", paymentIntent.getClientSecret()));
    }
}
