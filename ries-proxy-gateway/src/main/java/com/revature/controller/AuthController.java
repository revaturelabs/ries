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

@CrossOrigin
@RestController
public class AuthController {
    @Autowired
    private Force force;

    @RequestMapping(value = "/userinfo", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Employee> getInfo(OAuth2Authentication auth) {
        return ResponseEntity.ok(force.getCurrentEmployee(auth));
    }

    @RequestMapping(value = "/trainers", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Employee>> getTrainers(OAuth2Authentication auth) {
        return ResponseEntity.ok(force.getTrainers(auth));
    }

    @RequestMapping(value = "/recruiters", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Employee>> getRecruiters(OAuth2Authentication auth) {
        return ResponseEntity.ok(force.getRecruiters(auth));
    }

    @RequestMapping(value = "/userinfo/{employeeId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Employee> getEmployeeById(OAuth2Authentication auth, @PathVariable String employeeId) {
        Employee employee = force.getEmployeeById(auth, employeeId);
        if(employee != null)
            return ResponseEntity.ok(employee);
        else
            return ResponseEntity.notFound().build();
    }
}