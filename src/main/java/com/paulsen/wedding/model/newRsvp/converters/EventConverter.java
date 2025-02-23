package com.paulsen.wedding.model.newRsvp.converters;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverter;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.paulsen.wedding.model.newRsvp.Event;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class EventConverter implements DynamoDBTypeConverter<AttributeValue, Event> {

    @Override
    public AttributeValue convert(Event event) {
        if (event == null) {
            return new AttributeValue().withNULL(true);
        }

        // Create a map to represent the Event fields
        Map<String, AttributeValue> map = new HashMap<>();

        // Convert allowedGuests (as a number)
        map.put("allowed_guests", new AttributeValue().withN(String.valueOf(event.allowedGuests())));

        // Convert guestsAttending (as a list of string values)
        if (event.guestsAttending() == null) {
            map.put("guests_attending", new AttributeValue().withNULL(true));
        } else {
            List<AttributeValue> guestList = event.guestsAttending()
                                                  .stream()
                                                  .map(guest -> new AttributeValue().withS(guest))
                                                  .collect(Collectors.toList());
            map.put("guests_attending", new AttributeValue().withL(guestList));
        }

        // Return the AttributeValue wrapping the map
        return new AttributeValue().withM(map);
    }

    @Override
    public Event unconvert(AttributeValue attributeValue) {
        if (attributeValue == null || attributeValue.getM() == null) {
            return null;
        }

        Map<String, AttributeValue> map = attributeValue.getM();

        // Extract allowedGuests and parse it to an int
        AttributeValue allowedGuestsAttr = map.get("allowed_guests");
        int allowedGuests = 0;
        if (allowedGuestsAttr != null && allowedGuestsAttr.getN() != null) {
            allowedGuests = Integer.parseInt(allowedGuestsAttr.getN());
        }

        // Extract guestsAttending and convert it to a List<String>
        AttributeValue guestsAttendingAttr = map.get("guests_attending");
        List<String> guestsAttending = null;
        if (guestsAttendingAttr != null && guestsAttendingAttr.getL() != null) {
            guestsAttending = guestsAttendingAttr.getL().stream()
                                                 .map(AttributeValue::getS)
                                                 .toList();
        }

        return new Event(allowedGuests, guestsAttending);
    }
}
