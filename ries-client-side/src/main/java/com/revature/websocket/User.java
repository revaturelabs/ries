package com.revature.websocket;

import org.springframework.web.socket.WebSocketSession;

/**
 * Created by craig on 7/21/2017.
 */
public class User {
    private String room;
    private WebSocketSession session;
    private String name;


    public User() {
    }

    public User(String room, WebSocketSession session, String name) {
        this.room = room;
        this.session = session;
        this.name = name;
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
}
