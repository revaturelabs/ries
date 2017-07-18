package com.revature.domain;

public class Role {
    public static final String ROLE_TRAINER = "00Ei0000000ccV0EAI";
    public static final String ROLE_RECRUITER = "00Ei0000000Gcu3EAC";
    private String roleId;
    private String name;

    public Role() {
    }

    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isTrainer() {
        return roleId.equals(ROLE_TRAINER);
    }

    public boolean isRecruiter() {
        return roleId.equals(ROLE_RECRUITER);
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) return true;
        if (!(object instanceof Role)) return false;

        Role role = (Role) object;

        if (roleId != null ? !roleId.equals(role.roleId) : role.roleId != null) return false;
        return name != null ? name.equals(role.name) : role.name == null;
    }

    @Override
    public int hashCode() {
        int result = roleId != null ? roleId.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Role{" +
                "roleId='" + roleId + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}