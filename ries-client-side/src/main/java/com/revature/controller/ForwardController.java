package com.revature.controller;

import org.springframework.boot.autoconfigure.web.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Jhoan Osorno on 7/19/2017.
 */
@Controller
public class ForwardController implements ErrorController {

    @RequestMapping(value = {
            "/login", "/home", "/guest/login", "/requisitions/**", "requisition",
            "/trainers", "/session/**", "/error" })
    public String forward() {
        return "forward:/";
    }

    @Override
    public String getErrorPath() {

        return "/error";
    }
}
