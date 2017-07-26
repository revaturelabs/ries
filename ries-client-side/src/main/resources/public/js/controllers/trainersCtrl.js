/**
 * Created by Jhoan Osorno on 7/16/2017.
 */

var app = angular.module("RIESApp");

app.controller("trainerCtrl", function($scope, globalVarService){
    console.log("inside the trainer controller");
    $scope.title = "Trainers";
    $scope.trainerList = globalVarService.getTrainerList();
    // console.log(trainers);
    // $scope.trainerList = infoService.getTrainerList();
    // console.log($scope.trainerList);
    // $scope.recruiterList = ;
});
