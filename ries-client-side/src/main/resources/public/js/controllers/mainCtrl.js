/**
 * Created by Jhoan Osorno on 7/19/2017.
 */

var app = angular.module("RIESApp");

app.controller("mainCtrl", function($scope, $state, $cookies,globalVarService){
    $scope.init = function(){
        if ($cookies.get('JSESSIONID')){
            console.log($cookies.get('JSESSIONID'));

            globalVarService.retrieveData();
            $state.go('home');
        }
        else{
            console.log("NO SESSION YET!");
            $state.go('login');
        }
    };
});