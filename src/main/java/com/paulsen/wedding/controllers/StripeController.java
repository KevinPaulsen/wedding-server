package com.paulsen.wedding.controllers;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/create-checkout-session")
public class StripeController {

  // It’s best to inject your Stripe secret key via configuration
  static {
    Stripe.apiKey = "sk_test_51QzKvKJr833cmALTA01BSrKZQo7y5dwbLrfb6ksAzCeQiedOdtsPWqzVWAAnL5mwG3hPr9egQ76JEd2Bn84eHfp200fJLYAc3Y";
  }

  @PostMapping
  public ResponseEntity<Map<String, String>> createCheckoutSession() throws StripeException {
    SessionCreateParams params = SessionCreateParams.builder()
        .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
        .addPaymentMethodType(SessionCreateParams.PaymentMethodType.MOBILEPAY)
        .setMode(SessionCreateParams.Mode.PAYMENT)
        .setSuccessUrl("https://kevinlovesolivia.com/success")
        .setCancelUrl("https://kevinlovesolivia.com.com/registry")
        .addLineItem(
            SessionCreateParams.LineItem.builder()
                .setQuantity(1L)
                .setPriceData(
                    SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency("usd")
                        .setUnitAmount(5000L) // e.g., $50 donation (in cents)
                        .setProductData(
                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                .setName("Wedding Donation")
                                .build()
                        )
                        .build()
                )
                .build()
        )
        .build();

    Session session = Session.create(params);
    return ResponseEntity.ok(Map.of("url", session.getUrl()));
  }
}
