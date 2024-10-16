package com.paulsen.wedding.model.rsvp;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverter;

import java.util.Map;
import java.util.Objects;

public class GuestInfoConverter implements DynamoDBTypeConverter<Map<String, String>, GuestInfo> {

    @Override public Map<String, String> convert(GuestInfo guestInfo) {
        return Map.of("name", Objects.requireNonNullElse(guestInfo.name(), ""), "email",
                      Objects.requireNonNullElse(guestInfo.email(), ""), "phoneNumber",
                      Objects.requireNonNullElse(guestInfo.phoneNumber(), ""), "address",
                      Objects.requireNonNullElse(guestInfo.address(), ""));
    }

    @Override public GuestInfo unconvert(Map<String, String> map) {
        return new GuestInfo(map.get("name"), map.get("email"), map.get("phoneNumber"), map.get("address"));
    }
}
