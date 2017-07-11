package com.revature.controller;

import com.revature.domain.Requisition;
import com.revature.service.RequisitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<Requisition> getRequisitionById(Integer id) {
        Requisition requisition = service.getById(id);

        if (requisition == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(requisition, HttpStatus.OK);
    }

    @RequestMapping(value="/requisition/create", method=RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> createRequisition(@RequestBody Requisition requisition) {
        service.save(requisition);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    /*
    @RequestMapping(value="/requisition/by/{id}", method=RequestMethod.POST)
    public ResponseEntity*/
}
