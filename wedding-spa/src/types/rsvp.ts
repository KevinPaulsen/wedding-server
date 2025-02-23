// src/types/rsvp.ts

/**
 * Represents the details of a guest.
 */
export interface GuestDetail {
    name: string;
    foodOption?: string;
    dietaryRestrictions: string[];
    other?: string;
}

/**
 * Represents the primary contact details for an RSVP.
 */
export interface PrimaryContact {
    name: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
}

/**
 * Represents an RSVP entry.
 */
export interface Rsvp {
    rsvpCode: string;
    allowedGuestCount: number;
    rsvpStatus: 'ATTENDING' | 'NOT_ATTENDING' | 'PENDING';
    lastnames: string[];
    primaryContact: PrimaryContact;
    rsvpGuestDetails: GuestDetail[];
}

/**
 * Extends GuestDetail for contexts where an index is needed (e.g. for editing).
 */
export interface RsvpGuestDetailWithIndex extends GuestDetail {
    index?: number;
}
