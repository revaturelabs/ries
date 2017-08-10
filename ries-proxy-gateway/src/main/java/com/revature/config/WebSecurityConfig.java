package com.revature.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * Spring Security configuration. This is used to specify which e
 * ndpoints require authentication and which do not. In addition,
 * the {@code SalesForceLogoutHandler} is set here.
 */
@Configuration
@EnableOAuth2Sso
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Value("#{'${security.anonymous-access-patterns}'.split(',')}")
    private String[] anonymous;
    private final SalesforceLogoutHandler logoutHandler;

    @Autowired
    public WebSecurityConfig(SalesforceLogoutHandler logoutHandler) {
        this.logoutHandler = logoutHandler;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.antMatcher("/**")
            .authorizeRequests()
            .antMatchers(anonymous)
            .permitAll()
            .anyRequest()
            .authenticated()
            .antMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**")
            .permitAll()
            .and()
            .logout()
            .addLogoutHandler(logoutHandler)
            .permitAll()
            .and()
            .csrf()
            .disable();
    }

}
