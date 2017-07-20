/**
 * Created by craig on 7/19/2017.
 */

var app = angular.module("RIESApp");

app.controller("signalingCtrl", function($scope, signalingService) {


    $scope.saveRecording = function(){
        //make file using blob object made during recording; add name and date fields to make it a file
        //need to add fields for amazonS3 keys
        $scope.Recording.file =  $scope.blobGuest;
        // $scope.Recording.file.name = $scope.Recording.name;
        // $scope.Recording.file.lastModifiedDate = new Date();
        console.log($scope.Recording);

        //make download link for recording
        $scope.videoLink  = URL.createObjectURL($scope.Recording.file);

        //uncomment if you want to download recording when saving to s3
        // $scope.download();


        //
        signalingService.saveRecording($scope.Recording)
            .then(function(response) {
                $scope.feedback = response.data;
            }, function(error) {
                $scope.feedback= error.data;
                console.log(error);
            });
    };

    //download recording file function
    $scope.download = function() {
        var a = document.getElementById("a");
        var name = $scope.Recording.name +".ogg";
        a.href = URL.createObjectURL($scope.Recording.file);
        $scope.videoLink = a.href;
        a.download = name;
        console.log(a);
        a.click();

    };
});


