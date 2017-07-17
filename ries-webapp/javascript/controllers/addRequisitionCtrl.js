app.controller("addRequisitionCtrl", function($http, $scope) {
    $http.defaults.headers.post["Content-Type"] = "text/plain";
    
    $scope.addRequisition = function() {
        if ($scope.month < 10) {
            $scope.month = '0'+$scope.month;
        }
        var interviewDate = $scope.month + "/" + $scope.day + "/" + $scope.year;
        
        console.log(interviewDate);
        if ($scope.ampm == "PM") {
            $scope.hour = parseInt($scope.hour) + 12;
            console.log($scope.hour);
        } 
        var interViewTime = $scope.hour + ":" + $scope.minute;

        var interviewDateTime = interviewDate + " " + interViewTime;
        // converts date to milliseconds
        var interviewDateMil = new Date(interviewDateTime).getTime();
        
        var requisitionObj = {
            'reqRecruiter': $scope.recruiter,
            'reqHost': $scope.reqHost,
            'reqGuest': $scope.reqGuest,
            'interviewDate': interviewDateMil
        };

        var requisJson = angular.toJson(requisitionObj);
        console.log(requisJson);
        $http({
            method: 'POST',
            url: 'http://localhost:8085/requisition/create',
            data: requisJson,
            headers: {'Content-Type': 'application/JSON'}
        })
        .then(function(res) {
            console.log("data successfully sent");
        }, function(err) {
            console.log("not working");
            console.log(err);
        });
    };

});