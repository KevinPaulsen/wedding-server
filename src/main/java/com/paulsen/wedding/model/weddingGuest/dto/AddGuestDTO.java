package com.paulsen.wedding.model.weddingGuest.dto;

public class AddGuestDTO {

  private String first_name;
  private String last_name;
  private String rsvp_id;

  public String getFirst_name() {
    return first_name;
  }

  public void setFirst_name(String first_name) {
    this.first_name = first_name;
  }

  public String getLast_name() {
    return last_name;
  }

  public void setLast_name(String last_name) {
    this.last_name = last_name;
  }

  public String getRsvp_id() {
    return rsvp_id;
  }

  public void setRsvp_id(String rsvp_id) {
    this.rsvp_id = rsvp_id;
  }
}
