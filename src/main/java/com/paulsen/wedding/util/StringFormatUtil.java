package com.paulsen.wedding.util;

import com.stripe.model.tax.Registration;
import java.text.Normalizer;
import java.util.Locale;

public class StringFormatUtil {

  /**
   * Helper method that normalizes a name.
   */
  public static String formatToIndexName(String fullName) {
    if (fullName == null || fullName.trim().isBlank()) {
      throw new IllegalArgumentException("Name must not be null or empty.");
    }

    fullName = fullName.toLowerCase(Locale.ROOT);

    // Normalize to remove accents
    fullName = Normalizer.normalize(fullName, Normalizer.Form.NFD);
    fullName = fullName.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");

    // Collapse multiple spaces
    fullName = fullName.replaceAll("\\s+", " ");

    // Remove apostrophes and similar characters
    fullName = fullName.replaceAll("['’`]", "");

    // Replace hyphens with spaces
    fullName = fullName.replace("-", " ");

    fullName = fullName.strip();

    return fullName;
  }

  public static String formatToIndexName(String firstName, String lastName) {
    if (firstName == null || firstName.trim().isBlank()) {
      throw new IllegalArgumentException("First name must not be null or empty.");
    } else if(lastName == null || lastName.trim().isBlank()) {
      throw new IllegalArgumentException("Last name must not be null or empty.");
    }

    return formatToIndexName(String.format("%s %s", firstName, lastName));
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
      if (name.isBlank()) {
        continue;
      }

      builder.append(capitalize(name));
      builder.append(" ");
    }

    if (!builder.isEmpty()) {
      builder.deleteCharAt(builder.length() - 1);
    }

    return builder.toString();
  }

  public static String formatRsvpCode(String rsvpCode) {
    if (rsvpCode == null || rsvpCode.trim().isBlank()) {
      throw new IllegalArgumentException("RSVP Code must not be null or empty.");
    }

    return rsvpCode.trim().toUpperCase();
  }
}
