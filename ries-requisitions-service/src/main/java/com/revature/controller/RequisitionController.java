package com.revature.controller;

import com.revature.domain.Requisition;
import com.revature.service.RequisitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

/**
 * Created by tyler on 7/10/2017.
 */
@RestController
public class RequisitionController {
    @Autowired
    RequisitionService service;

    @RequestMapping(value="/requisition/all", method=RequestMethod.GET, produces= MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Requisition>> getRequisitions() {
        List<Requisition> list = service.getAll();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @RequestMapping(value="/requisition/by/{id}", method=RequestMethod.GET, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Requisition> getRequisitionById(@PathVariable Integer id) {
        Requisition requisition = service.getById(id);

        if (requisition == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(requisition, HttpStatus.OK);
    }

    @RequestMapping(value="/requisition/by/recruiter/{id}", method=RequestMethod.GET, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Requisition>> getAllRequisitionsByRecruiter(@PathVariable Integer recruiterId) {
        List<Requisition> reqList = service.getAllByRecruiter(recruiterId);
        return new ResponseEntity<>(reqList, HttpStatus.OK);
    }

    @RequestMapping(value="/requisition/by/interviewer/{id}", method=RequestMethod.GET, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Requisition>> getAllRequisitionsByInterviewer(@PathVariable Integer interviewer) {
        List<Requisition> reqList = service.getAllByInterviewer(interviewer);
        return new ResponseEntity<>(reqList, HttpStatus.OK);
    }

    @RequestMapping(value="/requisition/create", method=RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> createRequisition(@RequestBody Requisition requisition) {
        service.save(requisition);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value="/requisition/delete/by/{id}", method=RequestMethod.POST)
    public ResponseEntity<Void> removeRequisitionById(@PathVariable Integer id) {
        service.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value="/requisition/delete", method=RequestMethod.POST)
    public ResponseEntity<Void> removeRequisition(@RequestBody Requisition requisition) {
        service.delete(requisition);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //Update interview date of an requisition
    @RequestMapping(value="/requisition/update/{id}", method=RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> updateRequisition(@PathVariable Integer id, @RequestParam String newDate) {
        Timestamp ts = Timestamp.valueOf(newDate);
        Requisition requisition = service.getById(id);

        requisition.setInterviewDate(ts);
        service.save(requisition);
        return new ResponseEntity<>(HttpStatus.OK);

    }
}
