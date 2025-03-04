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

export interface Rsvp {
    rsvp_id: string;
    primary_contact: PrimaryContact;
    guest_list: { [key: string]: GuestListDetail };
    roce: {
        invited: boolean;
        guests_attending: string[];
    };
    rehearsal: {
        invited: boolean;
        guests_attending: string[];
    };
    ceremony: {
        invited: boolean;
        guests_attending: string[];
    };
    reception: {
        invited: boolean;
        guests_attending: string[];
    };
    submitted: boolean;
}
