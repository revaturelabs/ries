/**
 * Created by craig on 7/18/2017.
 */
/**
 * Created by Jhoan Osorno on 7/14/2017.
 */
var app = angular.module("RIESApp");

app.controller("guestCtrl", function ($scope, guestHostService) {
    var usernameInput = document.querySelector('#usernameInput');
    var callPage = document.querySelector('#callPage');
    var hangUpBtn = document.querySelector('#hangUpBtn');
    var msgInput = document.querySelector('#msgInput');
    var sendMsgBtn = document.querySelector('#sendMsgBtn');
    var chatArea = document.querySelector('#chatarea');
    var currentMembers = document.querySelector('#currentlyInChat');
    var yourConn;
    var dataChannel;
    callPage.style.display = "none";
    var recordedVideo = document.querySelector('#recordedVideo');
    var modalEndSess = document.getElementById('myModal');
    var outsideModal = document.getElementsByClassName("close")[0];
    $scope.myIpV4 = "no response yet...";
    $scope.message = "";
    var connectedUser;
    $scope.isTesting = true;
    $scope.isRecording = true;
    var myStream;

    var guestInfo = guestHostService.getGuestInfo();

    //connecting to our signaling server
    var conn = guestHostService.setUpWebsocket(handleLogin,handleOffer,handleAnswer,handleCandidate,handleLeave,handleNewMember);



    window.addEventListener("beforeunload", function (event) {
        if (yourConn) {
            handleLeave();
        }

    });

    var testEquipmentStream = {};
    var testChunk = [];

    function setUpGenericMediaRecorder(stream) {

        testEquipmentStream = new MediaRecorder(stream);
        testEquipmentStream.ondataavailable = function (e) {
            testChunk.push(e.data);
        }
        testEquipmentStream.onstop = function (e) {
            var blob = new Blob(testChunk, {'type': 'video/ogg; codecs=opus'});
            var testResult = document.querySelector("#testResult");
            testResult.src = window.URL.createObjectURL(blob);

            testChunk = [];
            return testEquipmentStream.blob;
        }
        return testEquipmentStream;
    }

    $scope.testEquipment = function () {
        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(function (stream) {
            myStream = stream;
            var testRecord = document.querySelector("#testRecord");
            testRecord.src = window.URL.createObjectURL(myStream);
            setUpGenericMediaRecorder(myStream);
            testEquipmentStream.start();
            $scope.isTesting = true;
            document.querySelector('#startTestEquipment').innerHTML = "Recording...";
        }).then(function(err){
            console.log(err);
        });
    };


    $scope.endTest = function () {
        testEquipmentStream.stop();
        $scope.isTesting = false;
        document.querySelector('#startTestEquipment').innerHTML = "Test Again?";
    };


    $scope.startSession = function () {
        console.log("starting session");
        document.querySelector('#callPage').style.display = 'block';
        document.querySelector('#equipmentTest').style.display = 'none';
        send({
            type: "login",
            name: guestInfo.firstName+guestInfo.lastName
        });

    };

    //alias for sending JSON encoded messages
    function send(message) {
        conn.send(JSON.stringify(message));
    };


    outsideModal.onclick = function () {
        $scope.turnOffModal();
    };
    window.onclick = function (event) {
        if (event.target == modalEndSess) {
            $scope.turnOffModal();
        }
    };
    $scope.turnOffModal = function(){
        modalEndSess.style.display = "none";
    }




    //hang up
    hangUpBtn.onclick = function () {
        modalEndSess.style.display = "block";
    };

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

    function handleLogin(success) {
        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(function (stream){
            myStream = stream;
            var lVideo = document.querySelector("#local");
            var rVideo = document.querySelector("#remote");
            lVideo.src = window.URL.createObjectURL(stream);

            setUpConnection(stream, lVideo, rVideo);
            setUpDataChannel();
        }).then(function (err){
            console.log("getUserMediaError", err);
        });
    };

    var setUpConnection = function (stream, lVideo, rVideo) {
        var configuration = {
            "iceServers": [
                {
                    'urls': ['stun:stun.services.mozilla.com', 'stun:stun2.1.google.com:19302']
                },
                {
                    urls: guestHostService.numbCredentials()[0],
                    username: guestHostService.numbCredentials()[1],
                    credential: guestHostService.numbCredentials()[2]
                }
            ]
        };

        var rtcPeerConnection = RTCPeerConnection || webkitRTCPeerConnection || mozRTCPeerConnection || msRTCPeerConnection;
        yourConn = new rtcPeerConnection(configuration, {optional: [{RtpDataChannels: true}]});
        yourConn.ondatachannel = function (e) {
            receiveChannel = e.channel;
            console.log(e.channel);
            receiveChannel.onmessage = function (e) {
                var obj = JSON.parse(e.data);
                chatArea.innerHTML += obj.name + ": " + obj.message + "<br />";
            };
        };
        yourConn.addStream(stream);
        yourConn.addEventListener("addstream", function (e) {
            console.log("adding streams", e);
            rVideo.src = window.URL.createObjectURL(stream);
            rVideo.muted = true;
            lVideo.src = window.URL.createObjectURL(e.stream);
            lVideo.muted = false;
        });
        // Setup ice handling
        yourConn.onicecandidate = function (event) {
            if (event.candidate) {
                send({
                    type: "candidate",
                    candidate: JSON.stringify(event.candidate)
                });
            }
        };
    };
    var setUpDataChannel = function () {
        dataChannel = yourConn.createDataChannel("channel1", {reliable: true});

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
                answer: JSON.stringify(answer)
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
        console.log("candidate", candidate);
        yourConn.addIceCandidate(new RTCIceCandidate(candidate));
    };


    function handleLeave() {
        connectedUser = null;
        yourConn.close();
        yourConn.onicecandidate = null;
    };


    function handleNewMember(val) {
        currentMembers.innerHTML = "Currently in chat..."
        console.log("handlenemember", val);
        val.forEach(function (element) {
            currentMembers.innerHTML += "<br />" + element + "<br />";
        }, this);

    };


//when user clicks the "send message" button
    sendMsgBtn.addEventListener("click", function (event) {
        // var val = msgInput.value;
        var val = {
            type: "chatMessage",
            message: msgInput.value,
            name: guestInfo.firstName+guestInfo.lastName
        };
        chatArea.innerHTML += val.name + ": " + val.message + "<br />";
        console.log("dataChannel: ", dataChannel);
        //sending a message to a connected peer
        dataChannel.send(JSON.stringify(val));
        console.log("sent message", val);
        msgInput.value = "";
    });


});

