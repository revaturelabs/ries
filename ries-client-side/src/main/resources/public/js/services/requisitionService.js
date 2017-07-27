/**
 * Created by Jhoan Osorno on 7/16/2017.
 */
var app = angular.module("RIESApp");

app.service("requisitionService", function($http, $cookies){
    var self = this;

    self.getAllRequisitions = function(res) {
        var promise = $http({
            // url: "http://localhost:8085/requisition/all",
            url: "https://ec2-13-59-237-239.us-east-2.compute.amazonaws.com/ries/requisition/requisition/all",
            method: "GET"
        });
        promise = promise.then(function(res) {
            return res.data;
        });
        return promise;
    };

    self.getRequisitionsByRecruiter = function(recruiterId, res) {
        var promise = $http({
            url: "https://ec2-13-59-237-239.us-east-2.compute.amazonaws.com/ries/requisition/requisition/recruiter/{" + id + "}",
            method: "GET"
        });
        promise = promise.then(function(res){
            return res.data;
        });
        return promise;
    };

    self.getRequisitionsByInterviewer = function(interviewerId, res) {
        var promise = $http({
            url: "https://ec2-13-59-237-239.us-east-2.compute.amazonaws.com/ries/requisition/requisition/interviewer/{" + id + "}",
            method: "GET"
        });
        promise = promise.then(function(res) {
            return res.data;
        });
        return promise;
    };

    // self.addRequisition = function(requisition, done, err){
    //     $http({
    //         method:"POST",
    //         url:"https://ec2-13-59-237-239.us-east-2.compute.amazonaws.com/ries/requisition/requisition/create",
    //         headers: {'Content-Type': 'application/JSON'},
    //         data:requisition
    //     }).then(done,err);
    // }

    self.addRequisition = function(requisition, done, err){
        $http({
            method:"POST",
            url:"https://ec2-13-59-237-239.us-east-2.compute.amazonaws.com/ries/requisition/requisition/create",
            headers: {'Content-Type': 'text/plain'},
            data:requisition
        }).then(done,err);
    }




});