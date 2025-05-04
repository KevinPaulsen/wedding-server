package com.paulsen.wedding.model;

public class CreatePaymentIntentRequest {
  private Long amount;
  private String payerName;

  public Long getAmount() {
    return amount;
  }
  public void setAmount(Long amount) {
    this.amount = amount;
  }

  public String getPayerName() {
    return payerName;
  }
  public void setPayerName(String payerName) {
    this.payerName = payerName;
  }
}
