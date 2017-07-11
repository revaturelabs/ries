angular.module("RIESApp", ['ui.router', 'ui.bootstrap'])
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
       $stateProvider.state('home', {
        url: '/',
        templateUrl: 'pages/home.html'
    });

    //put $stateProviders here
    
});

