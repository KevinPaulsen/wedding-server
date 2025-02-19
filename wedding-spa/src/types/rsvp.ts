// src/types/rsvp.ts

/** Example shape of a guest in your RSVP flow */
export interface GuestDetail {
    name: string;
    foodOption?: string;
    dietaryRestrictions: string[];
    other?: string;
}

export interface Rsvp {
    rsvpCode: string;
    allowedGuestCount: number;
    rsvpStatus: 'ATTENDING' | 'NOT_ATTENDING' | 'PENDING';
    lastnames: string[];
    primaryContact: {
        name: string;
        phoneNumber?: string;
        email?: string;
        address?: string;
    };
    rsvpGuestDetails: GuestDetail[];
}
