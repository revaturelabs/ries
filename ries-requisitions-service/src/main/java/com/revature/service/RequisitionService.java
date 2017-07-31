package com.revature.service;

import com.revature.dao.RequisitionDao;
import com.revature.domain.Requisition;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

/**
 * Created by Tyler Deans on 7/10/2017.
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

    public List<Requisition> getAllOutdated(Date d){
        /*
        The RequisitonResolver class (removes old requisitions) uses Date object
        But in order for the query in the DAO is has to be a SQL Timestamp object
        So here the Date object is converted to a Timestamp object and then put into the dao method
        */
        Timestamp timestamp = new Timestamp(d.getTime());
        return dao.findByInterviewDateBefore(timestamp);
    }
}
