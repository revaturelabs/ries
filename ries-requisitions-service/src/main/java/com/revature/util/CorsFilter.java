package com.revature.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by tyler on 7/14/2017.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsFilter extends OncePerRequestFilter {
    private Logger logger = LoggerFactory.getLogger(CorsFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        logger.info("Received Request in CorsFilter");
        response.addHeader("Access-Control-Allow-Origin","http://ec2-13-58-14-134.us-east-2.compute.amazonaws.com:3001, http://localhost:3001");
        response.addHeader("Access-Control-Allow-Credentials", "true");
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
            response.addHeader("Access-Control-Allow-Method", "GET, PUT, POST, DELETE");
            response.addHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
            response.setStatus(HttpServletResponse.SC_OK);
        }else{
            filterChain.doFilter(request, response);
        }
    }
}
