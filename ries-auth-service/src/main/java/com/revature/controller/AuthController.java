package com.revature.controller;

import com.revature.dao.GuestDao;
import com.revature.model.Guest;
import com.revature.service.GuestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Random;

@RestController
public class AuthController {

    @Autowired
    GuestService guestService;

    @RequestMapping(value = "/user", produces = MediaType.APPLICATION_JSON_VALUE)
    public OAuth2Authentication user(OAuth2Authentication user) {
        return user;
    }

    @RequestMapping(value="guest/login", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public Guest login(@RequestParam(value = "pin") int pin){
        return guestService.getById(pin);
    }

    @RequestMapping(value="/generate", produces = MediaType.APPLICATION_JSON_VALUE)
    public Integer generatePin(){
        //Generate a random number using currentTimeMillis as a seed for a bit more security.
        Random r = new Random(System.currentTimeMillis());
        return new Integer(100000 + r.nextInt(900000));
    }
}
