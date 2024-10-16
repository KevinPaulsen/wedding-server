package com.paulsen.wedding.model.rsvp;

public record GuestInfo(String name, String email, String phoneNumber, String address) {
    @Override public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GuestInfo guestInfo)) {
            return false;
        }

        return name.equals(guestInfo.name) && email.equals(guestInfo.email) && address.equals(guestInfo.address) &&
               phoneNumber.equals(guestInfo.phoneNumber);
    }

    @Override public int hashCode() {
        int result = name.hashCode();
        result = 31 * result + email.hashCode();
        result = 31 * result + phoneNumber.hashCode();
        result = 31 * result + address.hashCode();
        return result;
    }
}
