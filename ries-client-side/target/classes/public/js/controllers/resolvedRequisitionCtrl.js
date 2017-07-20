/**
 * Created by Jhoan Osorno on 7/17/2017.
 */
var app = angular.module("RIESApp");

app.controller("resolvedReqCtrl", function($scope, $state, $window, resolvedReqService){
    $scope.title = "Resolved Requisition's";
    $scope.resolvedReqs = [];

    resolvedReqService.getAllResolvedReqs().then(function(res){
        $scope.resolvedReqs = res;
    });

    $scope.viewRequisitions = function(){
        $state.go('requisitions');
    };

    $scope.formatRequisition = function(){
        var formatted = [];
        formatted.push([
            "Requisition ID",
            "Date Created",
            "Interview Date",
            "Host ID",
            "Guest ID",
            "Recruiter ID",
            "Video"
        ]);

        $scope.resolvedReqs.forEach(function(req){
            var reqId = req.Id;
            var reqCDate = req.createDate;
            var reqIDate = req.interviewDate;
            var reqGuest = req.guest;
            var reqHost = req.host;
            var reqRecruiter = req.recruiter;
            var reqVideo = req.video;

            formatted.push([reqId, reqCDate, reqIDate, reqGuest, reqHost,  reqRecruiter, reqVideo]);
        });

        return formatted;
    };
});