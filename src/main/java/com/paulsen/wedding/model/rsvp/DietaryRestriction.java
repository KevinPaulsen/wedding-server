package com.paulsen.wedding.model.rsvp;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import static com.paulsen.wedding.util.StringFormatUtil.strip;

public enum DietaryRestriction {
    VEGETARIAN, VEGAN, GLUTEN_FREE, DAIRY_FREE, NUT_FREE, SHELLFISH_FREE, OTHER;

    @JsonValue
    @Override
    public String toString() {
        return strip(this.name().toLowerCase().replaceAll("_", " "));
    }

    @JsonCreator
    public static DietaryRestriction fromString(String text) {
        return switch (strip(text)) {
            case "Vegetarian" -> VEGETARIAN;
            case "Vegan" -> VEGAN;
            case "Gluten Free" -> GLUTEN_FREE;
            case "Dairy Free" -> DAIRY_FREE;
            case "Nut Free" -> NUT_FREE;
            case "Shellfish Free" -> SHELLFISH_FREE;
            case "Other" -> OTHER;
            default -> throw new IllegalArgumentException("Unknown dietary restriction: " + text);
        };
    }
}
