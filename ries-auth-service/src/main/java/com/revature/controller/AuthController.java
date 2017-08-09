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
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

@RestController
public class AuthController {
    private final Force force;
    private final GuestService service;

    @Autowired
    public AuthController(Force force, GuestService service) {
        this.force = force;
        this.service = service;
    }

    /**
     * This endpoint is used to access a list of all guests.
     * This can be access by both Trainers and Managers.
     * @return ResponseEntity with a JSON Array of Guest objects.
     */
    @RequestMapping(value = "/guests", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity getAllGuests() {
        return ResponseEntity.ok(service.getAll());
    }

    /**
     * This endpoint is used by guests to login into a session. A pin must be provided.
     * The pin is used to retrieve guest info from the database and sent bad to the client.
     * If the pin is invalid the client will receive a Bad Request status code.
     * @param guestDTO Deserialize JSON object into Guest POJO only with a pin.
     * @return If a correct pin is entered, return the Guest info as JSON. Otherwise, 400 BadRequest response.
     */
    @RequestMapping(value="/guest/login", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Guest> login(@RequestBody Guest guestDTO) {

        Guest guest = service.getByPin(guestDTO.getPin());
        if(guest != null)
            return ResponseEntity.ok(guest);
        else
            return ResponseEntity.badRequest().build();
    }

    /**
     * This endpoint is used to create a Guest entity in the database. A randomly generated
     * pin will be attached to a Guest object and inserted into the database. Because the
     * pin column is unique, The database might through an Exception. To prevent an
     * infinite loop, the request will timeout after 50 attempts. If the request fails for
     * some reason, the response will have a BadRequest status code.
     *
     * #TODO Handle Unique Constraint Exception for pin and other fields separately.
     * #TODO Change Parameter to POJO. Doesn't work because of CORS preflight not working.
     *
     * @param auth Object that is injected containing userinfo. Can be processed by Force.
     * @param guestJson Guest info provided by client with Content-Type as text/plain.
     * @return ResponseEntity with JSON Guest object as the body. Bad Request status code if it fails.
     */
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

    /**
     * Deletes a guest entity from the database based on the pin.
     * @param auth Object that is injected containing userinfo. Can be processed by Force.
     * @param pin Integer pin used to identify the Guest entity.
     * @return
     */
    @RequestMapping(value = "/guest", method = RequestMethod.DELETE)
    public ResponseEntity deleteGuest(OAuth2Authentication auth, @RequestBody Integer pin) {
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
