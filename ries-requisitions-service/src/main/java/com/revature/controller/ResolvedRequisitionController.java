package com.revature.controller;

import com.revature.Force;
import com.revature.domain.Employee;
import com.revature.domain.ResolvedRequisition;
import com.revature.service.ResolvedRequisitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by ath73 on 7/11/2017.
 */
@RestController
public class ResolvedRequisitionController {
    @Autowired
    ResolvedRequisitionService service;

    @Autowired
    Force force;

    @RequestMapping(value = "/resolvedRequisition/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ResolvedRequisition>> getAllResolvedRequisitions(OAuth2Authentication auth){
        if (isEmployeeAuth(auth)) {
            List<ResolvedRequisition> res_req = service.getAll();
            return new ResponseEntity<List<ResolvedRequisition>>(res_req, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @RequestMapping(value ="/resolvedRequisition/create", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> createResolvedRequisition(@RequestBody ResolvedRequisition res_req, OAuth2Authentication auth){
        if(isEmployeeAuth(auth)) {
            service.save(res_req);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @RequestMapping(value = "/resolvedRequisition/recruiter/{recruiter}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ResolvedRequisition>> getResolvedRequisitionByRecruiter(@PathVariable String recruiter, OAuth2Authentication auth){
        if (isEmployeeAuth(auth)) {
            List<ResolvedRequisition> res_req = service.getByRecruiterId(recruiter);
            return new ResponseEntity<List<ResolvedRequisition>>(res_req, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    private boolean isEmployeeAuth(OAuth2Authentication auth) {
        Employee employee = force.getCurrentEmployee(auth);
        if (employee == null) {
            return false;
        } else {
            return true;
        }
    }
}
