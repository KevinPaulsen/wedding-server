package com.paulsen.wedding.util;

public class StringFormatUtil {

    /**
     * Helper method that normalizes a name.
     */
    public static String formatFullName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            throw new IllegalArgumentException("Name must not be null or empty.");
        }

        fullName = fullName.trim();
        fullName = fullName.toLowerCase();
        fullName = fullName.replaceAll("\\s+", " ");
        fullName = fullName.replaceAll("[^a-z ]", "*");

        return fullName;
    }

    public static String getFullName(String firstName, String lastName) {
        if (firstName == null || firstName.trim().isEmpty() || lastName == null || lastName.trim().isEmpty()) {
            throw new IllegalArgumentException("First and last name must not be null or empty.");
        }

        return formatFullName(firstName + " " + lastName);
    }
}
