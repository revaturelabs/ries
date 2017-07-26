/**
 * Created by Jhoan Osorno on 7/25/2017.
 */
var app = angular.module("RIESApp");

app.service("globalVarService", function(infoService){
    var self = this;

    self.trainerList = [];
    self.recruiterList = [];
    self.guestList = [];
    self.userInfo = [];


    self.retrieveData = function(){
        console.log("inside the retrieval data");

        infoService.getAllTrainers(function(response){
            console.log(response.data);
            self.trainerList = response.data;
            self.trainerList.push({
                "employeeId":"005g0000004JNzlAAG",
                "name":"Test Trainer",
                "nickname":"test_trainer",
                "email":"keving@revature.com",
                "firstName":"Test",
                "lastName":"Trainer",
                "picture":"https://revature--INT1--c.cs17.content.force.com/profilephoto/005/F",
                "thumbnail":"https://revature--INT1--c.cs17.content.force.com/profilephoto/005/T",
                "role":{
                    "roleId":"00Ei0000000ccV0EAI",
                    "name":"Trainers"
                }
            });
        },function(response){
            console.log("error retrieving trainers");
        });

        infoService.getAllRecruiters(function(response){
            console.log(response.data);
            self.recruiterList = response.data;
            self.recruiterList.push({});
        },function(response){
            console.log("error retrieving recruiters");
        });

        infoService.getAllGuests(function(response){
           console.log(response.data);
           self.guestList = response.data;
        }, function(response){
            console.log("error retrieving guests");
        });

        infoService.getUserInfo(function(response){
            console.log(response.data);
            self.userInfo = response.data;
        },function(response){
            console.log("error retrieving the userInfo");
        });

    };

    self.getTrainerList = function(){
        return self.trainerList;
    };

    self.setTrainerList = function(trainers){
        self.trainerList = trainers;
    };

    self.getRecruiterList = function(){
        return self.recruiterList;
    };

    self.setRecruiterList = function(recruiters){
        self.recruiterList = recruiters;
    };

    self.getGuestList = function(){
        return self.guestList;
    };

    self.setGuestList = function(guests){
        self.guestList = guests;
    };

    self.getUserInfo = function(){
        return self.userInfo;
    };

    self.setUserInfo = function(user){
        self.userInfo = user;
    };

    self.getUserRole = function(){
        return userInfo.role.roleId;
    };

    self.getTrainerById = function(id){
        for (var i = 0; i < self.trainerList.length; i++){
            if (id === self.trainerList[i].employeeId){
                return self.trainerList[i];
            }
        }
    };

    self.getRecruiterById = function(id){
        for (var i = 0; i < self.recruiterList.length; i++){
            if (id === self.recruiterList[i].employeeId){
                return self.recruiterList[i];
            }
        }
    };

    self.getGuestById = function(id){
        for (var i = 0; i < self.guestList.length; i++){
            if(id === self.guestList[i]){
                return self.guestList[i];
            }
        }
    };
});