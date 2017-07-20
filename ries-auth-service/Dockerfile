FROM java:8
EXPOSE 80:80
ADD /target/ries-auth-service-0.0.1-SNAPSHOT.jar ries-auth-service.jar
ENTRYPOINT ["java", "-jar", "ries-auth-service.jar"]