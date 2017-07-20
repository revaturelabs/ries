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
 * Created by tyler on 7/10/2017.
 */
@CrossOrigin
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
        //Requisition requisition1 = UrlGenerator.generateUrls(requisition); // Add urls to the requisition
        // System.out.println(requisition);
        // Only a recruiter can create a requisition
        Employee employee = force.getCurrentEmployee(auth);
        if (isEmployeeAuth(auth) && UserAuth.isRecruiter(employee)) {
            Requisition requisition1 = UrlGenerator.generateUrls(requisition);
            service.save(requisition1);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @RequestMapping(value="/requisition/delete/by/{id}", method=RequestMethod.DELETE,consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> removeRequisitionById(@PathVariable Integer id, @RequestBody String link) {
        Requisition requisition = service.getById(id);
        if (requisition == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
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

    //Update interview date of an requisition
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
    // May put in a external class
    private boolean isEmployeeAuth(OAuth2Authentication auth) {
        Employee employee = force.getCurrentEmployee(auth);
        if (employee == null) {
            return false;
        } else {
            return true;
        }
    }

}
