package com.revature.controller;

import org.springframework.http.MediaType;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    @RequestMapping(value = "/user", produces = MediaType.APPLICATION_JSON_VALUE)
    public OAuth2Authentication user(OAuth2Authentication user) {
        return user;
    }
}
