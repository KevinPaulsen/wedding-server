package com.paulsen.wedding.model.rsvp.converters;

import com.amazonaws.services.dynamodbv2.model.AttributeValue;

import java.util.Map;

public abstract class ConverterBase {

    protected String getStringValue(Map<String, AttributeValue> map, String key, boolean required) {
        AttributeValue value = map.get(key);
        if (value == null || value.getS() == null) {
            if (required) {
                throw new IllegalArgumentException("Missing required string value for key: " + key);
            }
            return null;
        }
        return value.getS();
    }
}
