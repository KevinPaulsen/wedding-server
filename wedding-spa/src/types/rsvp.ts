// src/types/rsvp.ts

export interface GuestListDetail {
    display_name: string;
    dietary_restrictions: string[];
    other: string;
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

export interface Rsvp {
    rsvp_id: string;
    primary_contact: PrimaryContact;
    guest_list: { [key: string]: GuestListDetail };
    roce: {
        allowed_guests: number;
        guests_attending: string[];
    };
    rehearsal: {
        allowed_guests: number;
        guests_attending: string[];
    };
    ceremony: {
        allowed_guests: number;
        guests_attending: string[];
    };
    reception: {
        allowed_guests: number;
        guests_attending: string[];
    };
    submitted: boolean;
}
