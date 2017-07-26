/**
 * Created by Jhoan Osorno on 7/24/2017.
 */
var app = angular.module("RIESApp");

app.service("infoService", function($http){
    var self = this;

    self.getAllTrainers = function(done, err){
        $http({
            method:"GET",
            url:"https://ec2-13-59-237-239.us-east-2.compute.amazonaws.com/trainers"
            //url:""
        }).then(done,err);
    };

    self.getAllRecruiters = function(done, err){
        $http({
            method:"GET",
            url:"https://ec2-13-59-237-239.us-east-2.compute.amazonaws.com/recruiters"
            //url:""
        }).then(done,err);
    };

    self.getAllGuests = function(done, err){
        $http({
            method:"GET",
            url:"https://ec2-13-59-237-239.us-east-2.compute.amazonaws.com/ries/auth/guests"
        }).then(done,err);
    };

    self.getUserInfo = function(done, err){
        $http({
            method:"GET",
            url:"https://ec2-13-59-237-239.us-east-2.compute.amazonaws.com/userinfo"
            //url:""
        }).then(done,err);
    };
});