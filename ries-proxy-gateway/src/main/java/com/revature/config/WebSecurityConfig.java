package com.revature.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.filter.OAuth2ClientAuthenticationProcessingFilter;
import org.springframework.security.oauth2.provider.token.ResourceServerTokenServices;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.servlet.Filter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Configuration
@EnableOAuth2Sso
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Value("${security.login-default-redirect-url}")
    private String redirectUrl;
    private final SalesForceAuthSuccessHandler successHandler;
    private final SalesForceLogoutHandler logoutHandler;

    @Autowired
    public WebSecurityConfig(SalesForceAuthSuccessHandler successHandler, SalesForceLogoutHandler logoutHandler) {
        this.successHandler = successHandler;
        this.logoutHandler = logoutHandler;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.antMatcher("/**")
            .authorizeRequests()
            .antMatchers("/ries/auth/guest/login", "/ries/signaling/**")
            .permitAll()
            .anyRequest()
            .authenticated()
            .and()
            .logout()
            .addLogoutHandler(logoutHandler)
            .permitAll()
            .and()
            .csrf()
            .disable();
    }
}
