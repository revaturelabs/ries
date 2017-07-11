angular.module("RIESApp")
.service("signalingService", function($http){
    var reqUrl = "/signaling";
    var self = this;

    self.saveRecording = function(data){
        return $http.post(reqUrl,data);
    };

    
})