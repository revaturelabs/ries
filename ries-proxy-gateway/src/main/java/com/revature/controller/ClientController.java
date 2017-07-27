package com.revature.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpSession;

@Controller
public class ClientController {
    @Value("${security.login-default-redirect-url}")
    private String redirectUrl;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String client(HttpSession session) {
        String id = session.getId();
        return "redirect:" + redirectUrl + "sessioin?JSESSIONID=" + id;
    }

    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public String testRedirect(HttpSession session) {
        String id = session.getId();
        return "redirect:http://localhost:3001/session?JSESSIONID=" + id;
    }

    @RequestMapping(value = "/test/{port}", method = RequestMethod.GET)
    public String testRedirect(HttpSession session, @PathVariable Integer port) {
        String id = session.getId();
        return "redirect:http://localhost:"+ port +"/session?JSESSIONID=" + id;
    }
}
