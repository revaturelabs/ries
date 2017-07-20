var app = angular.module("RIESApp");

app.controller("authCtrl", function($scope,$http, $state, $window, $location, loginService ){
    
    var authCtrl = this;

    authCtrl.loginError = false;
    authCtrl.loggedIn = false;
    authCtrl.guestLoginError = false;
    authCtrl.guestLoggedIn = false;

    authCtrl.username = '';
    authCtrl.password = '';

    authCtrl.guestPin = '';
    authCtrl.guestPassword = '';

    $scope.login = function(){
        loginService.login($scope.username, $scope.password, function(response){
        // NEED TO ADD THE EMPLOYEE TO A GLOBAL VARIABLE
       
            authCtrl.loggedIn = true;
            $state.go('home');
        }, function(response){
            $window.alert("Incorrect Credentials!");
            authCtrl.username = '';
            authCtrl.password = '';
            authCtrl.loginError = true;
            $state.go('login');
        });
    };

    $scope.guestLogin = function(){
         loginService.guestLogin($scope.guestPin, $scope.guestPassword, function(response){
            //NEED TO STORE THE GUEST OBJECT????
            authCtrl.guestLoggedIn = true;
            $state.go('sessionGuest');
        }, function(response){
            $window.alert("Incorrect Pin!");
            authCtrl.guestPin = '';
            authCtrl.guestPassword = '';
            authCtrl.guestLoginError = true;
            $state.go('guestLogin');
        });
    };
    
});