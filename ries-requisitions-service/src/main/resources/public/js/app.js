var riesApp = angular.module("reisApp", ['ui.router']);

riesApp.config(function($stateProvider, $locationProvider) {
    $stateProvider.state('home', {
        url:'/home',
        templateUrl: 'html/home.html',
        controller: 'HomeCtrl'
    });

    $locationProvider.html5Mode(true);
});