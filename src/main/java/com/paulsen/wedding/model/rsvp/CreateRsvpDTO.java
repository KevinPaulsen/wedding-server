package com.paulsen.wedding.model.rsvp;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.paulsen.wedding.util.StringFormatUtil;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class CreateRsvpDTO {

  private String primaryName;
  private String phoneNumber;
  private String email;
  private String address;

  private Set<String> allowedGuestDisplayNames;

  private Boolean hasRoceInvitation;
  private Boolean hasRehearsalInvitation;
  private Boolean hasCeremonyInvitation;
  private Boolean hasReceptionInvitation;

  private static Map<String, RsvpGuestDetails> toRsvpGuestDetailsMap(
      Set<String> allowedGuestDisplayNames) {
    if (allowedGuestDisplayNames == null) {
      return Collections.emptyMap();
    }

    Map<String, RsvpGuestDetails> rsvpGuestDetailsMap = new HashMap<>();

    for (String displayName : allowedGuestDisplayNames) {
      rsvpGuestDetailsMap.put(StringFormatUtil.formatToIndexName(displayName),
          new RsvpGuestDetails(displayName));
    }

    return rsvpGuestDetailsMap;
  }

  public Rsvp toRsvp() {
    Rsvp rsvp = new Rsvp();

    rsvp.setSubmitted(false);
    rsvp.setPrimaryContact(new WeddingPrimaryContact(primaryName, email, phoneNumber, address));
    rsvp.setGuestList(toRsvpGuestDetailsMap(allowedGuestDisplayNames));
    List<String> indexNames = rsvp.getGuestList().keySet().stream().toList();
    rsvp.setRoce(new Event(hasRoceInvitation, indexNames));
    rsvp.setRehearsal(new Event(hasRehearsalInvitation, indexNames));
    rsvp.setCeremony(new Event(hasCeremonyInvitation, indexNames));
    rsvp.setReception(new Event(hasReceptionInvitation, indexNames));

    return rsvp;
  }

  @JsonProperty("primary_name")
  public String getPrimaryName() {
    return primaryName;
  }

  @JsonProperty("primary_name")
  public void setPrimaryName(String primaryName) {
    this.primaryName = primaryName;
  }

  @JsonProperty("phone_number")
  public String getPhoneNumber() {
    return phoneNumber;
  }

  @JsonProperty("phone_number")
  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  @JsonProperty("email")
  public String getEmail() {
    return email;
  }

  @JsonProperty("email")
  public void setEmail(String email) {
    this.email = email;
  }

  @JsonProperty("address")
  public String getAddress() {
    return address;
  }

  @JsonProperty("address")
  public void setAddress(String address) {
    this.address = address;
  }

  @JsonProperty("allowed_guests")
  public Set<String> getAllowedGuestDisplayNames() {
    return allowedGuestDisplayNames;
  }

  @JsonProperty("allowed_guests")
  public void setAllowedGuestDisplayNames(Set<String> allowedGuestDisplayNames) {
    this.allowedGuestDisplayNames = allowedGuestDisplayNames;
  }

  @JsonProperty("roce_invitation")
  public Boolean getHasRoceInvitation() {
    return hasRoceInvitation;
  }

  @JsonProperty("roce_invitation")
  public void setHasRoceInvitation(Boolean hasRoceInvitation) {
    this.hasRoceInvitation = hasRoceInvitation;
  }

  @JsonProperty("rehearsal_invitation")
  public Boolean getHasRehearsalInvitation() {
    return hasRehearsalInvitation;
  }

  @JsonProperty("rehearsal_invitation")
  public void setHasRehearsalInvitation(Boolean hasRehearsalInvitation) {
    this.hasRehearsalInvitation = hasRehearsalInvitation;
  }

  @JsonProperty("ceremony_invitation")
  public Boolean getHasCeremonyInvitation() {
    return hasCeremonyInvitation;
  }

  @JsonProperty("ceremony_invitation")
  public void setHasCeremonyInvitation(Boolean hasCeremonyInvitation) {
    this.hasCeremonyInvitation = hasCeremonyInvitation;
  }

  @JsonProperty("reception_invitation")
  public Boolean getHasReceptionInvitation() {
    return hasReceptionInvitation;
  }

  @JsonProperty("reception_invitation")
  public void setHasReceptionInvitation(Boolean hasReceptionInvitation) {
    this.hasReceptionInvitation = hasReceptionInvitation;
  }
}
