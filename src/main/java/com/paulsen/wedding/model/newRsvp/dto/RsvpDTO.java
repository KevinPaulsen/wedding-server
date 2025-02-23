package com.paulsen.wedding.model.newRsvp.dto;

import com.paulsen.wedding.model.newRsvp.Event;
import com.paulsen.wedding.model.newRsvp.GuestInfo;
import com.paulsen.wedding.model.newRsvp.Rsvp;
import com.paulsen.wedding.model.newRsvp.RsvpGuestDetails;

import java.util.List;

public class RsvpDTO {
    private String rsvp_id;
    private boolean is_submitted;
    private GuestInfoDTO primary_contact;
    private List<RsvpGuestDetailsDTO> guest_list;
    private EventDTO roce;
    private EventDTO rehearsal;
    private EventDTO ceremony;
    private EventDTO reception;

    public RsvpDTO() {
    }

    public RsvpDTO(Rsvp rsvp) {
        if (rsvp == null) {
            return;
        }
        this.rsvp_id = rsvp.getRsvpId();
        this.is_submitted = rsvp.isSubmitted();
        this.primary_contact = rsvp.getPrimaryContact() == null ? null : new GuestInfoDTO(rsvp.getPrimaryContact());
        this.guest_list = rsvp.getGuestList() == null ? null : rsvp.getGuestList()
                                                                        .stream()
                                                                        .map(RsvpGuestDetailsDTO::new)
                                                                        .toList();
        this.roce = rsvp.getRoce() == null ? null : new EventDTO(rsvp.getRoce());
        this.rehearsal = rsvp.getRehearsal() == null ? null : new EventDTO(rsvp.getRehearsal());
        this.ceremony = rsvp.getCeremony() == null ? null : new EventDTO(rsvp.getCeremony());
        this.reception = rsvp.getReception() == null ? null : new EventDTO(rsvp.getReception());
    }

    public String getRsvp_id() {
        return rsvp_id;
    }

    public void setRsvp_id(String rsvp_id) {
        this.rsvp_id = rsvp_id;
    }

    public boolean isIs_submitted() {
        return is_submitted;
    }

    public void setIs_submitted(boolean is_submitted) {
        this.is_submitted = is_submitted;
    }

    public GuestInfo getPrimary_contact() {
        if (primary_contact == null) return null;
        return new GuestInfo(primary_contact);
    }

    public void setPrimary_contact(GuestInfo primary_contact) {
        this.primary_contact = new GuestInfoDTO(primary_contact);
    }

    public List<RsvpGuestDetails> getGuest_list() {
        return guest_list == null ? null : guest_list.stream()
                         .map(dto -> new RsvpGuestDetails(dto.getName(), dto.getDietary_Restrictions(), dto.getOther()))
                         .toList();
    }

    public void setGuest_list(List<RsvpGuestDetailsDTO> guest_list) {
        this.guest_list = guest_list;
    }

    public Event getRoce() {
        return roce == null ? null : new Event(roce);
    }

    public void setRoce(EventDTO roce) {
        this.roce = roce;
    }

    public Event getRehearsal() {
        return rehearsal == null ? null : new Event(rehearsal);
    }

    public void setRehearsal(EventDTO rehearsal) {
        this.rehearsal = rehearsal;
    }

    public Event getCeremony() {
        return ceremony == null ? null : new Event(ceremony);
    }

    public void setCeremony(EventDTO ceremony) {
        this.ceremony = ceremony;
    }

    public Event getReception() {
        return reception == null ? null : new Event(reception);
    }

    public void setReception(EventDTO reception) {
        this.reception = reception;
    }
}
