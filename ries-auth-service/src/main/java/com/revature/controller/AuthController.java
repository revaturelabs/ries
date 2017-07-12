package com.revature.controller;

import com.revature.Force;
import com.revature.model.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class AuthController {

    @RequestMapping(value = "/user", produces = MediaType.APPLICATION_JSON_VALUE)
    public OAuth2Authentication getUser(OAuth2Authentication auth) {
        return auth;
    }

    @Autowired
    private Force force;

    @RequestMapping(value = "/userinfo")
    public String getInfo(OAuth2Authentication auth) {
        return force.getProfile(auth);
    }
}
