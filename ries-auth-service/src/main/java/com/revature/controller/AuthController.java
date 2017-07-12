package com.revature.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
public class AuthController {
    @RequestMapping("/heartbeat")
    public ResponseEntity<?> heartbeat() {
        return ResponseEntity.ok().body("Heartbeat");
    }

    @RequestMapping(value = "/user", produces = MediaType.APPLICATION_JSON_VALUE)
    public Principal user(Principal user) {
        return user;
    }
}
