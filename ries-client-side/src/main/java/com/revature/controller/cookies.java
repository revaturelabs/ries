package com.revature.controller;

/**
 * Created by Jhoan Osorno on 7/24/2017.
 */

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
public class cookies {

    @RequestMapping(value = "/session")
    public String setCookie(HttpServletRequest request, HttpServletResponse response) {
        String name = request.getParameterNames().nextElement();
        String value = request.getParameter(name);
        Cookie cookie = new Cookie(name, value);
        response.addCookie(cookie);
        return "redirect:/";
    }
}
