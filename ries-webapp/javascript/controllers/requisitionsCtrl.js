app.controller("requisitionCtrl",['$scope', '$http', 'requisitionService', function($scope, $http, requisitionService) {
    requisitionService.getAllRequisitions().then(function(res) {
        $scope.requisitions = res;
    });
}]);

/* Need to fix filter
app.filter('reqByHost', function() {
    return function(requisitions, host) {
        if (host == "none" || host == "None" || host == "All" || host || "all") {
            return requisitions;
        }
        var filtered = [];
        for (var i = 0; i < requisitions; i++) {
            var requisition = requisitions[i];
            if (requisition == host) {
                filtered.push(requisition);
            }
        }

        return filtered;
    };
});
*/