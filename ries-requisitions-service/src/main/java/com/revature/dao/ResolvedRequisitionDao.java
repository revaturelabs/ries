package com.revature.dao;

import com.revature.domain.Requisition;
import com.revature.domain.ResolvedRequisition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by ath73 on 7/11/2017.
 */
@Repository
public interface ResolvedRequisitionDao extends JpaRepository<ResolvedRequisition, Integer> {
    List<ResolvedRequisition> findAllByRecruiter (Integer recruiter);
}
