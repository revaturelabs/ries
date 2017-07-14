var app = angular.module("RIESApp");

app.service("loginService", function($http){
    
    this.login = function(username, password, done, err){
        $http({
            url: "",
            method:"POST",
            data:{
                'nickname':username,
                'password':password
            }
        }).then(done,err);
    };

    this.guestLogin = function(pin, password, done, err){
        $http({
            url:"",
            method:"POST",
            data:{
                'pin': pin,
                'password' : password
            }
        }).then(done,err);
    };
});