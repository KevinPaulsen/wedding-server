package com.paulsen.wedding.controllers;

import com.paulsen.wedding.model.CreatePaymentIntentRequest;
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

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(
        @RequestBody CreatePaymentIntentRequest req
    ) throws StripeException {
        long amount = (req.getAmount() != null) ? req.getAmount() : 5000L;

        PaymentIntentCreateParams.Builder params = PaymentIntentCreateParams.builder()
            .setAmount(amount)
            .setCurrency("usd")
            .addPaymentMethodType("card");

        if (req.getPayerName() != null) {
            params.putMetadata("payer_name", req.getPayerName());
        }

        PaymentIntent pi = PaymentIntent.create(params.build());
        return ResponseEntity.ok(Map.of("clientSecret", pi.getClientSecret()));
    }
}
