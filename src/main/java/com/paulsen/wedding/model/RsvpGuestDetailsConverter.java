package com.paulsen.wedding.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverter;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RsvpGuestDetailsConverter implements DynamoDBTypeConverter<AttributeValue, List<RsvpGuestDetails>> {

    @Override
    public AttributeValue convert(List<RsvpGuestDetails> object) {
        List<AttributeValue> rsvpGuestDetailAttributes = new ArrayList<>();

        for (RsvpGuestDetails rsvpGuestDetails : object) {
            List<AttributeValue> dietaryAttributes = rsvpGuestDetails.dietaryRestrictions().stream().map(restriction ->
                    new AttributeValue().withS(restriction.name())).toList();

            Map<String, AttributeValue> detailsMap = new HashMap<>();
            detailsMap.put("name", new AttributeValue(rsvpGuestDetails.name()));
            detailsMap.put("food_option", new AttributeValue(rsvpGuestDetails.foodOption().name()));
            detailsMap.put("dietary_restrictions", new AttributeValue().withL(dietaryAttributes));
            detailsMap.put("other", new AttributeValue(rsvpGuestDetails.other()));

            rsvpGuestDetailAttributes.add(new AttributeValue().withM(detailsMap));
        }

        return new AttributeValue().withL(rsvpGuestDetailAttributes);
    }

    // TODO: test this unconvert function
    @Override
    public List<RsvpGuestDetails> unconvert(AttributeValue object) {
        List<RsvpGuestDetails> rsvpGuestDetails = new ArrayList<>();
        List<AttributeValue> rsvpDetails = object.getL();

        if (rsvpDetails == null) {
            return null;
        }

        for (AttributeValue rsvpDetail : rsvpDetails) {
            Map<String, AttributeValue> rsvpEntries = rsvpDetail.getM();

            if (rsvpEntries == null) {
                continue;
            }

            // TODO: Make this null safe
            String name = rsvpEntries.get("name").getS();
            FoodOption foodOption = FoodOption.valueOf(rsvpEntries.get("food_option").getS());
            List<DietaryRestriction> dietaryRestrictions = rsvpEntries.get("dietary_restrictions").getL()
                    .stream()
                    .map(restriction -> DietaryRestriction.valueOf(restriction.getS()))
                    .toList();
            String other = rsvpEntries.get("other").getS();

            rsvpGuestDetails.add(new RsvpGuestDetails(name, foodOption, dietaryRestrictions, other));
        }


        return rsvpGuestDetails;
    }
}
