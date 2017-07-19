package com.revature.model;

import java.sql.Timestamp;

public class RequisitionDTO {
    private Integer guestId;
    private Timestamp interviewDate;
    private String reqHost;
    private String reqRecruiter;

    public RequisitionDTO() {
    }

    public Integer getGuestId() {
        return guestId;
    }

    public void setGuestId(Integer guestId) {
        this.guestId = guestId;
    }

    public Timestamp getInterviewDate() {
        return interviewDate;
    }

    public void setInterviewDate(Timestamp interviewDate) {
        this.interviewDate = interviewDate;
    }

    public String getReqHost() {
        return reqHost;
    }

    public void setReqHost(String reqHost) {
        this.reqHost = reqHost;
    }

    public String getReqRecruiter() {
        return reqRecruiter;
    }

    public void setReqRecruiter(String reqRecruiter) {
        this.reqRecruiter = reqRecruiter;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RequisitionDTO)) return false;

        RequisitionDTO that = (RequisitionDTO) o;

        if (guestId != null ? !guestId.equals(that.guestId) : that.guestId != null) return false;
        if (interviewDate != null ? !interviewDate.equals(that.interviewDate) : that.interviewDate != null)
            return false;
        if (reqHost != null ? !reqHost.equals(that.reqHost) : that.reqHost != null) return false;
        return reqRecruiter != null ? reqRecruiter.equals(that.reqRecruiter) : that.reqRecruiter == null;
    }

    @Override
    public int hashCode() {
        int result = guestId != null ? guestId.hashCode() : 0;
        result = 31 * result + (interviewDate != null ? interviewDate.hashCode() : 0);
        result = 31 * result + (reqHost != null ? reqHost.hashCode() : 0);
        result = 31 * result + (reqRecruiter != null ? reqRecruiter.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "RequisitionDTO{" +
                "guestId=" + guestId +
                ", interviewDate=" + interviewDate +
                ", reqHost='" + reqHost + '\'' +
                ", reqRecruiter='" + reqRecruiter + '\'' +
                '}';
    }
}
