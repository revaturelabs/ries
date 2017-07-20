var app = angular.module("RIESApp");

app.controller("guestCtrl", function($scope, $state){
    console.log("welcome to the signalingCtrl");
    var name;
    var connectedUser;

    $scope.hideVideoArea = true;

    var videoAccess = document.querySelector('videoAccess');
    $scope.accepted = function(){
        $scope.hideVideoArea = !$scope.hideVideoArea;
    }

    $scope.backToLogin = function(){
        $state.go('home');
    }



    //connecting to our signaling server
    var conn = new WebSocket('ws://192.168.61.75:7000');
    // var conn = new WebSocket('ws://localhost:9090');

    conn.onopen = function () {
        console.log("Connected to the signaling server");
    };

    //when we got a message from a signaling server
    conn.onmessage = function (msg) {
        console.log("Got message", msg.data);
        var data = JSON.parse(msg.data);

        switch (data.type) {
            case "login":
                handleLogin(data.success);
                break;
            //when somebody wants to call us
            case "offer":
                handleOffer(data.offer, data.name);
                break;
            case "answer":
                handleAnswer(data.answer);
                break;
            //when a remote peer sends an ice candidate to us
            case "candidate":
                handleCandidate(data.candidate);
                break;
            case "leave":
                handleLeave();
                break;
            case "newMember":
                handleNewMember(data.name);
                break;
            default:
                break;
        }
    };

    conn.onerror = function (err) {
        console.log("Got error", err);
    };

    //alias for sending JSON encoded messages
    function send(message) {

        //attach the other peer username to our messages
        if (connectedUser) {
            message.name = connectedUser;
        }

        conn.send(JSON.stringify(message));
    };

    //******
    //UI selectors block
    //******
//login var should be removed when login div in guesthtml is removed
    var loginPage = document.querySelector('#loginPage');
    var usernameInput = document.querySelector('#usernameInput');
    var loginBtn = document.querySelector('#loginBtn');


    var msgInput = document.querySelector('#msgInput');
    var sendMsgBtn = document.querySelector('#sendMsgBtn');
    

    var chatArea = document.querySelector('#chatarea');
    var currentMembers = document.querySelector('#currentlyInChat');
    var yourConn;
    var dataChannel;
    callPage.style.display = "none";



    ////Check ending session code and DOM handling--------------------------------------
    var modalEndSess = document.getElementById('myModal');
    var modalBtn = document.getElementById("modalBtn");
    var outsideModal = document.getElementsByClassName("close")[0];


    modalBtn.onclick = function () {
        modalEndSess.style.display = "block";
    }
    outsideModal.onclick = function () {
        modalEndSess.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modalEndSess) {
            modalEndSess.style.display = "none";
        }
    }

    //hang up
    // hangUpBtn.onclick = function () {
    //     modalEndSess.style.display = "block";
    // }

    var endSessionBtn = document.getElementById("endSessionBtn");
    endSessionBtn.addEventListener("click", function () {
        console.log("trying to end session...");
        send({
            type: "leave"
        });

        handleLeave();
        modalEndSess.style.display = "none";
    });

    //-----------------------------------------------------



    // Login when the user clicks the button; remove with login div in guesthtml
    loginBtn.addEventListener("click", function (event) {
        console.log("trying login");
        name = usernameInput.value;

        if (name.length > 0) {
            send({
                type: "login",
                name: name
            });
        }

    });

//to phaseout login ; setTimeout(function(){
//     send({type: "login", name: "steverson"})
// },0)
    function handleLogin(success) {

        if (success === false) {
            alert("Ooops...try a different username");
        } else {

            if (hasUserMedia()) {

                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
                    || navigator.mozGetUserMedia || navigator.msGetUserMedia;
                //get audio and video streams
                navigator.getUserMedia({ video: true, audio: true }, function (stream) {

                    
                   // setUpMediaRecorder(stream);

                    myStream = stream;
                    var lVideo = document.querySelector("#local");
                    // console.log("lvideo", lVideo);
                    var rVideo = document.querySelector("#remote");
                    lVideo.src = window.URL.createObjectURL(stream);
                    loginPage.style.display = "none";
                    callPage.style.display = "block";

                    //**********************
                    //Starting a peer connection
                    //**********************

                    //using Google public stun server
                    var configuration = {
                        "iceServers": [{ 'urls': 'stun:stun.services.mozilla.com' }, { "urls": "stun:stun2.1.google.com:19302" }]
                    };
                    var rtcPeerConnection = RTCPeerConnection || webkitRTCPeerConnection || mozRTCPeerConnection || msRTCPeerConnection;
                    // yourConn = new webkitRTCPeerConnection(configuration, {optional: [{RtpDataChannels: true}]});
                    yourConn = new rtcPeerConnection(configuration, { optional: [{ RtpDataChannels: true }] });


                    yourConn.ondatachannel = function (e) {
                        receiveChannel = e.channel;
                        console.log(e.channel);
                        receiveChannel.onmessage = function (e) {
                            console.log("ondatachannelmessage:", e);
                            console.log(JSON.parse(e.data));
                            var obj = JSON.parse(e.data);
                            chatArea.innerHTML += obj.name + ": " + obj.msg + "<br />";
                        }
                    }

                    yourConn.addStream(stream);
                    yourConn.addEventListener("addstream", function (e) {
                        rVideo.src = window.URL.createObjectURL(e.stream);
                        setUpMediaRecorder(e.stream);
                    });




                    // Setup ice handling
                    yourConn.onicecandidate = function (event) {
                        if (event.candidate) {
                            send({
                                type: "candidate",
                                candidate: event.candidate
                            });
                        }
                    };

                    //creating data channel
                    dataChannel = yourConn.createDataChannel("channel1", { reliable: true });

                    dataChannel.onerror = function (error) {
                        console.log("Ooops...error:", error);
                    };

                    //when we receive a message from the other peer, display it on the screen
                    dataChannel.onmessage = function (event) {
                        chatArea.innerHTML += connectedUser + ": " + event.data + "<br />";
                    };

                    dataChannel.onclose = function () {
                        console.log("data channel is closed");
                    };

                }, function (err) { console.log("getUserMediaError", err); });
            }



        }
    };


    //when somebody sends us an offer
    function handleOffer(offer, name) {
        connectedUser = name;
        yourConn.setRemoteDescription(new RTCSessionDescription(offer));

        //create an answer to an offer
        yourConn.createAnswer(function (answer) {
            yourConn.setLocalDescription(answer);
            send({
                type: "answer",
                answer: answer
            });
        }, function (error) {
            alert("Error when creating an answer");
        });

    };

    //when we got an answer from a remote user
    function handleAnswer(answer) {
        yourConn.setRemoteDescription(new RTCSessionDescription(answer));
    };

    //when we got an ice candidate from a remote user
    function handleCandidate(candidate) {
        yourConn.addIceCandidate(new RTCIceCandidate(candidate));
    };



    function handleLeave() {
        connectedUser = null;
        yourConn.close();
        yourConn.onicecandidate = null;
    };


    function handleNewMember(val) {

        console.log("handlenemember", val);
        currentMembers.innerHTML += val + "<br />";

    };


    //when user clicks the "send message" button
    sendMsgBtn.addEventListener("click", function (event) {
        // var val = msgInput.value;
        var val = {
            msg: msgInput.value,
            name: name
        };


        chatArea.innerHTML += name + ": " + val.msg + "<br />";
        console.log("dataChannel: ", dataChannel);
        //sending a message to a connected peer
        dataChannel.send(JSON.stringify(val));
        console.log("sent message", val);
        msgInput.value = "";
    });

    var hasUserMedia = function () {
        //check for WebRTC support
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
            || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        return !!navigator.getUserMedia;
    }    
    
});