var app = angular.module("RIESApp");

app.controller("NavbarCtrl", function($scope, $rootScope, $state){
	
	$scope.goToHome = function(){
		$state.go('home');
	};
	
	$scope.goToRequisition = function(){
		$state.go('requisitions');
	};
	
	$scope.goToTrainers = functions(){
		$state.go('trainers');
	};
	
	$scope.logout = function(){
		$state.go('login');
	};
	
	$scope.hideTab = function(){
		// WAITING FOR ANDY TO PASS USERS SO I CAN HIDE
		// NECESSARY TABS
	};
});