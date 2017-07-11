package com.revature.controller;

import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
//@EnableOAuth2Sso
public class AuthController {
    @RequestMapping("/heartbeat")
    public ResponseEntity<?> heartbeat() {
        return ResponseEntity.ok().body("Heartbeat");
    }
}
