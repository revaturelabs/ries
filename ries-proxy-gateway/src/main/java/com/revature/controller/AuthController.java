package com.revature.controller;

import com.revature.Force;
import com.revature.model.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        return force.getRole(auth);
    }
}
