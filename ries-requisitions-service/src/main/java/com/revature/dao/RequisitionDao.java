package com.revature.dao;

import com.revature.domain.Requisition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

/**
 * Created by tyler on 7/10/2017.
 */
@Repository
public interface RequisitionDao extends JpaRepository<Requisition, Integer> {
    List<Requisition> findByReqRecruiter(String reqRecruiter);

    List<Requisition> findByReqHost(String reqHost);

    List<Requisition> findByInterviewDateBefore(Timestamp d);
}
