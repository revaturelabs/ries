/**
 * Created by Jhoan Osorno on 7/18/2017.
 */
var app = angular.module("RIESApp");

app.controller("loginCtrl", function($scope, $state, $window){

    $scope.goToSalesForceLogin = function(){
        console.log($window.location);
        if($window.location.hostname === "localhost") {
            $window.location.href = "https://ec2-13-59-237-239.us-east-2.compute.amazonaws.com/test";
        }
        else {
            $window.location.href = "https://ec2-13-59-237-239.us-east-2.compute.amazonaws.com";
        }
    };

    $scope.goToGuestLogin = function(){
        $state.go('guestLogin');
    };

    $scope.goToHome = function(){
        $state.go('home');
    };
});