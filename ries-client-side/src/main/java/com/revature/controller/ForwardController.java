package com.revature.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Jhoan Osorno on 7/19/2017.
 */
@Controller
public class ForwardController {

    @RequestMapping(value = {
            "/login", "/home", "/guest/login", "/requisitions/**", "requisition",
            "/trainers", "/session/**" })
    public String forward() {
        return "forward:/";
    }

}
