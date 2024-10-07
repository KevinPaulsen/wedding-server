package com.paulsen.wedding.model;

import java.util.List;

public record RsvpDetails(String name, FoodOption foodOption, List<DietaryRestriction> dietaryRestrictions,
                          String other) {

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof RsvpDetails that))
            return false;

        return name().equals(that.name()) && foodOption() == that.foodOption() && dietaryRestrictions().equals(that.dietaryRestrictions()) && other().equals(that.other());
    }

    @Override
    public int hashCode() {
        int result = name().hashCode();
        result = 31 * result + foodOption().hashCode();
        result = 31 * result + dietaryRestrictions().hashCode();
        result = 31 * result + other().hashCode();
        return result;
    }
}
