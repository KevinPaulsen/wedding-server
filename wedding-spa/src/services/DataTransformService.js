export const transformGuestDetails = (guestDetails) => {
    return guestDetails.map((guest) => {
        return {
            name: guest.name || "",
            foodOption: guest.foodOption || "",
            dietaryRestrictions: guest.dietaryRestrictions || [],
            other: guest.other || "",
        };
    });
};