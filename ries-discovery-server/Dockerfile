FROM java:8
EXPOSE 80:80
ADD /target/ries-discovery-server-0.0.1-SNAPSHOT.jar ries-discovery-server.jar
ENTRYPOINT ["java", "-jar", "ries-discovery-server.jar"]