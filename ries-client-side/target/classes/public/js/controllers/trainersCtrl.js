/**
 * Created by Jhoan Osorno on 7/16/2017.
 */
var app = angular.module("RIESApp");

app.controller("trainerCtrl", function($scope, $window){
    $scope.title = "Trainers Page";
    $scope.trainerList = [];

    trainerService.getAllTrainers(function(response){
       console.log('success for viewing all trainers');
       console.log(response);

       $scope.trainerList = response.data;

    },function(response){
        console.log('error in retrieving all trainers');
        console.log(response);
    });

});