app.controller("addRequisitionCtrl", function($http, $scope) {
    $http.defaults.headers.post["Content-Type"] = "text/plain";
    
    $scope.addRequisition = function() {
        var interviewDate = $scope.month + "/" + $scope.day + "/" + $scope.year;

        // converts date to milliseconds
        var interviewDateMil = new Date(interviewDate).getTime();
        console.log(interviewDateMil);
        var requisitionObj = {
            'reqRecruiter': $scope.recruiter,
            'reqHost': $scope.reqHost,
            'reqGuest': $scope.reqGuest,
            'interviewDate': interviewDateMil
        };

        var requisJson = angular.toJson(requisitionObj);
        $http({
            method: 'POST',
            url: 'http://localhost:8085/requisition/create',
            data: requisJson,
            headers: {'Content-Type': 'application/JSON'}
        })
        .then(function(res) {
            console.log("data successfully sent");
        }, function(err) {
            console.log("shit");
        });
    };

});