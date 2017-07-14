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

    //If login fails to return a guest when it should, createGuest may create duplicate PIN's
    @RequestMapping(value="/createGuest", method = RequestMethod.GET)
    public void createGuest(@RequestParam(value = "name") String name){

        //Generate a random number using currentTimeMillis as a seed for a bit more security.
        Random r = new Random(System.currentTimeMillis());

        //Create the new guest object
        Guest g = new Guest();
        g.setName(name);

        //Create a new PIN and make sure it is unique before setting
        Guest guest;
        int pin;
        do {
            pin = 100000 + r.nextInt(900000);
            guest = login(pin);
        } while (guest != null);
        g.setPin(pin);

        //Send it to the database
        guestService.save(g);
    }
}
