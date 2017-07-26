/**
 * Created by scott on 7/19/2017.
 */
var app = angular.module("RIESApp");


app.service("signalingService", function ($http) {
    var reqUrl = "https://ec2-13-59-237-239.us-east-2.compute.amazonaws.com/ries/signaling/signal";
    var self = this;

    self.saveRecording = function (data) {
        return $http.post(reqUrl, data);
    };
});