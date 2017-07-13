var app = angular.module("RIESApp", ['ui.router', 'ui.bootstrap'])


app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	
	$stateProvider.state('login',{
		url: "/login",
		views:{
			nav:{
				templateUrl: null
			},
			content:{
				templateUrl: "pages/login.html"
			}
		}
	});
	
	$stateProvider.state('home', {
		url: "/home",
		views:{
			nav:{
				templateUrl : "pages/navbar.html"
			},
			content:{
				templateUrl : "pages/home.html"
			}
		}
	});
	
	$stateProvider.state('requisitions', {
		url: "/requisitions",
		views:{
			nav:{
				templateUrl : "pages/navbar.html"
			},
			content:{
				templateUrl : "pages/requisitions.html"
			}
		}
	});
	
	$stateProvider.state('trainers', {
		url: "/trainers",
		views:{
			nav:{
				templateUrl : "pages/navbar.html"
			},
			content:{
				templateUrl : "pages/trainers.html"
			}
		}
	});

	$stateProvider.state('sessionHost', {
		url: "/session/host",
		views:{
			nav:{
				templateUrl : "pages/navbar.html"
			},
			content:{
				templateUrl : "pages/sessionHost.html"
			}
		}
	});

	$stateProvider.state('sessionGuest', {
		url: "/session/guest",
		views:{
			nav:{
				templateUrl : "pages/navbar.html"
			},
			content:{
				templateUrl : "pages/sessionGuest.html"
			}
		}
	});

	$stateProvider.state('sessionObserver', {
		url: "/session/observer",
		views:{
			nav:{
				templateUrl : "pages/navbar.html"
			},
			content:{
				templateUrl : "pages/sessionObserver.html"
			}
		}
	});

	$stateProvider.state('guestLogin',{
		url: "/guest/login",
		views:{
			nav:{
				templateUrl : null
			},
			content:{
				templateUrl : "pages/guestLogin.html"
			}
		}
	});

	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/home'); 
});

