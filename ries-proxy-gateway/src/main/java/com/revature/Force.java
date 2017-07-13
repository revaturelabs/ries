package com.revature;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.revature.model.Employee;
import com.revature.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.*;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.stereotype.Component;

import java.util.Arrays;
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

    @SuppressWarnings("unchecked")
    public Employee getRole(OAuth2Authentication auth) {
        HashMap<String, String> details = (HashMap<String, String>) auth.getUserAuthentication().getDetails();
        String url = restUrl(auth, "query") + "?q={q}";

        Gson gson = new Gson();
        Employee employee = gson.fromJson(gson.toJsonTree(details), Employee.class);
        employee.setEmployeeId(details.get("user_id"));
        employee.setFirstName(details.get("given_name"));
        employee.setLastName(details.get("family_name"));
        String thumbnail = gson.toJsonTree(details.get("photos")).getAsJsonObject().get("thumbnail").getAsString();
        employee.setThumbnail(thumbnail);

        Map<String, String> params = new HashMap<>();
        params.put("q", "SELECT id, name FROM UserRole " +
                "WHERE Id IN (SELECT UserRoleId FROM User " +
                "WHERE id = '" +
                employee.getEmployeeId()  +"')");


        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<>("parameters", headers);

        ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.GET, entity, String.class, params);
        //String roleStr = restTemplate.getForObject(url, String.class, params);
        String roleStr = responseEntity.getBody();
        System.out.println(url);
        System.out.println(roleStr);
        JsonObject roleData = gson.fromJson(roleStr, JsonElement.class)
                .getAsJsonObject().get("records")
                .getAsJsonArray().get(0).getAsJsonObject();
        System.out.println(roleData);
        Role role = new Role();
        role.setRoleId(roleData.get("Id").getAsString());
        role.setName(roleData.get("Name").getAsString());
        employee.setRole(role);
        System.out.println(employee);

        return employee;
    }

    private static class QueryResult<T> {
        public List<T> records;
    }

    private static class QueryResultEmployee extends QueryResult<Employee> {}
}
