package com.revature;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.revature.domain.Employee;
import com.revature.domain.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class Force {
    private static final String REST_VERSION = "40.0";

    private final OAuth2RestTemplate restTemplate;

    @Autowired
    public Force(OAuth2ProtectedResourceDetails resourceDetails, OAuth2ClientContext clientContext) {
        this.restTemplate = new OAuth2RestTemplate(resourceDetails, clientContext);
    }

    @SuppressWarnings("unchecked")
    public String restUrl(OAuth2Authentication auth, String url) {
        HashMap<String, Object> details = (HashMap<String, Object>) auth.getUserAuthentication().getDetails();
        HashMap<String, String> urls = (HashMap<String, String>) details.get("urls");

        return urls.get(url).replace("{version}", REST_VERSION);
    }

    @SuppressWarnings("unchecked")
    public Employee getCurrentEmployee(OAuth2Authentication auth) {
        HashMap<String, String> details = (HashMap<String, String>) auth.getUserAuthentication().getDetails();
        return getEmployeeById(auth, details.get("user_id"));
    }

    public List<Employee> getTrainers(OAuth2Authentication auth) {
        return getEmployeeByRole(auth, Role.ROLE_TRAINER);
    }

    public List<Employee> getRecruiters(OAuth2Authentication auth) {
        return getEmployeeByRole(auth, Role.ROLE_RECRUITER);
    }

    public Employee getEmployeeById(OAuth2Authentication auth, String employeeId) {
        String query = "SELECT Id, Name, CommunityNickname, FirstName, LastName, Email, FullPhotoUrl, SmallPhotoUrl, " +
                "UserRole.Id, UserRole.Name " +
                "FROM User WHERE Id = '" + employeeId + "'";

        String response = executeSalesForceQuery(auth, query);
        return parseSalesForceQueryResponse(response).get(0);
    }

    public List<Employee> getEmployeeByRole(OAuth2Authentication auth, String roleId) {
        String query = "SELECT Id, Name, CommunityNickname, FirstName, LastName, Email, FullPhotoUrl, SmallPhotoUrl, " +
                "UserRole.Id, UserRole.Name " +
                "FROM User WHERE UserRoleId = '" + roleId + "'";

        String response = executeSalesForceQuery(auth, query);

        return parseSalesForceQueryResponse(response);
    }

    private String executeSalesForceQuery(OAuth2Authentication auth, String query) {
        String url = restUrl(auth, "query") + "?q={q}";

        Map<String, String> params = new HashMap<>();
        params.put("q", query);

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<>("parameters", headers);

        ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.GET, entity, String.class, params);
        return responseEntity.getBody();
    }

    private List<Employee> parseSalesForceQueryResponse(String response) {
        List<Employee> employees = new ArrayList<>();
        JsonObject object = new Gson().fromJson(response, JsonElement.class).getAsJsonObject();
        JsonArray arr = object.getAsJsonArray("records");

        arr.forEach(jsonElement -> {
                    JsonObject jsonObject = jsonElement.getAsJsonObject();
                    Employee employee = new Employee();
                    employee.setEmployeeId(jsonObject.get("Id").getAsString());
                    employee.setName(jsonObject.get("Name").getAsString());
                    employee.setNickname(jsonObject.get("CommunityNickname").getAsString());
                    employee.setFirstName(jsonObject.get("FirstName").getAsString());
                    employee.setLastName(jsonObject.get("LastName").getAsString());
                    employee.setEmail(jsonObject.get("Email").getAsString());
                    employee.setPicture(jsonObject.get("FullPhotoUrl").getAsString());
                    employee.setThumbnail(jsonObject.get("SmallPhotoUrl").getAsString());
                    JsonObject jsonRole = jsonObject.get("UserRole").getAsJsonObject();
                    Role role = new Role();
                    role.setRoleId(jsonRole.get("Id").getAsString());
                    role.setName(jsonRole.get("Name").getAsString());
                    employee.setRole(role);
                    employees.add(employee);
                }
        );
        return employees;
    }
}