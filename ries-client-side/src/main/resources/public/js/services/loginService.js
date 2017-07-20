/**
 * Created by Jhoan Osorno on 7/14/2017.
 */
var app = angular.module("RIESApp");

app.service("loginService", function($http){

    this.guestLogin = function(pin, done, err){
        $http({
            url:"https://ec2-13-58-151-115.us-east-2.compute.amazonaws.com/ries/auth/guest/login",
            method:"POST",
            data:{
                'pin': pin
            }
        }).then(done,err);
    };
});