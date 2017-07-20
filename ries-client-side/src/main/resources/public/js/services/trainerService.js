/**
 * Created by Jhoan Osorno on 7/16/2017.
 */
var app = angular.module("RIESApp");

app.service("trainerService", function($http){
    var self = this;

    self.getAllTrainers = function(done,err){
        $http({
            method:"GET",
            url:"/"
        }).then(done,err);
    };
});