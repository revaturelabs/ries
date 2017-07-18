package com.revature.controller;

import com.revature.model.Guest;
import com.revature.service.GuestService;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

@RestController
public class AuthController {

    @Autowired
    GuestService service;

    @RequestMapping(value="/guest/login", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Guest> login(@RequestBody int pin) {
        Guest guest = service.getByPin(pin);
        if(guest != null)
            return ResponseEntity.ok(guest);
        else
            return ResponseEntity.badRequest().build();
    }

    @RequestMapping(value = "/guest", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity createGuest(@RequestBody Guest guest) {

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
                return ResponseEntity.ok().build();
            }
            catch (ConstraintViolationException e) {
                timeoutCount--;
            }
        }
        return ResponseEntity.badRequest().body("Could not generate random pin. Try again.");
    }

    @RequestMapping(value = "/guest", method = RequestMethod.DELETE)
    public ResponseEntity deleteGuest(@RequestBody int pin) {
        Guest guest = service.getByPin(pin);
        if(guest != null) {
            service.delete(guest);
            return ResponseEntity.ok(guest);
        }

        return ResponseEntity.badRequest().build();
    }
}
