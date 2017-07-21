/**
 * Created by Jhoan Osorno on 7/14/2017.
 */
var app = angular.module("RIESApp", ['ui.router','ngSanitize', 'ngCsv','mwl.calendar', 'ui.bootstrap', 'ngCookies']);

// app.constant("employees",[{
//         employeeId:"005g0000004JNzlAAG",
//         name:"Test Trainer",
//         nickname:"test_trainer1",
//         password:"abcd",
//         email:"keving@revature.com",
//         firstName:"Test",
//         lastName:"Trainer",
//         picture:"https://revature--INT1--c.cs17.content.force.com/profilephoto/005/F",
//         thumbnail:"https://revature--INT1--c.cs17.content.force.com/profilephoto/005/T",
//         role:{
//             roleId:"00Ei0000000ccV0EAI",
//             name:"Trainers"
//             }
//         },{
//         employeeId:"006g000005JNz1AAG",
//         name:"Test Recruiter",
//         nickname:"test_recruiter1",
//         password:"abcd",
//         email:"esteban@revature.com",
//         firstname:"Test",
//         lastname:"Recruiter",
//         picture:"something",
//         thumbnail:"something else",
//         role:{
//             "roleId":"00Ei0000000Gcu3EAC",
//             "name":"Training Recruiters"
//         }
//     }]
// );

app.value('trainers', []);
app.value('requisitions',[]);
app.value('user',{});
app.value('singleRequisition',{});

app.config(function($stateProvider, $urlRouterProvider, $locationProvider){

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

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/login');
});

