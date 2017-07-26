/**
 * Created by Jhoan Osorno on 7/17/2017.
 */
var app = angular.module("RIESApp");

app.service("resolvedReqService", function($http){
    var self = this;

    self.getAllResolvedReqs = function(res) {
        var promise = $http({
            //url: "http://localhost:8085/resolvedRequisition/all",
            url: "https://ec2-13-59-237-239.us-east-2.compute.amazonaws.com/ries/requisition/resolvedRequisition/all",
            method: "GET"
        });
        promise = promise.then(function(res) {
            return res.data;
        });
        return promise;
    };

    self.getResolvedReqByRecruiter = function(recruiterId, res) {
        var promise = $http({
            url: "https://ec2-13-59-237-239.us-east-2.compute.amazonaws.com/ries/requisition/resolvedRequisition/recruiter/{recruiter}{" + id + "}",
            method: "GET"
        });
        promise = promise.then(function(res){
            return res.data;
        });
        return promise;
    };

    // self.getResolvedReqByInterviewer = function(interviewerId, res) {
    //     var promise = $http({
    //         url: "http://localhost:8085/resolvedRequisition/interviewer/{" + id + "}",
    //         method: "GET"
    //     });
    //     promise = promise.then(function(res) {
    //         return res.data;
    //     });
    //     return promise;
    // };
});