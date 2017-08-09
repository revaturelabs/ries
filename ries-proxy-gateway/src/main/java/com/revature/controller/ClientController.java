package com.revature.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpSession;

/**
 * This controller is used to redirect requests back to the client server.
 * The issue was that Zuul was creating a session for the user and storing
 * the session ID in a cookie, but the cookie was associated with Zuul's
 * Domain name. The solution was to redirect the client browser to the
 * webapp server with the session ID so that the client will create
 * a cookie and have it be associated with the webapp domain. The static
 * webapp will then be able to send the session ID with every request to
 * have authentication and access secured resource services.
 */
@Controller
public class ClientController {
    @Value("${security.login-default-redirect-url}")
    private String redirectUrl;

    /**
     * This endpoint will redirect to the live EC2 instance.
     * @param session Injects the Session object to retrieve the session ID.
     * @return Sends redirect message to be handled by the ViewResolver.
     */
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String client(HttpSession session) {
        String id = session.getId();
        return "redirect:" + redirectUrl + "/session?JSESSIONID=" + id;
    }

    /**
     * This endpoint is used for testing on localhost.
     * @param session Injects the Session object to retrieve the session ID.
     * @return Sends redirect message to be handled by the ViewResolver.
     */
    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public String testRedirect(HttpSession session) {
        String id = session.getId();
        return "redirect:http://localhost:3001/session?JSESSIONID=" + id;
    }

    /**
     * This endpoint is used for testing on localhost. This endpoint allows
     * the developer to specify port number.
     * @param session Injects the Session object to retrieve the session ID.
     * @return Sends redirect message to be handled by the ViewResolver.
     */
    @RequestMapping(value = "/test/{port}", method = RequestMethod.GET)
    public String testRedirect(HttpSession session, @PathVariable Integer port) {
        String id = session.getId();
        return "redirect:http://localhost:"+ port +"/session?JSESSIONID=" + id;
    }
}
