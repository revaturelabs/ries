/**
 * Created by Jhoan Osorno on 7/14/2017.
 */
var app = angular.module("RIESApp", ['ui.router','ngSanitize', 'ngCsv','mwl.calendar', 'ui.bootstrap', 'ngCookies']);

// app.value('trainers', []);
// app.value('userInfo',{});
// app.value('recruiters',[]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){

    $httpProvider.defaults.withCredentials = true;

    // the login screen view
    $stateProvider.state('login',{
       url:"/login",
        views:{
           nav:{
               templateUrl:null
           },
            content:{
               templateUrl:"html/login.html"
            }
        }
    });

    // the guest login screen view
    $stateProvider.state('guestLogin',{
       url:"/guest/login",
        views:{
           nav:{
               templateUrl:null
           },
            content:{
               templateUrl:"html/guestLogin.html"
            }
        }
    });

    // the home screen once you login
    $stateProvider.state('home',{
        url:"/home",
        views:{
            nav:{
                templateUrl:"html/navbar.html"
            },
            content:{
                templateUrl:"html/home.html"
            }
        }
    });

    $stateProvider.state('requisitions', {
        url: "/requisitions/upcoming",
        views:{
            nav:{
                templateUrl : "html/navbar.html"
            },
            content:{
                templateUrl : "html/requisitions.html",
                controller: "requisitionCtrl"
            }
        }
    });

    $stateProvider.state('resolvedRequisitions', {
        url: "/requisitions/resolved",
        views:{
            nav:{
                templateUrl:"html/navbar.html"
            },
            content:{
                templateUrl: "html/resolvedRequisitions.html"
            }
        }
    });

    $stateProvider.state('addRequisition', {
        url: "/requisitions/submit",
        views:{
            nav:{
                templateUrl : "html/navbar.html"
            },
            content:{
                templateUrl : "html/addRequisition.html",
                controller : "addReqCtrl"
            }
        }
    });

    $stateProvider.state('singleRequisition',{
        url:"/requisition",
        views:{
            nav:{
                templateUrl : "html/navbar.html"
            },
            content:{
                templateUrl : "html/requisition.html"
            }
        }
    });

    $stateProvider.state('trainers', {
        url: "/trainers",
        views:{
            nav:{
                templateUrl : "html/navbar.html"
            },
            content:{
                templateUrl : "html/trainers.html"
            }
        }
    });

    $stateProvider.state('sessionHost', {
        url: "/session/host",
        views:{
            nav:{
                templateUrl : "html/navbar.html"
            },
            content:{
                templateUrl : "html/sessionHost.html"
            }
        }
    });

    $stateProvider.state('sessionGuest', {
        url: "/session/guest",
        views:{
            nav:{
                templateUrl : "html/navbar.html"
            },
            content:{
                templateUrl : "html/sessionGuest.html"
            }
        }
    });

    $stateProvider.state('sessionObserver', {
        url: "/session/observer",
        views:{
            nav:{
                templateUrl : "html/navbar.html"
            },
            content:{
                templateUrl : "html/sessionObserver.html"
            }
        }
    });

    $stateProvider.state('main', {
        url: "/",
        views:{
           nav:{
               templateUrl: null
           },
            content:{
               templateUrl: "html/main.html"
            }
        }
    });

    $stateProvider.state('error', {
        url: '/error',
        views: {
            nav: {
                templateUrl: null
            },
            content: {
                templateUrl: "html/error.html"
            }
        }
    });

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/error');
});

