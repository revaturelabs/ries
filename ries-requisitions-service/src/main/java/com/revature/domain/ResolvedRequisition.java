package com.revature.domain;

import javax.persistence.*;
import java.sql.Timestamp;

/**
 * Created by ath73 on 7/11/2017.
 */
@Entity
@Table(name="RESOLVED_REQUISITION")
public class ResolvedRequisition {
    private Integer id;
    private String video;
    private Timestamp createDate;
    private Timestamp interviewDate;
    private Integer guest;
    private String host;
    private String recruiter;

    public ResolvedRequisition() {
    }
    public ResolvedRequisition(Requisition r){
        this.createDate = r.getCreateDate();
        this.interviewDate = r.getInterviewDate();
        this.guest = r.getReqGuest();
        this.host = r.getReqHost();
        this.recruiter = r.getReqRecruiter();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "resReqSequence")
    @SequenceGenerator(name = "resReqSequence", sequenceName = "res_req_sequence", allocationSize = 1)
    @Column(name = "res_req_id")
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
    @Column(name = "res_req_video")
    public String getVideo() {
        return video;
    }

    public void setVideo(String video) {
        this.video = video;
    }
    @Column(name = "res_req_create_date")
    public Timestamp getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Timestamp createDate) {
        this.createDate = createDate;
    }
    @Column(name = "res_req_interview_date")
    public Timestamp getInterviewDate() {
        return interviewDate;
    }

    public void setInterviewDate(Timestamp interviewDate) {
        this.interviewDate = interviewDate;
    }
    @Column(name = "res_req_guest_id")
    public Integer getGuest() {
        return guest;
    }

    public void setGuest(Integer guest) {
        this.guest = guest;
    }
    @Column(name = "res_req_host_id")
    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }
    @Column(name = "res_req_recruiter_id")
    public String getRecruiter() {
        return recruiter;
    }

    public void setRecruiter(String recruiter) {
        this.recruiter = recruiter;
    }

    @Override
    public String toString() {
        return "{" +
                " id=" + id +
                ", video='" + video + '\'' +
                ", createDate=" + createDate +
                ", interviewDate=" + interviewDate +
                ", guest=" + guest +
                ", host=" + host +
                ", recruiter=" + recruiter +
                '}';
    }
}
