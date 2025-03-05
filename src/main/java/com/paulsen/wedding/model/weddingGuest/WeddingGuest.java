package com.paulsen.wedding.model.weddingGuest;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import java.util.List;

@DynamoDBTable(tableName = "wedding_guest_table")
public class WeddingGuest {

  @DynamoDBHashKey(attributeName = "full_name")
  private String fullName;

  @DynamoDBAttribute(attributeName = "rsvp_ids")
  private List<String> rsvpIds;

  public String getFullName() {
    return fullName;
  }

  public void setFullName(String fullName) {
    this.fullName = fullName;
  }

  public List<String> getRsvpIds() {
    return rsvpIds;
  }

  public void setRsvpIds(List<String> rsvpIds) {
    this.rsvpIds = rsvpIds;
  }
}
