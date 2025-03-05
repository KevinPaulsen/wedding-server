package com.paulsen.wedding.model.rsvp.converters;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverter;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.paulsen.wedding.model.rsvp.DietaryRestriction;
import com.paulsen.wedding.model.rsvp.RsvpGuestDetails;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

public class RsvpGuestDetailsMapConverter
    implements DynamoDBTypeConverter<AttributeValue, Map<String, RsvpGuestDetails>> {

  @Override
  public AttributeValue convert(Map<String, RsvpGuestDetails> guestMap) {
    guestMap = Objects.requireNonNullElse(guestMap, Collections.emptyMap());
    Map<String, AttributeValue> attributeMap = new HashMap<>();

    for (Map.Entry<String, RsvpGuestDetails> entry : guestMap.entrySet()) {
      String guestName = entry.getKey();
      RsvpGuestDetails details = entry.getValue();

      if (details == null) {
        attributeMap.put(guestName, new AttributeValue().withNULL(true));
        continue;
      }

      // Convert "displayName". Default to an empty string if null.
      String displayName = Objects.requireNonNullElse(details.getDisplayName(), "");

      // Convert dietary_restrictions.
      List<AttributeValue> diets;
      List<DietaryRestriction> restrictions = details.getDietaryRestrictions();
      if (restrictions == null || restrictions.isEmpty()) {
        diets = Collections.emptyList();
      } else {
        diets = restrictions.stream()
            .map(r -> new AttributeValue().withS(r.toString()))
            .collect(Collectors.toList());
      }

      // Convert "other". Default to an empty string if null.
      String other = details.getOther() != null ? details.getOther() : "";

      boolean coming = details.isComing();

      // Build a map for the guest details.
      Map<String, AttributeValue> detailsMap = new HashMap<>();
      detailsMap.put("display_name", new AttributeValue().withS(displayName));
      detailsMap.put("dietary_restrictions", new AttributeValue().withL(diets));
      detailsMap.put("other", new AttributeValue().withS(other));
      detailsMap.put("coming", new AttributeValue().withBOOL(coming));

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

      String displayName = detailsMap.get("display_name").getS();
      if (displayName == null) {
        displayName = "";
      }

      // Retrieve dietary_restrictions.
      AttributeValue dietsAttr = detailsMap.get("dietary_restrictions");
      List<DietaryRestriction> restrictions;
      if (dietsAttr == null || dietsAttr.getL() == null) {
        restrictions = Collections.emptyList();
      } else {
        restrictions = dietsAttr.getL().stream().map(av -> {
          String s = av.getS();
          if (s == null) {
            throw new IllegalArgumentException(
                "Invalid dietary restriction for guest: " + guestName);
          }
          try {
            return DietaryRestriction.fromString(s);
          } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                "Invalid dietary restriction value for guest: " + guestName);
          }
        }).collect(Collectors.toList());
      }

      // Retrieve "other".
      AttributeValue otherAttr = detailsMap.get("other");
      String other = (otherAttr != null && otherAttr.getS() != null) ? otherAttr.getS() : "";

      // Retrieve "coming"
      AttributeValue comingAttr = detailsMap.get("coming");
      boolean coming =
          (comingAttr != null && comingAttr.getBOOL() != null) ? comingAttr.getBOOL() : true;

      guestMap.put(guestName, new RsvpGuestDetails(displayName, restrictions, other, coming));
    }
    return guestMap;
  }
}
