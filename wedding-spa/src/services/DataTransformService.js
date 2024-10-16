export const transformGuestDetails = (guestDetails) => {
    return guestDetails.map((guest) => {
        const [fName, ...rest] = guest.name.trim().split(/\s+/);
        const lName = rest.join(" "); // Join the rest as last name in case there are multiple parts

        return {
            fName: fName || "", // Assign empty string if undefined
            lName: lName || "", // Assign empty string if undefined
            foodOption: guest.foodOption || "",
            dietaryRestrictions: guest.dietaryRestrictions || [],
            other: guest.other || "",
        };
    });
};