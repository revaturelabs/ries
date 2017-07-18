package com.revature.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class ClientController {
    @Value("${security.login-default-redirect-url}")
    private String redirectUrl;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String client() {
        return "redirect:" + redirectUrl;
    }
}
