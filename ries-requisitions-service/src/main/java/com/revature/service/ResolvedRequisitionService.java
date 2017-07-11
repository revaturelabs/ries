package com.revature.service;

import com.revature.dao.ResolvedRequisitionDao;
import com.revature.domain.ResolvedRequisition;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

/**
 * Created by ath73 on 7/11/2017.
 */
@Service
@Transactional
public class ResolvedRequisitionService {
    @Autowired
    ResolvedRequisitionDao dao;

    public List<ResolvedRequisition> getAll() {return dao.findAll();}

    public List<ResolvedRequisition> getByRecruiterId(Integer recruiter) {return dao.findAllByRecruiter(recruiter);}

    public void save (ResolvedRequisition resolvedRequisition) { dao.save(resolvedRequisition);}
}
