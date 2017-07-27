/**
 * Created by craig on 7/20/2017.
 */
var app = angular.module("RIESApp");

app.service("guestHostService", function ($http, requisitionService) {

    this.numbCredentials = function () {
        return ["turn:numb.viagenie.ca:3478", "craighatch90@gmail.com", "pr0gs4d4yz"];
    };
    this.getWebsocketEndPoint = function () {
        return "ws://ec2-13-58-14-134.us-east-2.compute.amazonaws.com:3001/socket"
        // return 'ws://localhost:3001/socket';
    };

    this.addGuest = function (guest, done, err) {
        $http({
            method: "POST",
            url: "https://ec2-13-59-237-239.us-east-2.compute.amazonaws.com/ries/auth/guest",
            headers: {'Content-Type': 'application/JSON'},
            data: guest
        }).then(done, err);
    };

    this.getAllRequisitions = function () {

        req1 = {
            reqId: 1,
            createDate: "7/20/2017",
            interviewDate: "7/25/2017",
            reqHost: "Emily Higgins",
            reqGuest: "Craig Hatch",
            reqRecruiter: "Nick Anderson"
        };
        req2 = {
            reqId: 23,
            createDate: "7/16/2017",
            interviewDate: "7/24/2017",
            reqHost: "August Duet",
            reqGuest: "Jhaon Osorno",
            reqRecruiter: "Rachna Tyagi"
        };
        req3 = {
            reqId: 24,
            createDate: "7/16/2017",
            interviewDate: "7/24/2017",
            reqHost: "August Duet",
            reqGuest: "Hello World",
            reqRecruiter: "Rachna Tyagi"
        };

        return [req1, req2, req3];
        // return requisitionService.getAllRequisitions();
    };


    this.setUpWebsocket = function (handleLogin, handleOffer, handleAnswer, handleCandidate, handleLeave, handleNewMember) {
        var conn = new WebSocket(this.getWebsocketEndPoint());
        conn.onopen = function () {
            console.log("Connected to the signaling server");
        };
        //when we got a message from a signaling server
        conn.onmessage = function (msg) {

            var data = JSON.parse(msg.data);
            //console.log("Got message", data);
            switch (data.type) {
                //initial login
                case "login":
                    handleLogin(data.success);
                    break;
                //when somebody wants to call us
                case "offer":
                    handleOffer(data);
                    break;
                case "answer":
                    handleAnswer(data);
                    break;
                //when a remote peer sends an ice candidate to us
                case "candidate":
                    handleCandidate(data);
                    break;
                case "leave":
                    handleLeave();
                    break;
                case "newMember":
                    handleNewMember(data.members);
                    break;
                default:
                    break;
            }
        };
        conn.onerror = function (err) {
            console.log("Got error", err);
        };

        return conn;
    }


    this.test = function(){
        console.log("lasjdflkajsdfl;kajsdf");
    }

});

app.factory("guestHostFactory", function () {
    var guestInfo = {guestId: 1, firstName: "Bob", lastName: "Bobberson", email: "example@example.com", pin: 1}

    return {
        getGuestInfo: function () {
            return guestInfo;
        },
        setGuestInfo: function (val) {
            guestInfo = val;
        }
    }
});



