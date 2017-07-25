/**
 * Created by Jhoan Osorno on 7/14/2017.
 */
var app = angular.module("RIESApp");

app.controller("hostCtrl", function ($scope, $http, $state, signalingService, guestHostService) {
    //____________________________________________________________________________________________________
    //____________________________________________________________________________________________________
    // ___________________________________________________________________________________________________
    //Session selection, handle flow from selecting the room to enter
    $scope.myRequisistions = guestHostService.getAllRequisitions();

    $scope.isSelecting = true;
    $scope.guestName = "guest";
    $scope.hostName = "host";
    $scope.selectSession = function(host,guest){
        $scope.myRoom = host + guest;
        $scope.guestName = guest;
        $scope.hostName = host;
        $scope.isSelecting = false;
        console.log("host: ", host, "guest: ", guest, "room: ", $scope.myRoom);
    };
    $scope.backtoSelection = function(){
        handleLeave();
        $state.reload();
    };


    //____________________________________________________________________________________________________
    //____________________________________________________________________________________________________
    // ___________________________________________________________________________________________________
    // Session handling: handle communication between peers and with server (WebSocketHandler java class)


    var guestConn;
    var obsConn;
    var guestChannel;
    var obsChannel;

    var usernameInput = document.querySelector('#usernameInput');
    var callPage = document.querySelector('#callPage');

    var hangUpBtn = document.querySelector('#hangUpBtn');
    var msgInput = document.querySelector('#msgInput');
    var sendMsgBtn = document.querySelector('#sendMsgBtn');
    var recordBtn = document.querySelector('#recordBtn');
    var endRecordBtn = document.querySelector('#endRecordBtn');
    var chatArea = document.querySelector('#chatarea');
    var currentMembers = document.querySelector('#currentlyInChat');
    var recordedVideo = document.querySelector('#recordedVideo');
    var modalEndSess = document.getElementById('myModal');
    var outsideModal = document.getElementsByClassName("close")[0];
    $scope.myIpV4 = "no response yet...";
    $scope.feedback = "";
    $scope.isTesting = true;
    $scope.doneRecording = false;
    $scope.inSession = false;
    $scope.isRecordingSession = false;

    //connecting to our signaling server
    if(conn){
    }else{
        var conn = guestHostService.setUpWebsocket(handleLogin, handleOffer, handleAnswer, handleCandidate, handleLeave, handleNewMember);
    }

    window.addEventListener("beforeunload", function (event) {
        handleLeave();
    });

    //alias for sending JSON encoded messages
    function send(message) {
        message.role = "host";
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
    };

    //hang up
    hangUpBtn.onclick = function () {
        modalEndSess.style.display = "block";
    };
    var endSessionBtn = document.getElementById("endSessionBtn");
    endSessionBtn.addEventListener("click", function () {
        console.log("trying to end session...");
        // send({
        //     type: "leave",
        //     room: $scope.myRoom
        // });

        handleLeave();
        modalEndSess.style.display = "none";
    });
    // $scope.isRecording = true;
    recordBtn.addEventListener("click", function (event) {
        recordBtn.style.display = 'none';
        endRecordBtn.style.display = 'block';
        startRecording();
        // $scope.isRecording = !$scope.isRecording;

    });
    endRecordBtn.addEventListener("click", function (event) {
        stopRecording();
        // $scope.isRecording = !$scope.isRecording;
        recordBtn.innerHTML = "<i class='fa fa-microphone' aria-hidden='true'></i> Record";
        $scope.doneRecording = true;
    });

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
    var myStream;

    function handleLogin(success) {
        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(function (stream) {
            myStream = stream;
            setUpMediaRecorderHost(stream);
            var lVideo = document.querySelector("#local");
            var rVideo = document.querySelector("#remote");
            lVideo.src = window.URL.createObjectURL(stream);

            var rtcPeerConnection = RTCPeerConnection || webkitRTCPeerConnection || mozRTCPeerConnection || msRTCPeerConnection;
            guestConn = new rtcPeerConnection(configuration, {optional: [{RtpDataChannels: true}]});
            guestConn.ondatachannel = connectionOnDataChannel;
            guestConn.addStream(stream);
            guestConn.addEventListener("addstream", function (e) {
                console.log("adding streams", e);
                rVideo.src = window.URL.createObjectURL(stream);
                rVideo.muted = true;
                lVideo.src = window.URL.createObjectURL(e.stream);
                lVideo.muted = false;
                setUpMediaRecorder(e.stream, myStream);
            });
            // Setup ice handling
            guestConn.onicecandidate = guestOnIceCandidate;

            guestChannel = guestConn.createDataChannel("channel1", {reliable: true});
            guestChannel.onopen = dataChannelOpen;
            guestChannel.onerror = printError;
            guestChannel.onmessage = dataChannelMessage;
            guestChannel.onclose = dataChannelClose;


            obsConn = new rtcPeerConnection(configuration, {optional: [{RtpDataChannels: true}]});
            obsConn.ondatachannel = connectionOnDataChannel;
            obsConn.addStream(stream);
            obsConn.addEventListener("addstream", function (e) {
                console.log("adding streams, this one shouldnt happen", e);
            });
            // Setup ice handling
            obsConn.onicecandidate = obsOnIceCandidate;

            obsChannel = obsConn.createDataChannel("channel2", {reliable: true});
            obsChannel.onerror = printError;
            obsChannel.onmessage = dataChannelMessage;
            obsChannel.onclose = dataChannelClose;
            obsChannel.onopen = dataChannelOpen;

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

    var obsOnIceCandidate = function (event) {
        console.log("ICE Candidate received: ", event);
        if (event.candidate) {
            send({
                type: "candidate",
                candidate: JSON.stringify(event.candidate),
                room: $scope.myRoom,
                sendTo : "observer"
            });
        }
    };

    var printError = function (error) {
        console.log("Ooops...error:", error);
    };
    var dataChannelMessage = function (event) {
        console.log("dataChannelMessage: ", event);
        console.log("dataChannelMessage data: ", event.data);
        chatArea.innerHTML += "tmp: " + event.data + "<br />";
    };
    var dataChannelClose = function () {
        console.log("data channel is closed");
    };
    var dataChannelOpen = function () {
        console.log("data channel is open");
    };


    $scope.callGuest = function () {
        guestConn.createOffer(function (offer) {
            console.log("sending an offer with guestConn");
            send({
                type: "offer",
                offer: JSON.stringify(offer),
                room: $scope.myRoom,
                sendTo : "guest"
            });
            console.log("offer", offer);
            guestConn.setLocalDescription(offer);
            document.getElementById('recordBtn').style.display = "block";
            document.getElementById('callGuestBtn').style.display = "none";
            $scope.inSession = true;
        }, function (error) {
            if (error) {
                alert("Error when creating an offer");
            }
        });

    };

//when somebody sends us an offer
    function handleOffer(data) {
        if (data.role == "observer") {
            connectionHandleOffer(data, obsConn);
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
        if (data.role == "observer") {
            obsConn.setRemoteDescription(new RTCSessionDescription(answer));
        } else if (data.role == "guest") {
            guestConn.setRemoteDescription(new RTCSessionDescription(answer));
        }else{
            console.log("no role defined: Answer");
        }
    }

//when we got an ice candidate from a remote user
    function handleCandidate(data) {
        var candidate = JSON.parse(data.candidate);
        if (data.role == "observer") {
            obsConn.addIceCandidate(new RTCIceCandidate(candidate));

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
        if(obsConn){
            obsConn.close();
            obsChannel.close();
            obsConn = null;

        }
        if(guestConn){
            guestConn.close();
            guestChannel.close();
            guestConn = null;
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
            name: $scope.hostName,
            room: $scope.myRoom
        };
        chatArea.innerHTML += val.name + ": " + val.message + "<br />";
        // obsChannel.send(JSON.stringify(val));
        guestChannel.send(JSON.stringify(val));

        console.log("sent message", val);
        msgInput.value = "";
    });




    //____________________________________________________________________________________________________
    //____________________________________________________________________________________________________
    // ___________________________________________________________________________________________________
    //Recordings: handle equipment testing, guest and host recordings during session

    var testEquipmentStream = {};
    var testChunk = [];

    function setUpGenericMediaRecorder(stream) {

        testEquipmentStream = new MediaRecorder(stream);
        testEquipmentStream.ondataavailable = function (e) {
            console.log("data ready");
            testChunk.push(e.data);
        }
        testEquipmentStream.onstop = function (e) {
            console.log("stopping...");
            console.log("asdf", testEquipmentStream);
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
        var testBlob = testEquipmentStream.stop();
        $scope.isTesting = false;
        document.querySelector('#startTestEquipment').innerHTML = "Test Again?";
    };
    $scope.startSession = function () {
        document.querySelector('#callPage').style.display = 'block';
        document.querySelector('#equipmentTest').style.display = 'none';
        send({
            type: "login",
            name: $scope.hostName,
            room: $scope.myRoom
        });
    };


    var chunks = [];
    var mediaRecorder;
    $scope.blobGuest;

    function setUpMediaRecorder(streamGuest, streamHost) {
        console.log("streamHost");
        console.log(streamHost);
        console.log(streamHost.getTracks());
        // mediaRecorder = new MediaRecorder([streamGuest, streamHost.getTracks()[0]]);
        mediaRecorder = new MediaRecorder(streamGuest);
        // mediaRecorder = new MediaRecorder([streamGuest.getTracks()[0],streamGuest.getTracks()[1],streamHost.getTracks()[0]]);


        // mediaRecorder = new MediaRecorder(streamGuest);
        mediaRecorder.ondataavailable = function (e) {
            console.log("data is available");
            chunks.push(e.data);
        }
        mediaRecorder.onstop = function (e) {
            console.log("recorder stopped");
            console.log(mediaRecorder.state);
            $scope.blobGuest = new Blob(chunks, {'type': 'video/ogg; codecs=opus'});
            recordedVideo.src = window.URL.createObjectURL($scope.blobGuest);
            // var tmp = record(new MediaStream([$scope.blobGuest, blobHost]),10000);

            // recordedVideo.src = window.URL.createObjectURL(tmp);
            chunks = [];

        }
    }


    var chunkHost = [];
    var mediaRecorderHost;
    $scope.blobHost;
    function setUpMediaRecorderHost(stream) {
        mediaRecorderHost = new MediaRecorder(stream);
        mediaRecorderHost.ondataavailable = function (e) {
            console.log("data is available");
            chunkHost.push(e.data);
            chunks.push(e.data);
        }
        mediaRecorderHost.onstop = function (e) {

            $scope.blobHost = new Blob(chunkHost, {'type': 'video/ogg; codecs=opus'});
            // recordedVideo.src = window.URL.createObjectURL(blob);
            chunkHost = [];
            $scope.feedback = "Video Recorded. Press save button to store recording."

        }
    }

    var startRecording = function () {
        mediaRecorder.start();
        mediaRecorderHost.start();

    }
    var stopRecording = function () {
        mediaRecorderHost.stop();

        setTimeout(function () {
            mediaRecorder.stop();

        }, 5000);

    };

    //____________________________________________________________________________________________________
    //____________________________________________________________________________________________________
    // ___________________________________________________________________________________________________
    //Logic for saving session to the bucket

    $scope.saveRecording = function () {

        $scope.download();

         signalingService.saveRecording($scope.Recording)
             .then(function(response) {
                 $scope.feedback = response.data;
             }, function(error) {
                 $scope.feedback= error.data;
                 console.log(error);
             });
    };

    //download recording file function
    $scope.download = function () {
        var a = document.getElementById("a");
        var name = $scope.Recording.name + ".mp4";
        a.href = URL.createObjectURL($scope.blobHost);
        $scope.videoLink = a.href;
        a.download = name;
//        console.log(a);
//        a.click();

    };


});

