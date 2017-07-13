package com.revature.domain;

import javax.persistence.*;
import com.revature.util.UrlGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.sql.Timestamp;

/**
 * Created by tyler on 7/10/2017.
 */
@Entity
@Table(name="Requisition")
public class Requisition {
    private Integer reqId;
    private Timestamp createDate;
    private Timestamp interviewDate;
    private String reqHost;
    private Integer reqGuest;
    private String reqRecruiter;
    private String hostUrl;
    private String guestUrl;
    private String observerUrl;

    public Requisition() {
        this.createDate = new Timestamp(System.currentTimeMillis());
    }

    public Requisition(String reqHost, Integer reqGuest, String reqRecruiter) {
        this();
        this.reqHost = reqHost;
        this.reqGuest = reqGuest;
        this.reqRecruiter = reqRecruiter;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reqSequence")
    @SequenceGenerator(name = "reqSequence", sequenceName = "req_sequence", allocationSize = 1)
    @Column(name = "req_id")
    public Integer getReqId() {
        return reqId;
    }

    public void setReqId(Integer reqId) {
        this.reqId = reqId;
    }

    @Column(name="req_Create_Date")
    public Timestamp getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Timestamp createDate) {
        this.createDate = createDate;
    }

    @Column(name="req_InterviewDate")
    public Timestamp getInterviewDate() {
        return interviewDate;
    }

    public void setInterviewDate(Timestamp interviewDate) {
        this.interviewDate = interviewDate;
    }

    @Column(name="req_host")
    public String getReqHost() {
        return reqHost;
    }

    public void setReqHost(String reqHost) {
        this.reqHost = reqHost;
    }

    @Column(name="req_guest")
    public Integer getReqGuest() {
        return reqGuest;
    }

    public void setReqGuest(Integer reqGuest) {
        this.reqGuest = reqGuest;
    }

    @Column(name="req_recruiter")
    public String getReqRecruiter() {
        return reqRecruiter;
    }

    public void setReqRecruiter(String reqRecruiter) {
        this.reqRecruiter = reqRecruiter;
    }

    @Column(name="req_host_url")
    public String getHostUrl() {
        return hostUrl;
    }

    public void setHostUrl(String hostUrl) {
        this.hostUrl = hostUrl;
    }

    @Column(name="req_guest_url")
    public String getGuestUrl() {
        return guestUrl;
    }

    public void setGuestUrl(String guestUrl) {
        this.guestUrl = guestUrl;
    }

    @Column(name="req_observer_url")
    public String getObserverUrl() {
        return observerUrl;
    }

    public void setObserverUrl(String observerUrl) {
        this.observerUrl = observerUrl;
    }

    @Override
    public String toString() {
        return "{" +
                " reqId=" + reqId +
                ", createDate=" + createDate +
                ", interviewDate=" + interviewDate +
                ", reqHost=" + reqHost +
                ", reqGuest=" + reqGuest +
                ", reqRecruiter=" + reqRecruiter +
                ", hostUrl='" + hostUrl + '\'' +
                ", guestUrl='" + guestUrl + '\'' +
                ", observerUrl='" + observerUrl + '\'' +
                '}';
    }

    /*
    public static void main(String[] args) {
        Requisition r = new Requisition();
        r.setReqId(1);
        r.setReqGuest(1);
        r.setReqRecruiter(3);
        r = UrlGenerator.generateUrls(r);
        System.out.println(r.toString());
    }*/
}
