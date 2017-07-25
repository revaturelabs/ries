package com.revature.websocket;


import com.google.gson.Gson;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.*;

/**
 * Created by craig on 7/16/2017.
 */
@Component
public class WebSocketHandler extends TextWebSocketHandler {

    WebSocketSession session;
//    private static Set<WebSocketSession> clients =
//            Collections.synchronizedSet(new HashSet<WebSocketSession>());

    private static ArrayList<String> names = new ArrayList<String>();

    private static List<User> clientArray =
            Collections.synchronizedList(new ArrayList<User>());


    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("Connection established");
        this.session = session;
        System.out.println(session);
//        clients.add(session);
        //session.sendMessage(new TextMessage("connected to server"));
    }


    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
//        System.out.println("Removing session");
//        System.out.println("Session closing: "+session);
        for(User u: clientArray){
            System.out.println(u.toString());
        }
        Iterator<User> iter = clientArray.iterator();
        while(iter.hasNext()){
            User tmp = iter.next();
            if(tmp.getSession().equals(session)){
                iter.remove();
                session.close();
            }
        }
//        System.out.println("Current Sessions");
//        for(User u: clientArray){
//            System.out.println(u.toString());
//        }
//
//        System.out.println("User has left the session: " + session);
    }


    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        Gson gson = new Gson();
        Message msg = gson.fromJson(message.getPayload(), Message.class);

        switch (msg.getType()) {
            case "login":

                User user = new User(msg.getRoom(), session, msg.getName(), msg.getRole());
                clientArray.add(user);


                msg.setSuccess(true);
                String jsonLogin = gson.toJson(msg);

                names.add(msg.getName());
                session.sendMessage(new TextMessage(jsonLogin));

//                msg.setType("newMember");
//                msg.setMembers(names);
//                sendMessage(session, msg, gson, true);

                updateChatMembers(session, msg, gson);
                break;
            case "offer":
                sendMessage(session, msg, gson, false);
                break;
            case "answer":
                sendMessage(session, msg, gson, false);
                break;
            case "candidate":
                sendMessage(session, msg, gson, false);
                break;
            case "leave":
                session.close();
                break;
            case "chatMessage":
                sendMessage(session, msg, gson, false);
                break;
            default:
                Message errorMessage = new Message("error", "Message type not found");
                String jsonInString = gson.toJson(errorMessage);
                session.sendMessage(new TextMessage(jsonInString));
        }
    }

    public void sendMessage(WebSocketSession session, Message msg, Gson gson, boolean toAll) throws IOException {
        synchronized (clientArray) {
            // Iterate over the connected sessions
            // and broadcast the received message
            System.out.println(msg.toString());
            List<WebSocketSession> clients = new ArrayList<>();
            for (User u : clientArray) {
                if (u.getRoom().equals(msg.getRoom())) {
                    if(msg.getSendTo() != null){
                        if(msg.getSendTo().equals(u.getRole())){
                            clients.add(u.getSession());
                        }
                    }else{
                        clients.add(u.getSession());
                    }
                }
            }
            System.out.println("Sent to "+clients.size() +" client(s)");
            System.out.println(clients.toString());
            System.out.println("____________________________________________________________________");



            String jsonLogin = gson.toJson(msg);
            if (!toAll) {
                for (WebSocketSession client : clients) {
                    if (!client.equals(session)) {
                        client.sendMessage(new TextMessage(jsonLogin));
                    }
                }
            } else {
                for (WebSocketSession client : clients) {
                    client.sendMessage(new TextMessage(jsonLogin));
                }
            }
        }
    }

    public void updateChatMembers(WebSocketSession session, Message msg, Gson gson) throws IOException{
        Message newMemberMessage = new Message();
        newMemberMessage.setType("newMember");
        ArrayList<String> membersInRoom = new ArrayList<String>();

        //collect the names of the people in the room
        for (User u : clientArray) {
            if (u.getRoom().equals(msg.getRoom())) {
                membersInRoom.add(u.getName());
            }
        }

        newMemberMessage.setMembers(membersInRoom);
        String jsonInString = gson.toJson(newMemberMessage);
        TextMessage jsonMessage = new TextMessage(jsonInString);

        for (User u : clientArray) {
            if (u.getRoom().equals(msg.getRoom())) {
                u.getSession().sendMessage(jsonMessage);
            }
        }
    }
}
