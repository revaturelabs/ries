/**
 * Created by craig on 7/18/2017.
 */
/**
 * Created by Jhoan Osorno on 7/14/2017.
 */
var app = angular.module("RIESApp");

app.controller("guestCtrl", function ($scope, guestHostService) {


    $scope.craigSignIn = function () {
        document.querySelector('#loginModal').style.display = "none";
        $scope.myRoom = "Emily Higgins" + "Craig Hatch";
    };
    $scope.jhoanSignIn = function () {
        document.querySelector('#loginModal').style.display = "none";
        $scope.myRoom = "August Duet" + "Jhaon Osorno";
    };


    var usernameInput = document.querySelector('#usernameInput');
    var callPage = document.querySelector('#callPage');
    var hangUpBtn = document.querySelector('#hangUpBtn');
    var msgInput = document.querySelector('#msgInput');
    var sendMsgBtn = document.querySelector('#sendMsgBtn');
    var chatArea = document.querySelector('#chatarea');
    var currentMembers = document.querySelector('#currentlyInChat');
    var connections = [];
    var allDataChannels = [];
    var obsConn;
    var hostConn;
    var obsChannel;
    var hostChannel;
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
    //$scope.myRoom = guestHostService.getSessionInfo().room;


    var guestInfo = guestHostService.getGuestInfo();

    //connecting to our signaling server
    var conn = guestHostService.setUpWebsocket(handleLogin, handleOffer, handleAnswer, handleCandidate, handleLeave, handleNewMember);


    window.addEventListener("beforeunload", function (event) {
        handleLeave();
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
        }).then(function (err) {
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
            name: guestInfo.firstName + guestInfo.lastName,
            room: $scope.myRoom
        });

    };

    //alias for sending JSON encoded messages
    function send(message) {
        message.role = "guest";
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
    $scope.turnOffModal = function () {
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

    //------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------
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

    function handleLogin(success) {
        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(function (stream) {
            myStream = stream;
            var lVideo = document.querySelector("#local");
            var rVideo = document.querySelector("#remote");
            lVideo.src = window.URL.createObjectURL(stream);

            hostConn = new rtcPeerConnection(configuration, {optional: [{RtpDataChannels: true}]});
            hostConn.ondatachannel = connectionOnDataChannel;
            hostConn.addStream(stream);
            hostConn.addEventListener("addstream", function (e) {
                console.log("adding streams", e);
                rVideo.src = window.URL.createObjectURL(stream);
                rVideo.muted = true;
                lVideo.src = window.URL.createObjectURL(e.stream);
                lVideo.muted = false;
            });
            // Setup ice handling
            hostConn.onicecandidate = hostOnIceCandidate;

            hostChannel = hostConn.createDataChannel("channel1", {reliable: true});
            hostChannel.onopen = dataChannelOpen;
            hostChannel.onerror = printError;
            hostChannel.onmessage = dataChannelMessage;
            hostChannel.onclose = dataChannelClose;


            obsConn = new rtcPeerConnection(configuration, {optional: [{RtpDataChannels: true}]});
            obsConn.ondatachannel = connectionOnDataChannel;
            obsConn.addStream(stream);
            obsConn.addEventListener("addstream", function (e) {
                console.log("adding streams, this one shouldnt happen", e);
            });
            // Setup ice handling
            obsConn.onicecandidate = obsOnIceCandidate;

            obsChannel = obsConn.createDataChannel("channel1", {reliable: true});
            obsChannel.onopen = dataChannelOpen;
            obsChannel.onerror = printError;
            obsChannel.onmessage = dataChannelMessage;
            obsChannel.onclose = dataChannelClose;

        }).then(function (err) {
            if(err){
                console.log("getUserMediaError", err);
            }
        });
    };


    var connectionOnDataChannel = function (e) {
        receiveChannel = e.channel;
        console.log("new channel received: ", e.channel);
        receiveChannel.onmessage = function (e) {
            var obj = JSON.parse(e.data);
            chatArea.innerHTML += obj.name + ": " + obj.message + "<br />";
        };
    };
    var obsOnIceCandidate = function (event) {
        console.log("ICE Candidate received: ", event);
        if (event.candidate) {
            send({
                type: "candidate",
                candidate: JSON.stringify(event.candidate),
                room: $scope.myRoom,
                sendTo: "observer"
            });
        }
    };
    var hostOnIceCandidate = function (event) {
        console.log("ICE Candidate received: ", event);
        if (event.candidate) {
            send({
                type: "candidate",
                candidate: JSON.stringify(event.candidate),
                room: $scope.myRoom,
                sendTo: "host"

            });
        }
    };

    var printError = function (error) {
        console.log("Ooops...error:", error);
    };
    var dataChannelMessage = function (event) {
        chatArea.innerHTML += "tmp: " + event.data + "<br />";
    };
    var dataChannelClose = function () {
        console.log("data channel is closed");
    };
    var dataChannelOpen = function (a) {
        console.log("data channel is open" + a);
    };

//when somebody sends us an offer
    function handleOffer(data) {
        if (data.role == "observer") {
            connectionHandleOffer(data, obsConn);
        } else if (data.role == "host") {
            connectionHandleOffer(data, hostConn);
        } else {
            console.log("no role defined: Offer");
        }

    };

    function connectionHandleOffer(data, connection) {
        var offer = JSON.parse(data.offer);
        connection.setRemoteDescription(new RTCSessionDescription(offer));
        connection.createAnswer(function (answer) {
            connection.setLocalDescription(answer);
            send({
                type: "answer",
                answer: JSON.stringify(answer),
                room: $scope.myRoom,
                sendTo : data.role
            });
        }, function (error) {
            alert("Error when creating an answer");
        });
    }


//when we got an answer from a remote user
    function handleAnswer(data) {
        var answer = JSON.parse(data.answer);
        if (data.role == "observer") {
            obsConn.setRemoteDescription(new RTCSessionDescription(answer));
        } else if (data.role == "host") {
            hostConn.setRemoteDescription(new RTCSessionDescription(answer));
        } else {
            console.log("no role defined: Answer");
        }
    };

//when we got an ice candidate from a remote user
    function handleCandidate(data) {
        var candidate = JSON.parse(data.candidate);
        if (data.role == "observer") {
            obsConn.addIceCandidate(new RTCIceCandidate(candidate));
        } else if (data.role == "host") {
            hostConn.addIceCandidate(new RTCIceCandidate(candidate)).then(function(val){
                console.log("addIceCandidate promise? ", val);
            }).catch(function(err){
                console.log("addIceCandidate Error: ", err);
            });
        } else {
            console.log("no role defined: Candidate");
        }
    };


    function handleLeave() {
        if(obsConn){
            obsConn.close();
            obsConn.onicecandidate = null;
        }
        if(hostConn){
            hostConn.close();
            hostConn.onicecandidate = null;
        }
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
            name: guestInfo.firstName + guestInfo.lastName,
            room: $scope.myRoom
        };
        chatArea.innerHTML += val.name + ": " + val.message + "<br />";

        //sending a message to a connected peer
        //obsChannel.send(JSON.stringify(val));
        hostChannel.send(JSON.stringify(val));
        console.log("sent message", val);
        msgInput.value = "";
    });


});

