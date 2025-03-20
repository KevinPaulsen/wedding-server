package com.paulsen.wedding.model.weddingGuest.dto;

public class LookupDTO {

  private String first_name;
  private String last_name;
  private String rsvp_code;

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

  public String getRsvp_code() {
    return rsvp_code;
  }

  public void setRsvp_code(String rsvp_code) {
    this.rsvp_code = rsvp_code;
  }
}
