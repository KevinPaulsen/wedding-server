package com.paulsen.wedding.model.newRsvp.converters;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverter;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.paulsen.wedding.model.newRsvp.RsvpGuestDetails;
import com.paulsen.wedding.model.newRsvp.DietaryRestriction;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

public class RsvpGuestDetailsMapConverter implements DynamoDBTypeConverter<AttributeValue, Map<String, RsvpGuestDetails>> {

    @Override
    public AttributeValue convert(Map<String, RsvpGuestDetails> guestMap) {
        // Default to an empty map if null.
        guestMap = Objects.requireNonNullElse(guestMap, Collections.emptyMap());
        // Create a map to hold the DynamoDB representation.
        Map<String, AttributeValue> attributeMap = new HashMap<>();
        // For each guest entry...
        for (Map.Entry<String, RsvpGuestDetails> entry : guestMap.entrySet()) {
            String guestName = entry.getKey();
            RsvpGuestDetails details = entry.getValue();

            // Convert dietary_restrictions.
            List<AttributeValue> diets;
            List<DietaryRestriction> restrictions = details.dietaryRestrictions();
            if (restrictions == null || restrictions.isEmpty()) {
                diets = Collections.emptyList();
            } else {
                diets = restrictions.stream()
                                    .map(r -> new AttributeValue().withS(r.name()))
                                    .collect(Collectors.toList());
            }
            // Convert "other". Default to an empty string if null.
            String other = details.other() != null ? details.other() : "";

            // Build a map for the guest details.
            Map<String, AttributeValue> detailsMap = new HashMap<>();
            detailsMap.put("dietary_restrictions", new AttributeValue().withL(diets));
            detailsMap.put("other", new AttributeValue().withS(other));

            // Put the guest entry into the main map.
            attributeMap.put(guestName, new AttributeValue().withM(detailsMap));
        }
        return new AttributeValue().withM(attributeMap);
    }

    @Override
    public Map<String, RsvpGuestDetails> unconvert(AttributeValue object) {
        if (object == null || object.getM() == null) {
            return Collections.emptyMap();
        }
        Map<String, AttributeValue> attributeMap = object.getM();
        Map<String, RsvpGuestDetails> guestMap = new HashMap<>();

        for (Map.Entry<String, AttributeValue> entry : attributeMap.entrySet()) {
            String guestName = entry.getKey();
            AttributeValue detailsAttr = entry.getValue();
            if (detailsAttr == null || detailsAttr.getM() == null) {
                throw new IllegalArgumentException("Invalid guest details for guest: " + guestName);
            }
            Map<String, AttributeValue> detailsMap = detailsAttr.getM();

            // Retrieve dietary_restrictions.
            AttributeValue dietsAttr = detailsMap.get("dietary_restrictions");
            List<DietaryRestriction> restrictions;
            if (dietsAttr == null || dietsAttr.getL() == null) {
                restrictions = Collections.emptyList();
            } else {
                restrictions = dietsAttr.getL().stream().map(av -> {
                    String s = av.getS();
                    if (s == null) {
                        throw new IllegalArgumentException("Invalid dietary restriction for guest: " + guestName);
                    }
                    try {
                        return DietaryRestriction.valueOf(s);
                    } catch (IllegalArgumentException e) {
                        throw new IllegalArgumentException("Invalid dietary restriction value for guest: " + guestName);
                    }
                }).collect(Collectors.toList());
            }

            // Retrieve "other".
            AttributeValue otherAttr = detailsMap.get("other");
            String other = (otherAttr != null && otherAttr.getS() != null) ? otherAttr.getS() : "";

            guestMap.put(guestName, new RsvpGuestDetails(restrictions, other));
        }
        return guestMap;
    }
}
