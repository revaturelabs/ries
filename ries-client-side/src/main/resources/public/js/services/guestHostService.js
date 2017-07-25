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

        return [req1, req2];
        // return requisitionService.getAllRequisitions();
    };






    this.getHostInfo = function () {
        return {
            firstName: "John",
            lastName: "Host",
            id: "1234"
        };
    };
    this.getGuestInfo = function () {
        return {
            firstName: "Jane",
            lastName: "Guest",
            id: "1234"
        }
    };
    this.getSessionInfo = function () {
        return {
            trainer: this.getHostInfo(),
            guest: this.getGuestInfo(),
            room: this.getGuestInfo().firstName + this.getGuestInfo().lastName +
            this.getHostInfo().firstName + this.getHostInfo().lastName
        }
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


});