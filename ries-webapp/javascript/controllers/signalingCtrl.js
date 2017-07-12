var app = angular.module("RIESApp");

app.controller("signalingCtrl", function($scope, signalingService) {
//service for view peer video
//service for view self video
//service for chat box

    $scope.saveRecording = function(){
        //get name from host input, file from recording blob
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