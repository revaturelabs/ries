/**
 * Created by Jhoan Osorno on 7/14/2017.
 */
var app = angular.module("RIESApp");

app.controller("requisitionCtrl", function($scope, $state, requisitionService, globalVarService){
    $scope.title = "Requisitions";
    $scope.requisitions = [];
    $scope.requisitionList = [];
    $scope.trainers = globalVarService.getTrainerList();
    $scope.recruiters = globalVarService.getRecruiterList();
    $scope.user = globalVarService.getUserInfo();

    requisitionService.getAllRequisitions().then(function(res) {
        $scope.requisitions = res;

        for(var i = 0; i < $scope.requisitions.length; i++){
            var trainerId = $scope.requisitions[i].reqHost;
            var requisitionId = $scope.requisitions[i].reqRecruiter;
            var guestId = $scope.requisitions[i].reqGuest;
            $scope.requisitions[i].reqGuest = globalVarService.getGuestById(guestId);
            $scope.requisitions[i].reqHost = globalVarService.getTrainerById(trainerId);
            $scope.requisitions[i].reqRecruiter = globalVarService.getRecruiterById(requisitionId);
            $scope.requisitionList = $scope.requisitions;
        }
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

    $scope.filterBy = function(status){
        switch(status){
            case "All":
                $scope.title = "Requisitions";
                $scope.requisitionList = $scope.requisitions;
                break;
            case "Your":
                $scope.title = "My Requisitions";

                // if you are a trainer
                if($scope.user.role.roleId === "00Ei0000000ccV0EAI"){
                    for(var i = 0; i < $scope.requisitions; i++){
                        if($scope.user.employeeId === $scope.requisitions[i].reqHost){
                            $scope.requisitionList.push($scope.requisitions[i]);
                        }
                    }
                }
                // if you are a recruiter
                else if ($scope.user.role.roleId === "00Ei0000000Gcu3EAC"){
                    for(var i = 0; i < $scope.requisitions; i++){
                        if($scope.user.employeeId === $scope.requisitions[i].reqRecruiter){
                            $scope.requisitionList.push($scope.requisitions[i]);
                        }
                    }
                }
                break;
        }

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
            "Host URL",
            "Guest URL",
            "Observer URL"
        ]);

        $scope.requisitions.forEach(function(req){
           var reqId = req.reqId;
           var reqCDate = req.createDate;
           var reqIDate = req.interviewDate;
           var reqHost = req.reqHost.name;
           var reqGuest = req.reqGuest;
           var reqRecruiter = req.reqRecruiter.name;
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