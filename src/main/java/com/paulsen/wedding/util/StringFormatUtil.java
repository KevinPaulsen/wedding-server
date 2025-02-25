package com.paulsen.wedding.util;

public class StringFormatUtil {

    /**
     * Helper method that normalizes a name.
     */
    public static String formatFullName(String fullName) {
        if (fullName == null || fullName.trim().isBlank()) {
            throw new IllegalArgumentException("Name must not be null or empty.");
        }

        fullName = fullName.trim();
        fullName = fullName.toLowerCase();
        fullName = fullName.replaceAll("\\s+", " ");
        fullName = fullName.replaceAll("[^a-z ]", "*");

        return fullName;
    }

    public static String getFullName(String firstName, String lastName) {
        if (firstName == null || firstName.trim().isBlank() || lastName == null || lastName.trim().isBlank()) {
            throw new IllegalArgumentException("First and last name must not be null or empty.");
        }

        return formatFullName(firstName + " " + lastName);
    }

    public static String capitalize(String word) {
        return word.substring(0, 1).toUpperCase() + word.substring(1);
    }

    public static String strip(String string) {
        if (string == null || string.trim().isBlank()) {
            throw new IllegalArgumentException("Name must not be null or empty.");
        }

        StringBuilder builder = new StringBuilder();

        for (String name : string.split("\\s+")) {
            if (name.isBlank()) continue;

            builder.append(capitalize(name));
            builder.append(" ");
        }

        if (!builder.isEmpty()) builder.deleteCharAt(builder.length() - 1);

        return builder.toString();
    }
}
