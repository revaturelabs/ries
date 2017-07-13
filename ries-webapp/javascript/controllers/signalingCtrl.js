var app = angular.module("RIESApp");

app.controller("signalingCtrl", function($scope, signalingService) {

    $scope.saveRecording = function(){
        //get name from host input
        $scope.Recording.name = prompt("Please enter a name for the recording.");
        //make file using blob object made during recording; add name and date fields to make it a file
        //need to add fields for amazonS3 keys
        $scope.Recording.file = $scope.blob;
        $scope.Recording.file.name = $scope.recording.name;
        $scope.Recording.file.lastModifiedDate = new Date();

        signalingService.saveRecording($scope.Recording)
        .then(function(response) {
            $scope.message = response.data;
        }, function(error) {
            $scope.message = error.data;
            console.log(error);
        });
    };
});