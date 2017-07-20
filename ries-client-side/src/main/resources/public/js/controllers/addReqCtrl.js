/**
 * Created by Jhoan Osorno on 7/17/2017.
 */
var app = angular.module("RIESApp");

app.controller("addReqCtrl", function($scope, $state, $http, moment){
    $http.defaults.headers.post["Content-Type"] = "text/plain";

    $scope.interviewDatePopup = false;
    //Default interview time is always the Monday of next week.
    $scope.interviewDate = moment().startOf('week').add(8,'days').toDate();

    $scope.addRequisition = function() {
        //var interviewDate = $scope.month + "/" + $scope.day + "/" + $scope.year;

        // converts date to milliseconds
        var interviewDateMil = new Date($scope.interviewDate).getTime();
        console.log(interviewDateMil);
        var requisitionObj = {
            'reqRecruiter': $scope.recruiter,
            'reqHost': $scope.reqHost,
            'reqGuest': $scope.reqGuest,
            'interviewDate': interviewDateMil
        };

        var requisJson = angular.toJson(requisitionObj);
        $http({
            method: 'POST',
            url: 'http://localhost:8085/requisition/create',
            data: requisJson,
            headers: {'Content-Type': 'application/JSON'}
        })
            .then(function(res) {
                console.log("data successfully sent");
                $state.go('requisitions');
            }, function(err) {
                console.log("shit");
            });
    };

    $scope.cancelButton = function(){
        $state.go('requisitions');
    };
});