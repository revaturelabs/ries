# Secure Resouce Server
A secure resource server contains endpoints that require the user to be authenticated. In this project, the user must be authenticated with Salesforce using their OAuth2. This is done at the **Zuul Proxy Gateway** server before routing to a service. However, no user information is ever based to the service. Therefore, the service must send HTTP Requests to Salesforce to retrieve userinfo such as their role. Salesforce will return a role ID which can be used for authorization.

## Resource Server Authentication Setup

Include these required Maven dependencies:
```xml
<dependency>
  <groupId>com.google.code.gson</groupId>
  <artifactId>gson</artifactId>
  <version>2.8.1</version>
</dependency>

<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-oauth2</artifactId>
</dependency>
```

Application Configuration (YML) [**!UPDATE THE client-id AND client-secret!**]:
```yml
salesforce:
  oath2-url: https://test.salesforce.com/services/oauth2
  revoke: ${salesforce.oath2-url}/revoke

security:
  oauth2:
    client:
      client-id: <Provided by Salesforce Connected App>
      client-secret: <Provided by Salesforce Connected App>
      access-token-uri: ${salesforce.oath2-url}/token
      user-authorization-uri: ${salesforce.oath2-url}/authorize
      client-authentication-scheme: form
      authentication-scheme: header
      grant-type: authentication-code
    resource:
      user-info-uri: ${salesforce.oath2-url}/userinfo
```

Add `@EnableResourceServer` annotation over your Main Application class (Unless you configure the properties). Example:
```java
@SpringBootApplication
@EnableDiscoveryClient
@EnableResourceServer
public class RiesRequisitionsServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(RiesRequisitionsServiceApplication.class, args);
	}
}
```

Helper Models and a Salesforce Utility class as been developed under the `ries-proxy-gateway` project. Copy over these files from `ries-proxy-gateway`:
```
ries-proxy-gateway/src/main/java/
|   +-- com.revature
    |   +-- model
        |   +-- Employee
        |   +-- Role
    |   +--Force
```

## How To Use
Inside a `@RestController`, autowire a Force object, and inject `OAuth2Authentication` into endpoints:
```java
public class RequisitionController {
    @Autowired
    Force force;
    
    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public ResponseEntity<Employee> test(OAuth2Authentication auth) {
        return ResponseEntity.ok(force.getCurrentEmployee(auth));
    }
    ...
}
```

Checking for role (Trainer or Recruiter):
```java
    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public ResponseEntity<Employee> test(OAuth2Authentication auth) {
        Employee employee = force.getCurrentEmployee(auth);
        boolean isTrainer = employee.isTrainer();
        boolean isRecruiter = employee.isRecruiter();
        ...
    }
```

## Allow Anonymous Access
To allow anonymous access to specific endpoints, you would need to configure Spring Web Security. 
The endpoint pattern has to match exactly how it is defined in the `@RequestMapping` annotation locally. 
For example, the `/guest/login` endpoint is used by guests who have not been authenticated with Salesforce. 
The `@EnableResourceServer` annotation should be moved here better self documentation.
```java
/* ries-auth-service/../com/revature/config/WebSecurityConfig.java */
@Configuration
@EnableResourceServer
public class WebSecurityConfig extends ResourceServerConfigurerAdapter {

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.antMatcher("/**")        // All endpoints
        .authorizeRequests()          // Must be authenticated
        .antMatchers("/guest/login")  // <-- Except these
        .permitAll()                  // Permit all of these endpoints
        .anyRequest()
        .authenticated()
        .and()
        .csrf()                       // Disabled CSRF
        .disable();                   // Not yet implemented.
    }
}
```

In addition, you would also have to configure **Zuul** to unlock these endpoints. The configuration file can be found at `ries-proxy-gateway/../com/revature/config/WebSecurityConfig.java`. However, the list of patterns has been defined in the `application.yml` file. The difference is that the endpoints also need to include the prefix that **Zuul** will be routing from: `ries/auth/guest/login`.