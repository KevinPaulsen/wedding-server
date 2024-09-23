package com.paulsen.wedding.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

import java.util.Set;

@Entity
@Table(name = "roles")
public class Role {

    @Id
    private String name; // e.g., "ROLE_USER", "ROLE_ADMIN"

    @ManyToMany(mappedBy = "roles")
    private Set<User> users;

    // Constructors

    public Role() {
    }

    public Role(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Role role)) return false;

        return getName().equals(role.getName()) && getUsers().equals(role.getUsers());
    }

    @Override
    public int hashCode() {
        int result = getName().hashCode();
        result = 31 * result + getUsers().hashCode();
        return result;
    }
}
