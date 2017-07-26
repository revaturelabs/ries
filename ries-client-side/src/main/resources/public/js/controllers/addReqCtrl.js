/**
 * Created by Jhoan Osorno on 7/17/2017.
 */
var app = angular.module("RIESApp");

app.controller("addReqCtrl", function($scope, $state, $http, moment, globalVarService, requisitionService, guestHostService){
    $scope.trainerList = globalVarService.getTrainerList();
    $scope.user = globalVarService.getUserInfo();
    console.log($scope.trainerList);

    $http.defaults.headers.post["Content-Type"] = "text/plain";

    $scope.interviewDatePopup = false;
    //Default interview time is always the Monday of next week.
    $scope.interviewDate = moment().startOf('week').add(8,'days').toDate();

    $scope.addRequisition = function() {
        //var interviewDate = $scope.month + "/" + $scope.day + "/" + $scope.year;

        // converts date to milliseconds
        var interviewDateMil = new Date($scope.interviewDate).getTime();
        console.log(interviewDateMil);

        var guestObj = {
                'firstName' : $scope.guestFname,
                'lastName' : $scope.guestLname,
                'email' : $scope.guestEmail

        };

        var guestJson = angular.toJson(guestObj);
        console.log(guestJson);

        guestHostService.addGuest(guestJson, function(response){
            console.log(response);
            $scope.guest = response.data;

            var requisObj = {
                'interviewDate': interviewDateMil,
                'reqHost': $scope.reqHost.employeeId,
                'reqRecruiter': $scope.user.employeeId,
                'reqGuest': $scope.guest.guestId
            };

            var requisJson = angular.toJson(requisObj);
            console.log(requisJson);

            requisitionService.addRequisition(requisJson, function(response){
                console.log("SUCCESSFULLY MADE BOTH THE GUEST AND REQUISITION!!");
                $state.go('requisitions');
            }, function(response){
                console.log("FAILED TO JUST CREATED A REQUISITION AFTER THE GUEST WAS SUCCESSFULLY MADE");
            });
        }, function(response){
            console.log("FAILED TO CREATED A GUEST AND THEREFORE FAILED REQUISITION AS WELL");
        });
    };

    $scope.cancelButton = function(){
        $state.go('requisitions');
    };
});