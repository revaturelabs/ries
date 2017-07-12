package com.revature.model;

import javax.persistence.*;

@Entity
@Table(name = "AUTH_GUEST")
public class Guest {
    private Integer guestId;
    private String name;
    private Integer pin;

    public Guest() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    public Integer getGuestId() {
        return guestId;
    }

    public void setGuestId(Integer guestId) {
        this.guestId = guestId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPin() {
        return pin;
    }

    public void setPin(Integer pin) {
        this.pin = pin;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) return true;
        if (!(object instanceof Guest)) return false;

        Guest guest = (Guest) object;

        if (name != null ? !name.equals(guest.name) : guest.name != null) return false;
        return pin != null ? pin.equals(guest.pin) : guest.pin == null;
    }

    @Override
    public int hashCode() {
        int result = name != null ? name.hashCode() : 0;
        result = 31 * result + (pin != null ? pin.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Guest{" +
                "name='" + name + '\'' +
                ", pin=" + pin +
                '}';
    }
}
