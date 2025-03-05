package com.paulsen.wedding.controllers;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class StripeController {

    // It’s best to inject your Stripe secret key via configuration
    static {
        Stripe.apiKey = "sk_test_51QzKvKJr833cmALTA01BSrKZQo7y5dwbLrfb6ksAzCeQiedOdtsPWqzVWAAnL5mwG3hPr9egQ76JEd2Bn84eHfp200fJLYAc3Y";
    }

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestBody Map<String, Object> data) throws StripeException {
        // Default donation amount is $50 (in cents) if not specified
        long amount = 5000L;
        if (data != null && data.get("amount") != null) {
            try {
                amount = ((Number) data.get("amount")).longValue();
            } catch (Exception e) {
                // fallback to default
            }
        }

        Map<String, Object> params = new HashMap<>();
        params.put("amount", amount);
        params.put("currency", "usd");
        params.put("payment_method_types", List.of("card")); // Enables Apple Pay/Google Pay via Payment Request

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        return ResponseEntity.ok(Map.of("clientSecret", paymentIntent.getClientSecret()));
    }
}
