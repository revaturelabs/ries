package com.revature.controller;

import com.revature.model.Guest;
import com.revature.model.RequisitionDTO;
import com.revature.service.GuestService;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

@RestController
public class AuthController {
    @Autowired
    GuestService service;

    @Autowired
    OAuth2RestTemplate restTemplate;

    @RequestMapping(value = "/guests", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Guest>> getAllGuests() {
        return ResponseEntity.ok(service.getAll());
    }

    @RequestMapping(value="/guest/login", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Guest> login(@RequestBody int pin) {
        Guest guest = service.getByPin(pin);
        if(guest != null)
            return ResponseEntity.ok(guest);
        else
            return ResponseEntity.badRequest().build();
    }

    @RequestMapping(value = "/guest", method = RequestMethod.POST)
    public ResponseEntity createGuest(@RequestBody GuestRequisitionHolder holder) {
        Guest guest = holder.guest;
        RequisitionDTO requisitionDTO = holder.requisition;

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

                requisitionDTO.setGuestId(guest.getGuestId());

                return restTemplate.postForEntity("http://ries-requisitions-service/requisition/create", restTemplate, Void.class);
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

    private class GuestRequisitionHolder {
        private Guest guest;
        private RequisitionDTO requisition;
    }
}
