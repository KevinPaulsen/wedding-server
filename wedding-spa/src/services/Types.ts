export interface GuestInfo {
    name?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
}

export interface RsvpGuestDetails {
    name: string;
    mealPreference?: string; // Optional field if applicable
    // Add more fields as needed
}

export interface AddRsvpDto {
    rsvpCode: string;
    primaryContact: GuestInfo;
    lastNames: string[];
    allowedGuestCount: number;
    guestCount: number;
    rsvpGuestDetails: RsvpGuestDetails[];
}

export interface PutRsvpDto {
    rsvpCode: string;
    lastName: string;
    primaryContact: GuestInfo;
    rsvpGuestDetails: RsvpGuestDetails[];
}

export interface Rsvp {
    id: string;
    rsvpCode: string;
    primaryContact: GuestInfo;
    guestDetails: RsvpGuestDetails[];
    // Add more fields as needed
}
