/**
 * Created by Jhoan Osorno on 7/14/2017.
 */
var app = angular.module("RIESApp");

app.controller("navbarCtrl", function($scope, $state, $cookies, loginService, globalVarService){

    $scope.logout = function(){
        loginService.employeeLogout(function(response){
            consoloe.log("SUCCESS LOGGING OUT");
            $cookies.remove('JSESSIONID');
            $state.go('login');
        }, function(response){
            console.log("ERROR LOGGIN OUT");
        });
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

    $scope.hideFromTrainer = function(){
        // var role = globalVarService.getUserRole();
        // if (role === "00Ei0000000Gcu3EAC"){
        //     return true;
        // }
        // else{
        //     return false;
        // }/
    };

    $scope.hideFromRecruiter = function(){
      // var role = globalVarService.getUserRole();
      // if(role === "00Ei0000000ccV0EAI"){
      //     return true;
      // }
      // else{
      //     return false;
      // }
    };
});