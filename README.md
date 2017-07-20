# ries
revature interview and evaluation system

## Resource Server Authentication Setup

Maven dependencies:
```
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

Application Configuration (YML):
```
salesforce:
  oath2-url: https://test.salesforce.com/services/oauth2
  revoke: ${salesforce.oath2-url}/revoke

security:
  oauth2:
    client:
      client-id: 3MVG9ahGHqp.k2_wb8eUMtoR38_WbYxUPAgheLOPEgoU4jCdw5EKilrUbtX4cxh0X0Kk2GEexJCqbOsMsD0Sm
      client-secret: 9101950503076607108
      access-token-uri: ${salesforce.oath2-url}/token
      user-authorization-uri: ${salesforce.oath2-url}/authorize
      client-authentication-scheme: form
      authentication-scheme: header
      grant-type: authentication-code
    resource:
      user-info-uri: ${salesforce.oath2-url}/userinfo
```

Add `@EnableResourceServer` annotation over your Main Application class. Example:
```
@SpringBootApplication
@EnableDiscoveryClient
@EnableResourceServer
public class RiesRequisitionsServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(RiesRequisitionsServiceApplication.class, args);
	}
}
```

Copy over these files from `ries-proxy-gateway`:
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
```
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
```
    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public ResponseEntity<Employee> test(OAuth2Authentication auth) {
        Employee employee = force.getCurrentEmployee(auth);
        boolean isTrainer = employee.isTrainer();
        boolean isRecruiter = employee.isRecruiter();
        
        ...
    }
```
