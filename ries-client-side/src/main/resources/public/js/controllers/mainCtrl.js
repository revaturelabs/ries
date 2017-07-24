/**
 * Created by Jhoan Osorno on 7/19/2017.
 */

var app = angular.module("RIESApp");

app.controller("mainCtrl", function($scope, $state, $cookies, infoService, trainers, recruiters, userInfo){
    $scope.init = function(){
        if ($cookies.get('JSESSIONID')){
            console.log($cookies.get('JSESSIONID'));

            infoService.getAllTrainers(function(response){
                console.log(response.data);
                trainers = response.data;
                console.log(trainers);
            },function(response){
                console.log("error retrieving trainers");
            });

            infoService.getAllRecruiters(function(response){
                console.log(response.data);
                recruiters = response.data;
                console.log(recruiters);
            },function(response){
                console.log("error retrieving recruiters");
            });

            infoService.getUserInfo(function(response){
                console.log(response.data);
                userInfo = response.data;
                console.log(userInfo);
            },function(response){
                console.log("error retrieving the userInfo");
            });

            $state.go('home');
        }
        else{
            console.log("NO SESSION YET!");
            $state.go('login');
        }
    };
});