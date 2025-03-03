// src/types/CreateRsvpDTO.ts
// (Optional) If you want a dedicated interface for createRsvp.
export interface CreateRsvpDTO {
    primary_name: string;
    phone_number?: string;
    email?: string;
    address?: string;
    allowed_guests: string[];
    roce_invitation?: boolean;
    rehearsal_invitation?: boolean;
    ceremony_invitation?: boolean;
    reception_invitation?: boolean;
}

// src/types/LookupDTO.ts
// (Optional) For your lookup calls
export interface LookupDTO {
    first_name: string;
    last_name: string;
}

// src/types/AddGuestDTO.ts
// (Optional) For adding/removing guests
export interface AddGuestDTO {
    first_name: string;
    last_name: string;
    rsvp_id: string;
}

// src/types/weddingGuest.ts
// (Optional) If you want to define a type for wedding guests
export interface WeddingGuest {
    firstName: string;
    lastName: string;
    rsvpIds: string[];
}
