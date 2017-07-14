package com.revature.controller;

import com.revature.model.Guest;
import com.revature.service.GuestService;
import org.hibernate.exception.ConstraintViolationException;
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
    public OAuth2Authentication getUser(OAuth2Authentication auth) {
        return auth;
    }

    @RequestMapping(value="guest/login", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public Guest login(@RequestParam(value = "pin") int pin){
        return guestService.getById(pin);
    }

    @RequestMapping(value="/createGuest", method = RequestMethod.GET)
    public void createGuest(@RequestParam(value = "name") String name){

        //Generate a random number using currentTimeMillis as a seed for a bit more security.
        Random r = new Random(System.currentTimeMillis());

        //Create the new guest object
        Guest g = new Guest();
        g.setName(name);

        int pin = 100000 + r.nextInt(900000);
        while (pin != 0) {
            try {
                g.setPin(pin);
                //Send it to the database
                guestService.save(g);
                pin = 0;
            } catch (ConstraintViolationException e) {
                pin = 100000 + r.nextInt(900000);
                continue;
            }
        }
    }
}
