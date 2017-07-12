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


app.controller("signalingCtrl", function($scope, signalingService) {
    $scope.saveRecording = function(){
        $scope.recording.name = "";
        $scope.recording.file = "";

        signalingService.saveRecording(recording)
        .then(function(response) {
            $scope.message = response.data;
        }, function(error) {
            $scope.message = error.data;
            console.log(error);
        });
    }
});

app.controller("requisitionCtrl", function($scope, requisitionServuce){
	
});

app.controller("trainerCtrl", function($scope, trainerService){
	
});

app.controller("guestCtrl", function($scope, guestServuce){
	
});

