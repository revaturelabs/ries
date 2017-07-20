package com.revature.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.InetAddress;

/**
 * Created by craig on 7/18/2017.
 */
@RestController
public class IpController {

    @RequestMapping(value="/getIp", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String[]> getIp(){
        System.out.println("trying to get IP address");

        try{
            InetAddress addr = InetAddress.getLocalHost();
            String [] split = addr.getHostAddress().split("\\.");
            return new ResponseEntity<String[]>(split, HttpStatus.OK);
        }catch(IOException e){
            e.printStackTrace();
        }

        return new ResponseEntity<String[]>(new String[0], HttpStatus.OK);

    }


}
