package com.paulsen.wedding.service;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailService;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailServiceClientBuilder;
import com.amazonaws.services.simpleemail.model.Body;
import com.amazonaws.services.simpleemail.model.Content;
import com.amazonaws.services.simpleemail.model.Destination;
import com.amazonaws.services.simpleemail.model.Message;
import com.amazonaws.services.simpleemail.model.SendEmailRequest;
import com.paulsen.wedding.model.rsvp.Event;
import com.paulsen.wedding.model.rsvp.EventInfo;
import com.paulsen.wedding.model.rsvp.Rsvp;
import com.paulsen.wedding.model.rsvp.RsvpGuestDetails;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

  private static final String FROM_EMAIL = "noreply@kevinlovesolivia.com"; // Must be verified in SES

  private final AmazonSimpleEmailService sesClient;

  public EmailService() {
    this.sesClient = AmazonSimpleEmailServiceClientBuilder.standard()
        .withRegion(Regions.US_WEST_2) // Use your actual SES region
        .build();
  }

  public void sendConfirmationEmail(String recipient, Rsvp rsvp) {
    String htmlBody = buildEmailHtml(rsvp);
    String fallbackText = "Thank you for submitting your RSVP. Please view the schedule details online.";
    String subject = "Kevin & Olivia Wedding RSVP Confirmation";

    SendEmailRequest request = new SendEmailRequest()
        .withSource(FROM_EMAIL)
        .withDestination(new Destination().withToAddresses(recipient))
        .withMessage(new Message()
            .withSubject(new Content().withCharset("UTF-8").withData(subject))
            .withBody(new Body()
                .withHtml(new Content().withCharset("UTF-8").withData(htmlBody))
                .withText(new Content().withCharset("UTF-8").withData(fallbackText))));

    sesClient.sendEmail(request);
  }

  private String buildEmailHtml(Rsvp rsvp) {
    // Retrieve the guest's name from the primary contact.
    String primaryName =
        (rsvp.getPrimaryContact() != null && rsvp.getPrimaryContact().getName() != null)
            ? rsvp.getGuestList().get(rsvp.getPrimaryContact().getName()).getDisplayName()
            : "Guest";

    StringBuilder sb = new StringBuilder();
    sb.append("""
          <html>
            <head>
              <meta name="color-scheme" content="light">
              <meta name="supported-color-schemes" content="light">
              <style>
                @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap');
                body, div, p, h1, h2 {
                  font-family: 'EB Garamond', Georgia, serif !important;
                  margin: 0;
                  padding: 0;
                }
              </style>
            </head>
            <body style="margin:0; padding:16px; background-color:#ece4da; text-align: center;">
              <div style="width:100%; background-color:#ece4da; padding:40px 0;">
                <h1 style="font-size:32px; margin-bottom:20px; color:#574c3f;">
        """);
    sb.append("Thank you for submitting your RSVP %s!".formatted(primaryName));
    sb.append("</h1>");

    // Append a card for each event that is both invited and has at least one guest attending.
    if (rsvp.getRoce() != null && Boolean.TRUE.equals(rsvp.getRoce().getInvited())) {
      sb.append(buildEventCard(rsvp.getRoce(), EventInfo.ROCE, rsvp));
    }
    if (rsvp.getRehearsal() != null && Boolean.TRUE.equals(rsvp.getRehearsal().getInvited())) {
      sb.append(buildEventCard(rsvp.getRehearsal(), EventInfo.REHEARSAL, rsvp));
    }
    if (rsvp.getCeremony() != null && Boolean.TRUE.equals(rsvp.getCeremony().getInvited())) {
      sb.append(buildEventCard(rsvp.getCeremony(), EventInfo.CEREMONY, rsvp));
    }
    if (rsvp.getReception() != null && Boolean.TRUE.equals(rsvp.getReception().getInvited())) {
      sb.append(buildEventCard(rsvp.getReception(), EventInfo.RECEPTION, rsvp));
    }

    // Wedding Footer, mimicking your React WeddingFooter component.
    sb.append("""
                <footer style="margin-top:30px; text-align:center;">
                  <div style="max-width:600px; margin:0 auto;">
                    <h2 style="font-size:24px; margin:0; color:#574c3f; text-align:center; font-weight:normal">K &amp; O</h2>
                    <div style="height:2px; width:100px; background-color:#b0643f; margin:10px auto;"></div>
                    <p style="font-size:16px; margin:0; color:#574c3f; text-align:center;">9 . 13. 2025</p>
                    <p style="font-size:14px; margin:5px 0 0 0; color:#574c3f; text-align:center;">kevinoliviapaulsen@gmail.com</p>
                  </div>
                </footer>
              </div>
            </body>
          </html>
        """);

    return sb.toString();
  }

  /**
   * Builds an HTML card for a single event, without any calendar link.
   */
  private String buildEventCard(Event event, EventInfo info, Rsvp rsvp) {
    // Build a comma‑separated list of guest display names.
    List<String> guestIndexes = event.getGuestsAttending();
    boolean noGuests = guestIndexes == null || guestIndexes.isEmpty();
    String guestsString = !noGuests && rsvp.getGuestList() != null
        ? guestIndexes.stream()
        .map(key -> {
          RsvpGuestDetails d = rsvp.getGuestList().get(key);
          return (d != null) ? d.getDisplayName() : key;
        })
        .collect(Collectors.joining(", "))
        : "";

    // Conditionally include the NOT ATTENDING header
    String notAttendingHtml = noGuests
        ? "<h3 style=\"color:#b0643f; margin:0 0 0;\">(Not Attending)</h3>"
        : "";

    return String.format("""
    <div style="max-width:600px; margin:20px auto; background-color:#d4c8ba; border:1px solid #cbb8a0; border-radius:10px; padding:20px; text-align:center;">
      <h2 style="color:#b0643f;">%s</h2>
      %s
      <p style="color:#574c3f; margin:10px 0 0;"><strong>%s</strong></p>
      <p style="color:#574c3f; margin:0 0 0;">%s, %s</p>

      <!-- Guests Attending Label with underline -->
      <p style="
          margin:10px 0 0;
          color:#574c3f;
          font-weight:bold;
          display:inline-block;
          border-bottom:1px solid #574c3f;
        ">
        Guests Attending
      </p>

      <p style="color:#574c3f; margin:5px 0;">%s</p>
    </div>
  """,
        info.getTitle(),       // 1: Event title
        notAttendingHtml,      // 2: Optional NOT ATTENDING line
        info.getDateTime(),    // 3: Date & Time (bold)
        info.getLocation(),    // 4: Location name
        info.getAddress(),     // 5: Address
        noGuests ? "No guests attending" : guestsString  // 6: guest list or fallback
    );
  }
}
