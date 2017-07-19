FROM java:8
EXPOSE 80:80
ADD /target/ries-signaling-service-0.0.1-SNAPSHOT.jar ries-signaling-service.jar
ENTRYPOINT ["java", "-jar", "ries-signaling-service.jar"]