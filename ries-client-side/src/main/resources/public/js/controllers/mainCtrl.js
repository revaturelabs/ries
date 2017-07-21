/**
 * Created by Jhoan Osorno on 7/19/2017.
 */

var app = angular.module("RIESApp");

app.controller("mainCtrl", function($scope, $location, $state, $cookies){
    $scope.init = function(){
        if ($location.search().JSESSIONID){
            console.log($location.search().JSESSIONID);
            $cookies.put("JSESSIONID", $location.search().JSESSIONID);

            $state.go('home');
        }
        else{
            console.log("NO SESSION YET!");
            $state.go('login');
        }
    };


});