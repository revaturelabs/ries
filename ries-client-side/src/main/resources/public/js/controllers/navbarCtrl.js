/**
 * Created by Jhoan Osorno on 7/14/2017.
 */
var app = angular.module("RIESApp");

app.controller("navbarCtrl", function($scope, $state, $cookies){

    $scope.logout = function(){
        $cookies.remove('JSESSIONID');
        $state.go('login');
    };

    $scope.goToHome = function(){
        $state.go('home');
    };

    $scope.goToRequisition = function(){
        $state.go('requisitions');
    };

    $scope.goToResolvedRequisition = function(){
        $state.go('resolvedRequisitions');
    };

    $scope.goToHost = function(){
        $state.go('sessionHost');
    };

    $scope.goToGuest = function(){
        $state.go('sessionGuest');
    };

    $scope.goToObserver = function(){
        $state.go('sessionObserver');
    };

    $scope.goToTrainers = function(){
        $state.go('trainers');
    };

    $scope.goToCreateReq = function(){
        $state.go('addRequisition');
    };

    $scope.hideTab = function(){

    };
});