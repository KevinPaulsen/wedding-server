package com.paulsen.wedding.model.rsvp.converters;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverter;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.paulsen.wedding.model.rsvp.WeddingPrimaryContact;

import java.util.Map;
import java.util.Objects;

public class GuestInfoConverter extends ConverterBase implements DynamoDBTypeConverter<AttributeValue, WeddingPrimaryContact> {

    @Override public AttributeValue convert(WeddingPrimaryContact guestInfo) {
        AttributeValue name = new AttributeValue().withS(Objects.requireNonNullElse(guestInfo.getName(), ""));
        AttributeValue phone = new AttributeValue().withS(Objects.requireNonNullElse(guestInfo.getPhoneNumber(), ""));
        AttributeValue email = new AttributeValue().withS(Objects.requireNonNullElse(guestInfo.getEmail(), ""));
        AttributeValue address = new AttributeValue().withS(Objects.requireNonNullElse(guestInfo.getAddress(), ""));
        return new AttributeValue().withM(Map.of("name",
                                                 name,
                                                 "email",
                                                 email,
                                                 "phone_number",
                                                 phone,
                                                 "address",
                                                 address));
    }

    @Override public WeddingPrimaryContact unconvert(AttributeValue object) {
        WeddingPrimaryContact unconverted;
        Map<String, AttributeValue> guestInfo = object.getM();

        if (guestInfo == null) {
            throw new IllegalArgumentException("Input is improperly formatted: 'Map' attribute is null.");
        }

        try {
            // Null-safe retrieval of values with error handling
            String name = getStringValue(guestInfo, "name", true);
            String email = getStringValue(guestInfo, "email", true);
            String phone = getStringValue(guestInfo, "phone_number", true);
            String address = getStringValue(guestInfo, "address", false);

            // Add the guest details to the list
            unconverted = new WeddingPrimaryContact(name, email, phone, address);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error while parsing RSVP details: " + e.getMessage(), e);
        }

        return unconverted;
    }
}
