app.controller("requisitionCtrl",['$scope', '$http', 'requisitionService', function($scope, $http, requisitionService) {
    requisitionService.getAllRequisitions().then(function(res) {
        $scope.requisitions = res;
        //console.log($scope.requisitions[0].interviewDate); // date and time are in milliseconds
    });
    
    /*
    $scope.filterDate = function(re) {
        console.log(re.interViewDate);
        console.log($scope.inputDate);
        return re.interViewDate == $scope.inputDate;
    }*/
}]);

/*
Filter by date or Interviewer
*/
/*
app.filter("interviewByDate", function() {
    return function(date) {
        
    }
});*/