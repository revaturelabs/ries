package com.revature.controller;

import com.revature.Force;
import com.revature.model.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

@RestController
public class AuthController {
    @Autowired
    private Force force;

    /**
     * This endpoint provides userinfo about the current user.
     * The response has been reformatted with only relevant information,
     * instead of all of the data provided by Salesforce.
     * @param auth Object that is injected containing userinfo. Can be processed by Force.
     * @return Response with JSON Employee object as the body.
     */
    @RequestMapping(value = "/userinfo", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Employee> getInfo(OAuth2Authentication auth) {
        return ResponseEntity.ok(force.getCurrentEmployee(auth));
    }

    /**
     * This endpoint retrieves a list of trainers from Salesforce.
     * @param auth Object that is injected containing userinfo. Can be processed by Force.
     * @return Response with a JSON Array of Employee objects as the body.
     */
    @RequestMapping(value = "/trainers", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Employee>> getTrainers(OAuth2Authentication auth) {
        return ResponseEntity.ok(force.getTrainers(auth));
    }

    /**
     * This endpoint retrieves a list of recruiters from Salesforce.
     * @param auth Object that is injected containing userinfo. Can be processed by Force.
     * @return Response with a JSON Array of Employee objects as the body.
     */
    @RequestMapping(value = "/recruiters", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Employee>> getRecruiters(OAuth2Authentication auth) {
        return ResponseEntity.ok(force.getRecruiters(auth));
    }

    /**
     * This endpoint provides userinfo about a specific user based on their
     * Salesforce Employee ID.
     * @param auth Object that is injected containing userinfo. Can be processed by Force.
     * @param employeeId Specifies the Employee ID to retrieve.
     * @return Response with JSON Employee object as the body.
     *         Will return a 404 Not Found for invalid IDs.
     */
    @RequestMapping(value = "/userinfo/{employeeId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Employee> getEmployeeById(OAuth2Authentication auth, @PathVariable String employeeId) {
        Employee employee = force.getEmployeeById(auth, employeeId);
        if(employee != null)
            return ResponseEntity.ok(employee);
        else
            return ResponseEntity.notFound().build();
    }
}