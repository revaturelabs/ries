package com.revature.controller;

import com.revature.Force;
import com.revature.model.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

@RestController
public class AuthController {

    @RequestMapping(value = "/user", produces = MediaType.APPLICATION_JSON_VALUE)
    public OAuth2Authentication getUser(OAuth2Authentication auth) {
        return auth;
    }

    @Autowired
    private Force force;

    @RequestMapping(value = "/userinfo", produces = MediaType.APPLICATION_JSON_VALUE)
    public Employee getInfo(OAuth2Authentication auth) {
        return force.getCurrentEmployee(auth);
    }

    @RequestMapping(value = "/trainers", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Employee>> getTrainers(OAuth2Authentication auth) {
        return ResponseEntity.ok(force.getTrainers(auth));
    }

    @RequestMapping(value = "/recruiters", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Employee>> getRecruiters(OAuth2Authentication auth) {
        return ResponseEntity.ok(force.getRecruiters(auth));
    }

    @RequestMapping(value = "/test", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<String>> testSession(HttpSession session) {
        List<String> names = new ArrayList<>();
        Enumeration e = session.getAttributeNames();
        for(; e.hasMoreElements();) {
            names.add(e.nextElement().toString());
        }

        return ResponseEntity.ok().body(names);
    }

    @RequestMapping(value = "/test2", method = RequestMethod.GET)
    public ResponseEntity<List<String>> test(HttpSession session) {
        List<String> names = new ArrayList<>();
        Enumeration e = session.getAttributeNames();
        for(; e.hasMoreElements();) {
            names.add(e.nextElement().toString());
        }
        return ResponseEntity.ok().body(names);
    }
}
