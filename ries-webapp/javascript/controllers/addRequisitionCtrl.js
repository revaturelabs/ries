app.controller("addRequisitionCtrl", function($http, $scope) {
    $http.defaults.headers.post["Content-Type"] = "text/plain";
    
    $scope.addRequisition = function() {
        var interviewDate = $scope.month + $scope.day + $scope.year;
        // converts date to milliseconds
        interviewDate = new Date(interviewDate).getTime();
        
        var requisitionObj = {
            'reqRecruiter': $scope.recruiter,
            'reqHost': $scope.reqHost,
            'reqGuest': $scope.reqGuest,
            'interviewDate': interviewDate
        };

        var requisJson = angular.toJson(requisitionObj);
        $http({
            method: 'POST',
            url: 'http://localhost:8085/requisition/create',
            data: requisJson,
            headers: {'Content-Type': 'application/JSON'}
        })
        .success(function() {
            console.log("data successfully sent");
        })
        .error(function() {
            console.log("unable to send data");
        });
    };

});