/**
 * Created by Jhoan Osorno on 7/17/2017.
 */
var app = angular.module("RIESApp");

app.controller("resolvedReqCtrl", function($scope, $state, $window, resolvedReqService, globalVarService){
    $scope.title = "Resolved Requisitions";
    $scope.resolvedReqs = [];

    resolvedReqService.getAllResolvedReqs().then(function(res){
        $scope.resolvedReqs = res;
        console.log($scope.resolvedReqs);
        for(var i = 0; i < $scope.resolvedReqs.length; i++){
            var trainerId = $scope.resolvedReqs[i].host;
            var requisitionId = $scope.resolvedReqs[i].recruiter;
            var guestId = $scope.resolvedReqs[i].guest;
            $scope.resolvedReqs[i].guest = globalVarService.getGuestById(guestId);
            $scope.resolvedReqs[i].host = globalVarService.getTrainerById(trainerId);
            $scope.resolvedReqs[i].recruiter = globalVarService.getRecruiterById(requisitionId);
        }
        console.log($scope.resolvedReqs);
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