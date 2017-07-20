package com.revature.util;

/**
 * Created by Brandon on 7/13/2017.
 */
public class Email {

    private String msg;
    private String topic;
    private String targetEmail;

    public Email() {
    }

    public Email(String msg, String topic, String targetEmail) {
        this.msg = msg;
        this.topic = topic;
        this.targetEmail = targetEmail;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getTargetEmail() {
        return targetEmail;
    }

    public void setTargetEmail(String targetEmail) {
        this.targetEmail = targetEmail;
    }

    @Override
    public String toString() {
        return "Email{" +
                "msg='" + msg + '\'' +
                ", topic='" + topic + '\'' +
                ", targetEmail='" + targetEmail + '\'' +
                '}';
    }
}
