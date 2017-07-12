app.controller("requisitionCtrl",['$scope', '$http', 'requisitionService', function($scope, $http, requisitionService) {
    requisitionService.getAllRequisitions().then(function(res) {
        $scope.requisitions = res;
    });
}]);