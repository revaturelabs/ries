package com.revature.filter;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

//@Component
//@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        logger.info("Received Request in CorsFilter");
        String origin = request.getHeader("Origin");
        if(origin != null && origin.contains("localhost")) {
            response.setHeader("Access-Control-Allow-Origin", origin);
        }
        else {
            response.setHeader("Access-Control-Allow-Origin", "http://ec2-13-58-14-134.us-east-2.compute.amazonaws.com:3001");
        }
        response.setHeader("Access-Control-Allow-Credentials", "true");

        //check preflight
        /*preflights send certain headers
            Access-Control-Request-Method
            Access-Control-Request-Header
            Origin
         */
        logger.info("Host " + request.getRemoteHost());
        logger.info("Access-Control-Request-Method " + request.getHeader("Access-Control-Request-Method"));
        logger.info("Incoming request Method " + request.getMethod());
        if(request.getHeader("Access-Control-Request-Method") != null && "OPTIONS".equals(request.getMethod())){
            logger.info("Received a Preflight request in CorsFilter");
            response.setHeader("Access-Control-Allow-Method", "GET, PUT, POST, DELETE");
            response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
            response.setStatus(HttpServletResponse.SC_OK);
        }else{
            filterChain.doFilter(request, response);
        }
    }
}
