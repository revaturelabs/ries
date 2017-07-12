var app = angular.module("RIESApp")


app.service("signalingService", function($http){
    var reqUrl = "/signaling";
    var self = this;

    self.saveRecording = function(data){
        return $http.post(reqUrl,data);
    };

    
});

app.service("requisitionService", function($http){
	
});

app.service("trainerService", function($http){
	
});

app.service("guestServuce", function($http){
	
});