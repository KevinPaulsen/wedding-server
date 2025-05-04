// src/main/java/com/paulsen/wedding/config/StripeConfig.java
package com.paulsen.wedding.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {

  @Value("${stripe.secret-key}")
  private String secretKey;

  @PostConstruct
  public void init() {
    // set the Stripe API key at startup, once
    Stripe.apiKey = secretKey;
  }
}
