package com.revature;

import com.revature.model.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class Force {
    private static final String REST_VERSION = "40.0";

    @Bean
    private OAuth2RestTemplate oAuth2RestTemplate(OAuth2ProtectedResourceDetails resource, OAuth2ClientContext context) {
        return new OAuth2RestTemplate(resource, context);
    }

    @Autowired
    OAuth2RestTemplate restTemplate;

    @SuppressWarnings("unchecked")
    public String restUrl(OAuth2Authentication auth, String url) {
        HashMap<String, Object> details = (HashMap<String, Object>) auth.getUserAuthentication().getDetails();
        HashMap<String, String> urls = (HashMap<String, String>) details.get("urls");

        return urls.get(url).replace("{version}", REST_VERSION);
    }

    public String getProfile(OAuth2Authentication auth) {
        //String url = restUrl(auth) + "query/?q={q}";
        String url = restUrl(auth, "query") + "?q={q}";
        Map<String, String> params = new HashMap<>();
        params.put("q", "SELECT Id, Name FROM UserRole");
        //return restTemplate.getForObject(url, QueryResultAccount.class).records;
        //return restTemplate.getForEntity(url, ResponseEntity)
        return restTemplate.getForObject(url, String.class, params);
    }

    public static class Account {
        public String Id;
        public String Name;
    }

    private static class QueryResult<T> {
        public List<T> records;
    }

    private static class QueryResultAccount extends QueryResult<Account> {}
}
