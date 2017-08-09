package com.revature.controller;

import com.google.gson.Gson;
import com.revature.Force;
import com.revature.model.Guest;
import com.revature.service.GuestService;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

@RestController
public class AuthController {
    @Autowired
    Force force;
    @Autowired
    GuestService service;

    @Autowired
    OAuth2RestTemplate restTemplate;

    @RequestMapping(value = "/guests", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity getAllGuests() {
        return ResponseEntity.ok(service.getAll());
    }

    @RequestMapping(value="/guest/login", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Guest> login(@RequestBody Guest guestDTO) {

        Guest guest = service.getByPin(guestDTO.getPin());
        if(guest != null)
            return ResponseEntity.ok(guest);
        else
            return ResponseEntity.badRequest().build();
    }

    @RequestMapping(value = "/guest", method = RequestMethod.POST)
    public ResponseEntity createGuest(OAuth2Authentication auth, @RequestBody String guestJson) {
        if(!force.getCurrentEmployee(auth).isRecruiter())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not a recruiter.");

        Guest guest = new Gson().fromJson(guestJson, Guest.class);

        //Generate a random number using currentTimeMillis as a seed for a bit more security.
        Random r = new Random(System.currentTimeMillis());

        int timeoutCount = 50;
        while (timeoutCount > 0) {
            int pin = 100000 + r.nextInt(900000);
            try {
                guest.setPin(pin);
                //Send it to the database
                service.save(guest);
                System.out.println(guest);

                return ResponseEntity.ok(guest);
            }
            catch (ConstraintViolationException e) {
                timeoutCount--;
            }
        }
        return ResponseEntity.badRequest().body("Could not generate random pin. Try again.");
    }

    @RequestMapping(value = "/guest", method = RequestMethod.DELETE)
    public ResponseEntity deleteGuest(OAuth2Authentication auth, @RequestBody int pin) {
        if(!force.getCurrentEmployee(auth).isRecruiter())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not a recruiter.");
        Guest guest = service.getByPin(pin);
        if(guest != null) {
            service.delete(guest);
            return ResponseEntity.ok(guest);
        }

        return ResponseEntity.badRequest().build();
    }
}
