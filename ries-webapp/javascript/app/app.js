var app = angular.module("RIESApp", ['ui.router', 'ui.bootstrap'])


app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
	
	$stateProvider.state('home', {
		url: "/",
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
		url: "/",
		views:{
			nav:{
				templateUrl : "pages/navbar.html"
			},
			content:{
				templateUrl : "pages/requisitions.html",
				controller : "requisitionCtrl"
			}
		}
	});

	$stateProvider.state('addRequisition', {
		url: "/",
		views:{
			nav:{
				templateUrl : "pages/navbar.html"
			},
			content:{
				templateUrl : "pages/addRequisitions.html",
				controller : "addRequisitionCtrl"
			}
		}
	});
	
	$stateProvider.state('trainers', {
		url: "/",
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
		url: "/",
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
		url: "/",
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
		url: "/",
		views:{
			nav:{
				templateUrl : "pages/navbar.html"
			},
			content:{
				templateUrl : "pages/sessionObserver.html"
			}
		}
	});
    
    
});

