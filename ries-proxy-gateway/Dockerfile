FROM java:8
EXPOSE 80:80
ADD /target/ries-proxy-gateway-0.0.1-SNAPSHOT.jar ries-proxy-gateway.jar
ENTRYPOINT ["java", "-jar", "ries-proxy-gateway.jar"]