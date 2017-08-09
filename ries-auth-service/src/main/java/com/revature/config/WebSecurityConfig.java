package com.revature.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;

@Configuration
@EnableResourceServer
public class WebSecurityConfig extends ResourceServerConfigurerAdapter {
    @Value("#{'${security.anonymous-access-patterns}'.split(',')}")
    private String[] anonymousPatterns;

    @Override
    public void configure(HttpSecurity http) throws Exception {
    http.antMatcher("/**")                  // All endpoints
        .authorizeRequests()                // Must be authenticated
        .antMatchers(anonymousPatterns)     // <-- Except these
        .permitAll()                        // Permit all of these endpoints
        .anyRequest()
        .authenticated()
        .and()
        .csrf()             // Disabled CSRF
        .disable();         // Not yet implemented.
    }
}
