/**
 * Created by Jhoan Osorno on 7/14/2017.
 */
var app = angular.module("RIESApp");

app.service("loginService", function($http){

    this.guestLogin = function(pin, done, err){
        $http({
            url:"https://ec2-13-59-237-239.us-east-2.compute.amazonaws.com/ries/auth/guest/login",
            method:"POST",
            headers:{'Content-Type': 'application/json'},
            data:{
                'pin': pin
            }
        }).then(done,err);
    };

    this.employeeLogout = function(done,err){
        $http({
            url:"https://ec2-13-59-237-239.us-east-2.compute.amazonaws.com/logout",
            method:"GET"
        }).then(done, err);
    };
});