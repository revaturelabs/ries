/**
 * Created by Jhoan Osorno on 7/14/2017.
 */
var app = angular.module("RIESApp");

app.controller("requisitionCtrl", function($scope, $state, requisitionService){
    $scope.title = "Requisitions";
    $scope.requisitions = [];

    requisitionService.getAllRequisitions().then(function(res) {
        $scope.requisitions = res;
    });

    $scope.AddRequisitionButton = function(){
        $state.go('addRequisition');
    };

    $scope.goToRequisition = function(){
        $state.go('singleRequisition');
    };

    $scope.viewResolvedReq = function(){
        $state.go('resolvedRequisitions');
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
            "Host URL",
            "Guest URL",
            "Observer URL"
        ]);

        $scope.requisitions.forEach(function(req){
           var reqId = req.reqId;
           var reqCDate = req.createDate;
           var reqIDate = req.interviewDate;
           var reqHost = req.reqHost;
           var reqGuest = req.reqGuest;
           var reqRecruiter = req.reqRecruiter;
           var reqHURL = req.hostUrl;
           var reqGURL = req.guestUrl;
           var reqOURL = req.oberseverUrl;

           formatted.push([reqId, reqCDate, reqIDate, reqHost, reqGuest, reqRecruiter, reqHURL, reqGURL, reqOURL]);
        });

        return formatted;
    };

    // STUFF GOES HERE!!
    $scope.currReq = null;
    $scope.selectReq = function(re){
        $scope.currReq = re;
        console.log($scope.currReq);
    }
});