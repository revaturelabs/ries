echo Creating images based off new build artifacts.
cd /var/lib/jenkins/workspace/ries_predevelopment/ries-discovery-server/
docker build -t ries-discovery-server .
cd /var/lib/jenkins/workspace/ries_predevelopment/ries-auth-service/
docker build -t ries-auth-service .
cd /var/lib/jenkins/workspace/ries_predevelopment/ries-signaling-service/
docker build -t ries-signaling-service .

echo Taging images for docker cloud use.
docker tag ries-discovery-server $DOCKER_ID_USER/ries-discovery-server
docker tag ries-auth-service $DOCKER_ID_USER/ries-auth-service
docker tag ries-signaling-service $DOCKER_ID_USER/ries-signaling-service

echo Pushing services to docker cloud.
docker push $DOCKER_ID_USER/ries-discovery-server
docker push $DOCKER_ID_USER/ries-auth-service
docker push $DOCKER_ID_USER/ries-signaling-service


echo Deploying updated images to the swarm. 
docker service update --image ries-discovery-server ries-discovery-server
docker service update --image ries-auth-service ries-auth-service
docker service update --image ries-signaling-service ries-signaling-service
