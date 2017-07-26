package com.revature.util;

import com.amazonaws.services.kinesis.producer.KinesisProducer;
import com.amazonaws.services.kinesis.producer.KinesisProducerConfiguration;
import com.google.gson.Gson;
import com.revature.domain.Requisition;

import java.io.UnsupportedEncodingException;
import java.nio.ByteBuffer;

/**
 * Created by Brandon on 7/12/2017.
 */
public class KinesisEmailProducer {

    private static final KinesisProducerConfiguration config = new KinesisProducerConfiguration()
            .setRegion("us-east-1")
            .setAggregationEnabled(false);

    private static final KinesisProducer kp = new KinesisProducer(config);

    //Public method that can be called to write the emails to send out the URLs
    public static void writeURLEmails(Requisition r){
        try {
            writeGuestEmail(r);
            writeHostEmail(r);
        } catch (UnsupportedEncodingException e) {
            System.out.println("Something went wrong with writing the emails");
            e.printStackTrace();
        }
    }
    //Layout for Guest URL email
    private static void writeGuestEmail(Requisition r) throws UnsupportedEncodingException{
        String msg = "Hello,\n\nYou have an upcoming interview with Revature on "+r.getInterviewDate()
                +"\n\nAt that time please follow the link in this email for a video call session with one of our trainers."+
                "  This interview will take roughly 15 minutes, and cover the material detailed to you by your recruiter."+
                "  Please be aware that these interviews are recorded for quality control purposes.  Only click the following"+
                " link if you consent to be recorded.\n\n"+r.getGuestUrl();
        String topic = "Interview with Revature";
        String email = "lederhou@grinnell.edu";

        buildAndSendEmail(msg, topic, email, r);
    }
    //Layout for Host URL email
    private static void writeHostEmail(Requisition r) throws UnsupportedEncodingException{
        String msg = "Hello,\n\nYou have scheduled an interview with a new prospective associate on "+r.getInterviewDate()
                +"\n\nAt that time, have the interviewer use the following link to start the interview session.\n"+ r.getHostUrl() +
                " \n\nIf you or any other Revature employees would like to observe this interview, please use the following link.\n"+r.getObserverUrl();
        String topic = "New Scheduled Interview";
        String email = "epsilon220@gmail.com";

        buildAndSendEmail(msg, topic, email, r);
    }

    //Method that actually writes the email to the Kinesis stream, provided information about an email
    private static void buildAndSendEmail(String msg, String topic, String email, Requisition r) throws UnsupportedEncodingException{
        Email e = new Email(msg,topic,email);
        String emailJson = new Gson().toJson(e);

        ByteBuffer data = ByteBuffer.wrap(emailJson.getBytes("UTF-8"));
        kp.addUserRecord("requisition-watcher", r.getHostUrl(), data);
    }
}
