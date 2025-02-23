/*package com.paulsen.wedding.model.newRsvp.converters;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverter;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.paulsen.wedding.model.newRsvp.DietaryRestriction;
import com.paulsen.wedding.model.newRsvp.RsvpGuestDetails;
import com.paulsen.wedding.model.rsvp.FoodOption;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

public class RsvpGuestDetailsConverter extends ConverterBase implements DynamoDBTypeConverter<AttributeValue, List<RsvpGuestDetails>> {

    @Override public AttributeValue convert(List<RsvpGuestDetails> allGuestDetails) {
        allGuestDetails = Objects.requireNonNullElse(allGuestDetails, Collections.emptyList());

        // Use stream to transform each RsvpGuestDetails into an AttributeValue
        List<AttributeValue> rsvpGuestDetailAttributes = allGuestDetails.stream()
                                                                        .filter(Objects::nonNull)
                                                                        .map(this::convertGuestDetailsToAttributeValue)
                                                                        .collect(Collectors.toList());

        return new AttributeValue().withL(rsvpGuestDetailAttributes);
    }

    private AttributeValue convertGuestDetailsToAttributeValue(RsvpGuestDetails guestDetails) {
        var name = new AttributeValue(Objects.requireNonNullElse(guestDetails.name(), ""));
        var diets = new AttributeValue().withL(Objects.requireNonNullElse(guestDetails.dietaryRestrictions(),
                                                                          new ArrayList<DietaryRestriction>())
                                                      .stream()
                                                      .map(restriction -> new AttributeValue().withS(restriction.name()))
                                                      .toList());
        var other = new AttributeValue(Objects.requireNonNullElse(guestDetails.other(), ""));

        // Create a map with guest details as AttributeValue
        var detailsMap = Map.of("name", name, "dietary_restrictions", diets, "other", other);

        return new AttributeValue().withM(detailsMap);
    }

    @Override public List<RsvpGuestDetails> unconvert(AttributeValue object) {
        List<RsvpGuestDetails> rsvpGuestDetails = new ArrayList<>();
        List<AttributeValue> rsvpDetails = object.getL();

        if (rsvpDetails == null) {
            throw new IllegalArgumentException(
                    "Input AttributeValue is improperly formatted: 'List' attribute is " + "null.");
        }

        for (AttributeValue rsvpDetail : rsvpDetails) {
            Map<String, AttributeValue> rsvpEntries = rsvpDetail.getM();

            if (rsvpEntries == null) {
                throw new IllegalArgumentException(
                        "Input AttributeValue is improperly formatted: 'Map' attribute is null.");
            }

            try {
                // Null-safe retrieval of values with error handling
                String name = getStringValue(rsvpEntries, "name", true);
                List<DietaryRestriction> dietaryRestrictions = getDietaryRestrictionsList(rsvpEntries);
                String other = getStringValue(rsvpEntries, "other", false);

                // Add the guest details to the list
                rsvpGuestDetails.add(new RsvpGuestDetails(name, dietaryRestrictions, other));

            } catch (Exception e) {
                throw new IllegalArgumentException("Error while parsing RSVP details: " + e.getMessage(), e);
            }
        }

        return rsvpGuestDetails;
    }

    private FoodOption getFoodOption(Map<String, AttributeValue> map) {
        AttributeValue value = map.get("foodOption");
        if (value == null || value.getS() == null) {
            return null;
        }
        try {
            return FoodOption.valueOf(value.getS());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Invalid enum value for key: " + "foodOption" + ". Expected values are: " +
                    Arrays.toString(FoodOption.values()));
        }
    }

    private List<DietaryRestriction> getDietaryRestrictionsList(Map<String, AttributeValue> map) {
        AttributeValue listValue = map.get("dietary_restrictions");
        if (listValue == null || listValue.getL() == null) {
            return Collections.emptyList(); // Return an empty list if the value is missing
        }
        return listValue.getL().stream().map(attribute -> {
            if (attribute.getS() == null) {
                throw new IllegalArgumentException("Invalid value in list for key: " + "dietary_restrictions");
            }
            try {
                return Enum.valueOf(DietaryRestriction.class, attribute.getS());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid enum value in list for key: " + "dietary_restrictions");
            }
        }).collect(Collectors.toList());
    }
}
*/