
/**
 * Created by craig on 7/18/2017.
 */
/**
 * Created by Jhoan Osorno on 7/14/2017.
 */
var app = angular.module("RIESApp");

app.controller("observerCtrl", function ($scope, guestHostService) {



    $scope.myRequisistions = guestHostService.getAllRequisitions();

    $scope.isSelecting = true;
    $scope.guestName = "";
    $scope.selectSession = function(host,guest){
        $scope.myRoom = host + guest;
        $scope.guestName = guest;
        $scope.isSelecting = false;
    };
    $scope.backtoSelection = function(){
        $scope.isSelecting = true;
    };



    //----------------------------------------------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------
    var callBtn = document.querySelector('#callBtn');
    var usernameInput = document.querySelector('#usernameInput');
    var callPage = document.querySelector('#callPage');
    var hangUpBtn = document.querySelector('#hangUpBtn');
    var msgInput = document.querySelector('#msgInput');
    var sendMsgBtn = document.querySelector('#sendMsgBtn');
    var chatArea = document.querySelector('#chatarea');
    var currentMembers = document.querySelector('#currentlyInChat');
    var guestConn;
    var hostConn;
    var guestChannel;
    var hostChannel;
    var recordedVideo = document.querySelector('#recordedVideo');
    var modalEndSess = document.getElementById('myModal');
    var outsideModal = document.getElementsByClassName("close")[0];
    $scope.myIpV4 = "no response yet...";
    $scope.message = "";
    $scope.isTesting = true;
    $scope.isRecording = true;
    $scope.myRoom = guestHostService.getSessionInfo().room;
    $scope.myName = "Jim from Recruiting";

    //connecting to our signaling server
    var conn = guestHostService.setUpWebsocket(handleLogin,handleOffer,handleAnswer,handleCandidate,handleLeave,handleNewMember);



    window.addEventListener("beforeunload", function (event) {
        if (yourConn) {
            handleLeave();
        }

    });

    $scope.startSession = function () {
        console.log("starting session");
        send({
            type: "login",
            name: $scope.myName,
            room: $scope.myRoom
        });

    };

    //alias for sending JSON encoded messages
    function send(message) {
        message.role = "observer";

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

    //----------------------------------------------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------
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
            var lVideo = document.querySelector("#local");
            var rVideo = document.querySelector("#remote");
            guestConn = new rtcPeerConnection(configuration, {optional: [{RtpDataChannels: true}]});
            guestConn.ondatachannel = connectionOnDataChannel;
            guestConn.addStream(stream);
            guestConn.addEventListener("addstream", function (e) {
                console.log("received Stream from guest");
                lVideo.src = window.URL.createObjectURL(e.stream);
                lVideo.muted = false;
            });
            guestConn.onicecandidate = guestOnIceCandidate;

            guestChannel = guestConn.createDataChannel("channel1", {reliable: true});
            guestChannel.onerror = printError;
            guestChannel.onmessage = dataChannelMessage;
            guestChannel.onclose = dataChannelClose;
            guestChannel.onopen = dataChannelOpen;


            hostConn = new rtcPeerConnection(configuration, {optional: [{RtpDataChannels: true}]});
            hostConn.ondatachannel = connectionOnDataChannel;
            hostConn.addStream(stream);
            hostConn.addEventListener("addstream", function (e) {
                console.log("received Stream from host");
                rVideo.src = window.URL.createObjectURL(e.stream);
                rVideo.muted = true;
            });
            // Setup ice handling
            hostConn.onicecandidate = hostOnIceCandidate;

            hostChannel = hostConn.createDataChannel("channel1", {reliable: true});
            hostChannel.onerror = printError;
            hostChannel.onmessage = dataChannelMessage;
            hostChannel.onclose = dataChannelClose;
            hostChannel.onopen = dataChannelOpen;
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
    var guestOnIceCandidate = function (event) {
        console.log("ICE Candidate received: ", event);
        if (event.candidate) {
            send({
                type: "candidate",
                candidate: JSON.stringify(event.candidate),
                room: $scope.myRoom,
                sendTo : "guest"
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
                sendTo : "host"
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
        if (data.role == "host") {
            connectionHandleOffer(data, hostConn);
        } else if (data.role == "guest") {
            connectionHandleOffer(data, guestConn);
        }else{
            console.log("no role defined: Offer");
        }
    };

    function connectionHandleOffer(data, connection){
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
        if (data.role == "host") {
            hostConn.setRemoteDescription(new RTCSessionDescription(answer));
        } else if (data.role == "guest") {
            guestConn.setRemoteDescription(new RTCSessionDescription(answer));
        }else{
            console.log("no role defined: Answer");
        }
    };

//when we got an ice candidate from a remote user
    function handleCandidate(data) {
        var candidate = JSON.parse(data.candidate);
        console.log("candidate:  asdfasdfasdfasdfasdf",candidate);
        if (data.role == "host") {
            hostConn.addIceCandidate(new RTCIceCandidate(candidate));
        } else if (data.role == "guest") {
            guestConn.addIceCandidate(new RTCIceCandidate(candidate)).then(function(val){
                console.log("addIceCandidate promise? ", val);
            }).catch(function(err){
                console.log("addIceCandidate Error: ", err);
            });
        }else{
            console.log("no role defined: Candidate");
        }
    };


    function handleLeave() {
        if(hostConn){
            hostConn.close();
            hostConn.onicecandidate = null;
        }
        if(guestConn){
            guestConn.close();
            guestConn.onicecandidate = null;
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
            name: $scope.myName,
            room: $scope.myRoom
        };
        chatArea.innerHTML += val.name + ": " + val.message + "<br />";
        hostChannel.send(JSON.stringify(val));
        guestChannel.send(JSON.stringify(val));

        console.log("sent message", val);
        msgInput.value = "";
    });


    callBtn.addEventListener("click", function () {

        hostConn.createOffer(function (offer) {
            console.log("sending an offer with HOSTConn");
            send({
                type: "offer",
                offer: JSON.stringify(offer),
                room: $scope.myRoom,
                sendTo : "guest"
            });
            // console.log("offer", offer);
            hostConn.setLocalDescription(offer);
        }, function (error) {
            if (error) {
                alert("Error when creating an offer");
            }
        });

        guestConn.createOffer(function (offer) {
            console.log("sending an offer with guestConn");
            send({
                type: "offer",
                offer: JSON.stringify(offer),
                room: $scope.myRoom,
                sendTo : "guest"
            });
            // console.log("offer", offer);
            guestConn.setLocalDescription(offer);
        }, function (error) {
            if (error) {
                alert("Error when creating an offer");
            }
        });


    });


});


