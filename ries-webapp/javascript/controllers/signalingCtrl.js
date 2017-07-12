var app = angular.module("RIESApp");

app.controller("signalingCtrl", function($scope, signalingService) {

    $scope.saveRecording = function(){
        //get name from host input
        $scope.recording.name = prompt("Please enter a name for the recording.");
        //make file using blob object made during recording; add name and date fields to make it a file
        $scope.recording.file = $scope.blob;
        $scope.recording.file.name = $scope.recording.name;
        $scope.recording.file.lastModifiedDate = new Date();

        signalingService.saveRecording($scope.recording)
        .then(function(response) {
            $scope.message = response.data;
        }, function(error) {
            $scope.message = error.data;
            console.log(error);
        });
    };
});