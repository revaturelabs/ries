var app = angular.module("RIESApp", ['ui.router', 'ui.bootstrap'])


app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
	
	$stateProvider.state('home', {
		url: "/",
		views:{
			nav:{
				templateUrl = "pages/navbar.html"
			},
			content:{
				templateUrl = "pages/home.html"
			}
		}
	});
	
	$stateProvider.state('requisitions', {
		url: "/",
		views:{
			nav:{
				templateUrl = "pages/navbar.html"
			},
			content:{
				templateUrl = "pages/requisitions.html"
			}
		}
	});
	
	$stateProvider.state('trainers', {
		url: "/",
		views:{
			nav:{
				templateUrl = "pages/navbar.html"
			},
			content:{
				templateUrl = "pages/trainers.html"
			}
		}
	});

    //put $stateProviders here
    
});

