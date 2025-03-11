// services/DataTransformService.ts

export interface GuestDetail {
  name: string;
  foodOption: string;
  dietaryRestrictions: string[];
  other: string;
}

export const transformGuestDetails = (
    guestDetails: Array<Partial<GuestDetail>>
): GuestDetail[] => {
  return guestDetails.map((guest) => ({
    name: guest.name || "",
    foodOption: guest.foodOption || "",
    dietaryRestrictions: guest.dietaryRestrictions || [],
    other: guest.other || "",
  }));
};
