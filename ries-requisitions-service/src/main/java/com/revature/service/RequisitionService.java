package com.revature.service;

import com.revature.dao.RequisitionDao;
import com.revature.domain.Requisition;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.sql.Date;
import java.util.List;

/**
 * Created by tyler on 7/10/2017.
 */
@Service
@Transactional
public class RequisitionService {
    @Autowired
    RequisitionDao dao;

    public List<Requisition> getAll() { return dao.findAll(); }

    public void save(Requisition requisition) { dao.save(requisition); }

    public Requisition getById(Integer id) { return dao.findOne(id); }

    public List<Requisition> getAllByRecruiter(String recruiterId) { return dao.findByReqRecruiter(recruiterId); }

    public List<Requisition> getAllByInterviewer(String hostId) { return dao.findByReqHost(hostId); }

    public void deleteById(Integer id) { dao.delete(id); }

    public void delete(Requisition requisition) { dao.delete(requisition); }

    public List<Requisition> getAllOutdated(Date d){ return dao.findByReqInterviewDateLess_Than(d); }
}
