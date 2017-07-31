package com.revature.controller;

import com.revature.Force;
import com.revature.domain.Employee;
import com.revature.domain.Requisition;
import com.revature.domain.ResolvedRequisition;
import com.revature.domain.Role;
import com.revature.service.RequisitionService;
import com.revature.service.ResolvedRequisitionService;
import com.revature.util.UrlGenerator;
import com.revature.util.UserAuth;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

/**
 * Created by Tyler Deans on 7/10/2017.
 * Updated it to add OAuth authorization to restrict access to employees
 */

@RestController
public class RequisitionController {
    @Autowired
    RequisitionService service;

    @Autowired
    ResolvedRequisitionService resolvedRequisitionService;

    @Autowired
    Force force;

    @RequestMapping(value="/requisition/all", method=RequestMethod.GET, produces= MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Requisition>> getRequisitions(OAuth2Authentication auth) {
        if (isEmployeeAuth(auth)) {
            List<Requisition> list = service.getAll();
            return new ResponseEntity<>(list, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @RequestMapping(value="/requisition/by/{id}", method=RequestMethod.GET, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Requisition> getRequisitionById(@PathVariable Integer id, OAuth2Authentication auth) {
        if(isEmployeeAuth(auth)) {
            Requisition requisition = service.getById(id);

            if (requisition == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(requisition, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @RequestMapping(value="/requisition/by/recruiter/{id}", method=RequestMethod.GET, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Requisition>> getAllRequisitionsByRecruiter(@PathVariable String recruiterId, OAuth2Authentication auth) {
        Employee employee = force.getCurrentEmployee(auth);
        if(isEmployeeAuth(auth) && UserAuth.isRecruiter(employee)) {
            List<Requisition> reqList = service.getAllByRecruiter(recruiterId);
            return new ResponseEntity<>(reqList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @RequestMapping(value="/requisition/by/interviewer/{id}", method=RequestMethod.GET, produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Requisition>> getAllRequisitionsByInterviewer(@PathVariable String interviewer, OAuth2Authentication auth) {
        if (isEmployeeAuth(auth)) {
            List<Requisition> reqList = service.getAllByInterviewer(interviewer);
            return new ResponseEntity<>(reqList, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @RequestMapping(value="/requisition/create", method=RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> createRequisition(@RequestBody Requisition requisition, OAuth2Authentication auth) {

        /*
            Only a recruiter can create a requisition in theory
            Was unable to verify if the employee is a recruiter correctly
            So I only checked if the user was an employee
         */
        if (isEmployeeAuth(auth)) {
            Requisition requisition1 = UrlGenerator.generateUrls(requisition);
            service.save(requisition1);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

    }

    // The link is the link to the S3 bucket where the video recording is stored
    @RequestMapping(value="/requisition/delete/by/{id}/{link}", method=RequestMethod.POST)
    public ResponseEntity<Void> removeRequisitionById(@PathVariable Integer id, @PathVariable String link) {
        Requisition requisition = service.getById(id);
        if (requisition == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        System.out.println(link);
        ResolvedRequisition resolvedRequisition = new ResolvedRequisition(requisition);
        if (link != null && !link.equals(""))
            resolvedRequisition.setVideo(link);

        resolvedRequisitionService.save(resolvedRequisition);
        service.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

//    @RequestMapping(value="/requisition/delete", method=RequestMethod.DELETE)
//    public ResponseEntity<Void> removeRequisition(@RequestBody Requisition requisition) {
//        ResolvedRequisition resolvedRequisition = new ResolvedRequisition(requisition);
//        // set the video link here before saving to database
//        resolvedRequisitionService.save(resolvedRequisition);
//        service.delete(requisition);
//        return new ResponseEntity<>(HttpStatus.OK);
//
//    }

    //Update interview date of an requisition - has not been tested if it works (in theory it should)
    @RequestMapping(value="/requisition/update/{id}", method=RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> updateRequisition(@PathVariable Integer id, @RequestParam String newDate, OAuth2Authentication auth) {
        Employee employee = force.getCurrentEmployee(auth);
        if(isEmployeeAuth(auth) && UserAuth.isRecruiter(employee)) {
            Timestamp ts = Timestamp.valueOf(newDate);
            Requisition requisition = service.getById(id);

            requisition.setInterviewDate(ts);
            service.save(requisition);
            return new ResponseEntity<>(HttpStatus.OK);
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
