package com.revature.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class SalesForceLogoutHandler implements LogoutHandler {
    @Value(value = "${salesforce.revoke}")
    String revokeUrl;
    @Autowired
    private OAuth2RestTemplate restTemplate;

    @Override
    public void logout(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) {
        System.out.println(revokeUrl);
        try {
            /* Either a POST Request or a GET Request */
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//            HttpEntity<String> entity = new HttpEntity<>("parameters", headers);
//            restTemplate.exchange(revokeUrl, HttpMethod.POST, entity, String.class);

            /* GET Request */
            restTemplate.exchange(revokeUrl, HttpMethod.GET, null, String.class);
        }
        catch (HttpClientErrorException e) {
            System.out.println("Salesforce logout failed D: (Can't get this to work)");
        }

        /*
            Salesforce Documentation:
            https://developer.salesforce.com/blogs/developer-relations/2011/11/revoking-oauth-2-0-access-tokens-and-refresh-tokens.html
         */
    }
}
