package com.revature.domain;

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
    private Integer reqHost;
    private Integer reqGuest;
    private Integer reqRecruiter;
    private String hostUrl;
    private String guestUrl;
    private String observerUrl;

    public Requisition() {
    }

    @Id
    @Column(name="req_ID")
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
    public Integer getReqHost() {
        return reqHost;
    }

    public void setReqHost(Integer reqHost) {
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
    public Integer getReqRecruiter() {
        return reqRecruiter;
    }

    public void setReqRecruiter(Integer reqRecruiter) {
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
}
