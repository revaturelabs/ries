package com.revature.websocket;

import org.springframework.web.socket.WebSocketSession;

/**
 * Created by craig on 7/21/2017.
 */
public class User {
    private String room;
    private WebSocketSession session;
    private String name;
    private String role;

    public User() {
    }

    public User(String room, WebSocketSession session, String name, String role) {
        this.room = room;
        this.session = session;
        this.name = name;
        this.role = role;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public WebSocketSession getSession() {
        return session;
    }

    public void setSession(WebSocketSession session) {
        this.session = session;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "User{" +
                "room='" + room + '\'' +
                ", session=" + session +
                ", name='" + name + '\'' +
                '}';
    }
}
