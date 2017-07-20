/**
 * Created by Jhoan Osorno on 7/16/2017.
 */
var app = angular.module("RIESApp");

app.service("requisitionService", function($http){
    var self = this;

    self.getAllRequisitions = function(res) {
        var promise = $http({
            url: "http://localhost:8085/requisition/all",
            // url: "https://ec2-13-58-151-115.us-east-2.compute.amazonaws.com/ries/requisition/requisition/all",
            method: "GET"
        });
        promise = promise.then(function(res) {
            return res.data;
        });
        return promise;
    };

    self.getRequisitionsByRecruiter = function(recruiterId, res) {
        var promise = $http({
            url: "http://localhost:8085/requisition/recruiter/{" + id + "}",
            method: "GET"
        });
        promise = promise.then(function(res){
            return res.data;
        });
        return promise;
    };

    self.getRequisitionsByInterviewer = function(interviewerId, res) {
        var promise = $http({
            url: "http://localhost:8085/requisition/interviewer/{" + id + "}",
            method: "GET"
        });
        promise = promise.then(function(res) {
            return res.data;
        });
        return promise;
    };
});