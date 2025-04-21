package com.paulsen.wedding.model.rsvp;

public enum EventInfo {
  ROCE(
      "Roce",
      "September 11th, 2025 6:30 PM",
      "Location TBD",
      "",
      "BEGIN:VCALENDAR\n" +
          "VERSION:2.0\n" +
          "BEGIN:VEVENT\n" +
          "UID:ROCE@kevinlovesolivia.com\n" +
          "DTSTAMP:20250911T020000Z\n" +
          "DTSTART;TZID=America/Los_Angeles:20250911T183000\n" +
          "DTEND;TZID=America/Los_Angeles:20250911T193000\n" +
          "SUMMARY:Roce\n" +
          "LOCATION:Location TBD\n" +
          "DESCRIPTION:Join us for Roce\n" +
          "END:VEVENT\n" +
          "END:VCALENDAR"
  ),
  REHEARSAL(
      "Rehearsal Dinner",
      "September 12th, 2025 6:00 PM",
      "Location TBD",
      "",
      "BEGIN:VCALENDAR\n" +
          "VERSION:2.0\n" +
          "BEGIN:VEVENT\n" +
          "UID:REHEARSAL@kevinlovesolivia.com\n" +
          "DTSTAMP:20250912T020000Z\n" +
          "DTSTART;TZID=America/Los_Angeles:20250912T180000\n" +
          "DTEND;TZID=America/Los_Angeles:20250912T190000\n" +
          "SUMMARY:Rehearsal Dinner\n" +
          "LOCATION:Location TBD\n" +
          "DESCRIPTION:Join us for the Rehearsal Dinner\n" +
          "END:VEVENT\n" +
          "END:VCALENDAR"
  ),
  CEREMONY(
      "Ceremony",
      "September 13th, 2025 12:30 PM",
      "Blessed Sacrament Church",
      "5050 8th Ave NE, Seattle, WA 98105",
      "BEGIN:VCALENDAR\n" +
          "VERSION:2.0\n" +
          "BEGIN:VEVENT\n" +
          "UID:CEREMONY@kevinlovesolivia.com\n" +
          "DTSTAMP:20250913T020000Z\n" +
          "DTSTART;TZID=America/Los_Angeles:20250913T123000\n" +
          "DTEND;TZID=America/Los_Angeles:20250913T133000\n" +
          "SUMMARY:Ceremony\n" +
          "LOCATION:Blessed Sacrament Church, 5050 8th Ave NE, Seattle, WA 98105\n" +
          "DESCRIPTION:Join us for the Ceremony\n" +
          "END:VEVENT\n" +
          "END:VCALENDAR"
  ),
  RECEPTION(
      "Reception",
      "September 13th, 2025 5:30 PM",
      "Pickering Barn",
      "1730 10th Ave NW, Issaquah, WA 98027",
      "BEGIN:VCALENDAR\n" +
          "VERSION:2.0\n" +
          "BEGIN:VEVENT\n" +
          "UID:RECEPTION@kevinlovesolivia.com\n" +
          "DTSTAMP:20250913T020000Z\n" +
          "DTSTART;TZID=America/Los_Angeles:20250913T173000\n" +
          "DTEND;TZID=America/Los_Angeles:20250913T183000\n" +
          "SUMMARY:Reception\n" +
          "LOCATION:Pickering Barn, 1730 10th Ave NW, Issaquah, WA 98027\n" +
          "DESCRIPTION:Join us for the Reception\n" +
          "END:VEVENT\n" +
          "END:VCALENDAR"
  );

  private final String title;
  private final String dateTime;
  private final String location;
  private final String address;
  private final String icsContent;

  EventInfo(String title, String dateTime, String location, String address, String icsContent) {
    this.title = title;
    this.dateTime = dateTime;
    this.location = location;
    this.address = address;
    this.icsContent = icsContent;
  }

  public String getTitle() {
    return title;
  }

  public String getDateTime() {
    return dateTime;
  }

  public String getLocation() {
    return location;
  }

  public String getAddress() {
    return address;
  }

  public String getIcsContent() {
    return icsContent;
  }
}
