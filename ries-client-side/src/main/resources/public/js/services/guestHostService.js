/**
 * Created by craig on 7/20/2017.
 */
var app = angular.module("RIESApp");

app.service("guestHostService", function($http){

    this.numbCredentials = function(){
        return ["turn:numb.viagenie.ca:3478","craighatch90@gmail.com","pr0gs4d4yz"];
    };
    this.getWebsocketEndPoint = function(){
        // return "ws://ec2-13-58-97-184.us-east-2.compute.amazonaws.com:3001/socket"
        return 'ws://localhost:3001/socket';
    };
    this.getHostInfo = function(){
        return {
            firstName: "John",
            lastName: "Host",
            id: "1234"
        }
    };

    this.getGuestInfo = function(){
        return {
            firstName: "Jane",
            lastName: "Guest",
            id: "1234"
        }
    };


    this.setUpWebsocket = function(handleLogin,handleOffer,handleAnswer,handleCandidate,handleLeave,handleNewMember){
        var conn = new WebSocket(this.getWebsocketEndPoint());
            conn.onopen = function () {
                console.log("Connected to the signaling server");
            };
        //when we got a message from a signaling server
        conn.onmessage = function (msg) {

            var data = JSON.parse(msg.data);
            console.log("Got message", data);
            switch (data.type) {
                //initial login
                case "login":
                    handleLogin(data.success);
                    break;
                //when somebody wants to call us
                case "offer":
                    handleOffer(JSON.parse(data.offer), data.name);
                    break;
                case "answer":
                    handleAnswer(JSON.parse(data.answer));
                    break;
                //when a remote peer sends an ice candidate to us
                case "candidate":
                    handleCandidate(JSON.parse(data.candidate));
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