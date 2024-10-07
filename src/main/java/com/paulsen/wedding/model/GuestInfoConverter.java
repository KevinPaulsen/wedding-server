package com.paulsen.wedding.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverter;

import java.util.Map;

public class GuestInfoConverter implements DynamoDBTypeConverter<Map<String, String>, GuestInfo> {

    @Override
    public Map<String, String> convert(GuestInfo guestInfo) {
        return Map.of(
                "name", guestInfo.name(),
                "email", guestInfo.email(),
                "phoneNumber", guestInfo.phoneNumber(),
                "address", guestInfo.address()
        );
    }

    @Override
    public GuestInfo unconvert(Map<String, String> map) {
        return new GuestInfo(
                map.get("name"),
                map.get("email"),
                map.get("phoneNumber"),
                map.get("address")
        );
    }
}
