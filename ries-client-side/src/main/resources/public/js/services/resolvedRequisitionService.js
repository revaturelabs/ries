/**
 * Created by Jhoan Osorno on 7/17/2017.
 */
var app = angular.module("RIESApp");

app.service("resolvedReqService", function($http){
    var self = this;

    self.getAllResolvedReqs = function(res) {
        var promise = $http({
            url: "http://localhost:8085/resolvedRequisition/all",
            method: "GET"
        });
        promise = promise.then(function(res) {
            return res.data;
        });
        return promise;
    };

    self.getResolvedReqByRecruiter = function(recruiterId, res) {
        var promise = $http({
            url: "http://localhost:8085/resolvedRequisition/recruiter/{recruiter}{" + id + "}",
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