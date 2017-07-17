app.controller("requisitionCtrl",['$scope', '$http', 'requisitionService', function($scope, $http, requisitionService) {
    requisitionService.getAllRequisitions().then(function(res) {
        $scope.requisitions = res;
        console.log($scope.requisitions[0].interviewDate); // date and time are in milliseconds
    });
    
}]);

/*
Filter by date or Interviewer
*/
app.filter("interviewByDate", function() {
    return function(date, requisitions) {
        var filtered = [];

        for (var i = 0; i < requisitions.length; i++) {
            if (requisitions[i].interviewDate == date) {
                filtered.push(requisitions[i]);
            }
        }
        return filtered;
    }
});