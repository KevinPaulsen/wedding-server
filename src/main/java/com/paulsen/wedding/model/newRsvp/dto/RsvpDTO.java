package com.paulsen.wedding.model.newRsvp.dto;

import com.paulsen.wedding.model.newRsvp.Event;
import com.paulsen.wedding.model.newRsvp.GuestInfo;
import com.paulsen.wedding.model.newRsvp.Rsvp;
import com.paulsen.wedding.model.newRsvp.RsvpGuestDetails;

import java.util.List;

public class RsvpDTO {
    private String rsvp_id;
    private GuestInfo primary_contact;
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
        this.primary_contact = rsvp.getPrimaryContact();
        this.guest_list = rsvp.getGuestList() == null ? List.of() : rsvp.getGuestList()
                                                                        .stream()
                                                                        .map(RsvpGuestDetailsDTO::new)
                                                                        .toList();
        this.roce = new EventDTO(rsvp.getRoce());
        this.rehearsal = new EventDTO(rsvp.getRehearsal());
        this.ceremony = new EventDTO(rsvp.getCeremony());
        this.reception = new EventDTO(rsvp.getReception());
    }

    public String getRsvp_id() {
        return rsvp_id;
    }

    public void setRsvp_id(String rsvp_id) {
        this.rsvp_id = rsvp_id;
    }

    public GuestInfo getPrimary_contact() {
        return primary_contact;
    }

    public void setPrimary_contact(GuestInfo primary_contact) {
        this.primary_contact = primary_contact;
    }

    public List<RsvpGuestDetails> getGuest_list() {
        return guest_list.stream()
                         .map(dto -> new RsvpGuestDetails(dto.getName(), dto.getDietary_Restrictions(), dto.getOther()))
                         .toList();
    }

    public void setGuest_list(List<RsvpGuestDetailsDTO> guest_list) {
        this.guest_list = guest_list;
    }

    public Event getRoce() {
        return new Event(roce.getAllowed_guests(), roce.getGuests_attending());
    }

    public void setRoce(EventDTO roce) {
        this.roce = roce;
    }

    public Event getRehearsal() {
        return new Event(rehearsal.getAllowed_guests(), rehearsal.getGuests_attending());
    }

    public void setRehearsal(EventDTO rehearsal) {
        this.rehearsal = rehearsal;
    }

    public Event getCeremony() {
        return new Event(ceremony.getAllowed_guests(), ceremony.getGuests_attending());
    }

    public void setCeremony(EventDTO ceremony) {
        this.ceremony = ceremony;
    }

    public Event getReception() {
        return new Event(reception.getAllowed_guests(), reception.getGuests_attending());
    }

    public void setReception(EventDTO reception) {
        this.reception = reception;
    }
}
