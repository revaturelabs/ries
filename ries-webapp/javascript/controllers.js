angular.module("RIESApp")
.controller("signalingCtrl", function($scope, signalingService) {
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
})