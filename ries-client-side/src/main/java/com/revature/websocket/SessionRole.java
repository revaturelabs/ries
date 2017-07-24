package com.revature.websocket;

import org.springframework.web.socket.WebSocketSession;

/**
 * Created by craig on 7/19/2017.
 */
public class SessionRole {

    WebSocketSession session;
    String role;

    public SessionRole() {
    }

    public SessionRole(WebSocketSession session, String role) {
        this.session = session;
        this.role = role;
    }

    @Override
    public String toString() {
        return "SessionRole{" +
                "session=" + session +
                ", role='" + role + '\'' +
                '}';
    }

    public WebSocketSession getSession() {
        return session;
    }

    public void setSession(WebSocketSession session) {
        this.session = session;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
