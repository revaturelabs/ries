riesApp.controller("HomeCtrl", function($scope) {
    $scope.requisites = [];

    $http({
        url: "http://localhost:8085/requisition/all",
        method: "GET"
    }).then(function(res) {
        $scope.requisites = res.data;
    })
});