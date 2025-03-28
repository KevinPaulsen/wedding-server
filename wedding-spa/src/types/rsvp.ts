// types/rsvp.ts

export interface GuestListDetail {
  display_name: string;
  dietary_restrictions: string[];
  other: string;
  coming: boolean;
}

export interface RsvpGuestDetailWithId extends GuestListDetail {
  id: string;
}

export interface PrimaryContact {
  name: string;
  email: string;
  phone_number: string;
  address: string;
}

export interface Event {
  invited: boolean;
  guests_attending: string[];
}

export interface Rsvp {
  rsvp_id: string;
  creation_time: number;
  last_submission_time: number;
  submitted: boolean;
  primary_contact: PrimaryContact;
  guest_list: { [key: string]: GuestListDetail };
  roce: Event;
  rehearsal: Event;
  ceremony: Event;
  reception: Event;
}
