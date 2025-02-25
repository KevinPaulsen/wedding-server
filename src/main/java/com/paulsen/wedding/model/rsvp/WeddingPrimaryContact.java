package com.paulsen.wedding.model.rsvp;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.fasterxml.jackson.annotation.JsonProperty;

public class WeddingPrimaryContact {

    @DynamoDBAttribute(attributeName="name") private String name;
    @DynamoDBAttribute(attributeName="email") private String email;
    @DynamoDBAttribute(attributeName="phone_number") private String phoneNumber;
    @DynamoDBAttribute(attributeName="address") private String address;

    public WeddingPrimaryContact() {
    }

    public WeddingPrimaryContact(String name, String email, String phoneNumber, String address) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @JsonProperty("phone_number") public String getPhoneNumber() {
        return phoneNumber;
    }

    @JsonProperty("phone_number") public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
