package com.revature.controller;

import org.apache.catalina.servlet4preview.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletResponse;

/**
 * Created by Jhoan Osorno on 7/19/2017.
 */
@Controller
public class ForwardController {

    @RequestMapping(value = {
            "/login", "/home", "/guest/login", "/requisitions/upcoming",
            "/requisitions/resolved", "/requisitions/submit", "requisition",
            "/trainers", "/session/**" })
    public String forward() {
        return "forward:/";
    }

}
