package com.revature.websocket;

import java.util.ArrayList;
import java.util.Set;

/**
 * Created by craig on 7/17/2017.
 */
public class Message {

    private String type;
    private String data;
    private String name;
    private String offer;
    private String answer;
    private String candidate;
    private String message;
    private boolean success;
    private String room;
    private String role;
    private String sendTo;


    private ArrayList<String> members = new ArrayList<String>();

    public Message() {
    }

    public Message(String type, String message){
        this.type = type;
        this.message = message;
    }

    public String getSendTo() {
        return sendTo;
    }

    public void setSendTo(String sendTo) {
        this.sendTo = sendTo;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void addToMembers(String str){
        members.add(str);
    }

    public ArrayList<String> getMembers() {
        return members;
    }

    public void setMembers(ArrayList<String> members) {
        this.members = members;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOffer() {
        return offer;
    }

    public void setOffer(String offer) {
        this.offer = offer;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getCandidate() {
        return candidate;
    }

    public void setCandidate(String candidate) {
        this.candidate = candidate;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    @Override
    public String toString() {
        return "Message{" +
                "type='" + type + '\'' +
                ", room='" + room + '\'' +
                ", role='" + role + '\'' +
                ", sendTo='" + sendTo + '\'' +
                ", name='" + name + '\'' +
                ", offer='" + offer + '\'' +
                ", answer='" + answer + '\'' +
                ", message='" + message + '\'' +
                ", success=" + success + '\'' +
                ", members=" + members + '\'' +
                ", candidate='" + candidate + '\'' +
                ", data='" + data + '\'' +
                '}';
    }
}
