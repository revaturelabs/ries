/**
 * Created by Jhoan Osorno on 7/14/2017.
 */
var app = angular.module("RIESApp");

app.controller("hostCtrl", function ($scope, $http, $state, signalingService, guestHostService,requisitionService) {
    //there are four sections to this file: 1. selecting the interview; 2. managing the session; 3. managing all
    // recordings (including initial test recordings); 4. saving the recording to the S3 bucket.
    // After selecting a room to join, the host tests equipment and joins session.  The host can then call the guest
    //after the guest has entered the room to initiate the session.  THe session can then be recorded and
    // uploaded to the Amazon S3 bucket.
    //This code implements WebRTC to establish direct peer to peer communication.  The Java Websocket facilitates the
    //initial set up of the room, but chat, video, and audio are then directly sent between peers using the
    //WebRTC technology.  At the time of writing, Chrome supports WebRTC only over https, so Firefox must be used





    //close connections if we leave the page
    window.addEventListener("beforeunload", function (event) {
        handleLeave();
    });


    //____________________________________________________________________________________________________
    //____________________________________________________________________________________________________
    // ___________________________________________________________________________________________________
    //SECTION 1: selecting the interview
    //there is currently only one websocket in use.  Different rooms are merely the first and last name of the
    //host and gust combined. This dictates who we can send messages to (in particular offers and candidate messages)

    //getting requisitions
    $scope.myRequisistions = guestHostService.getAllRequisitions();
    console.log("$scope.myRequisistions",$scope.myRequisistions);
    requisitionService.getAllRequisitions().then(function(res) {
        // $scope.myRequisistions  = res;
        //
        // for(var i = 0; i < $scope.requisitions.length; i++){
        //     var trainerId = $scope.requisitions[i].reqHost;
        //     var requisitionId = $scope.requisitions[i].reqRecruiter;
        //     $scope.requisitions[i].reqHost = globalVarService.getTrainerById(trainerId);
        //     $scope.requisitions[i].reqRecruiter = globalVarService.getRecruiterById(requisitionId);
        //     $scope.requisitionList = $scope.requisitions;
        // }

        console.log("all current reqs", res);

    });

    $scope.isSelecting = true;
    $scope.guestName = "guest";
    $scope.hostName = "host";

    //set up name and room for the session
    $scope.selectSession = function (host, guest) {
        $scope.myRoom = host + guest;
        $scope.guestName = guest;
        $scope.hostName = host;
        $scope.isSelecting = false;
        console.log("host: ", host, "guest: ", guest, "room: ", $scope.myRoom);
    };

    //if host returns to complete a different interview, we reload the page and remove host from the room
    $scope.backtoSelection = function () {
        handleLeave();
        send({
            type: "back"
        });
        $state.reload();
    };



    //____________________________________________________________________________________________________
    //____________________________________________________________________________________________________
    // ___________________________________________________________________________________________________
    // Session handling: handle communication between peers and with server (WebSocketHandler java class)

    var myStream;
    var guestConn;
    var obsConn;
    var guestChannel;
    var obsChannel;
    var usernameInput = document.querySelector('#usernameInput');
    var callPage = document.querySelector('#callPage');
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
    if (conn) {
    } else {
        var conn = guestHostService.setUpWebsocket(handleLogin, handleOffer, handleAnswer, handleCandidate, handleLeave, handleNewMember);
    }



    //send messages to the server through the websocket.  we tag all messages with "host" to know who the message
    //is from.
    //Each incoming message will similarly have either "observer" or "guest" such that we know who the message
    //is from
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
    $scope.endSession = function(){
        console.log("trying to end session...");
        handleLeave();
        modalEndSess.style.display = "none";
    };


    $scope.hangUp = function () {
        modalEndSess.style.display = "block";
        handleLeave();
    };





    var numbCredentials = guestHostService.numbCredentials();
    var configuration;
    if(numbCredentials){
        configuration = {
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
    }else{
        alert("a STUN/TURN server needs to be added to ensure connection to more users. A numb server was used previously, see http://numb.viagenie.ca/ for " +
            "documentation")
    }



    function handleLogin() {
        //Access the host audio and visual
        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(function (stream) {
            myStream = stream;
            setUpMediaRecorderHost(stream);
            var lVideo = document.querySelector("#local");
            var rVideo = document.querySelector("#remote");
            lVideo.src = window.URL.createObjectURL(stream);

            var rtcPeerConnection = RTCPeerConnection || webkitRTCPeerConnection || mozRTCPeerConnection || msRTCPeerConnection;


            //establish a connection for the guest, and send out stream to the guestchannel
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
            guestConn.onicecandidate = guestOnIceCandidate;
            guestChannel = guestConn.createDataChannel("channel1", {reliable: true});
            guestChannel.onopen = dataChannelOpen;
            guestChannel.onerror = printError;
            guestChannel.onmessage = dataChannelMessage;
            guestChannel.onclose = dataChannelClose;

            //establish a connection for the observer, and send out stream to the obschannel
            obsConn = new rtcPeerConnection(configuration, {optional: [{RtpDataChannels: true}]});
            obsConn.ondatachannel = connectionOnDataChannel;
            obsConn.addStream(stream);
            obsConn.addEventListener("addstream", function (e) {
                //the obs must send us his stream to receive ours, but we will not do anything with it.
            });
            obsConn.onicecandidate = obsOnIceCandidate;
            obsChannel = obsConn.createDataChannel("channel2", {reliable: true});
            obsChannel.onerror = printError;
            obsChannel.onmessage = dataChannelMessage;
            obsChannel.onclose = dataChannelClose;
            obsChannel.onopen = dataChannelOpen;

        }).then(function (err) {
            if (err) {
                console.log("getUserMediaError", err);
            }
        });
    };

    //when we receive a chat message, update the chatArea with the name and message
    var connectionOnDataChannel = function (e) {
        receiveChannel = e.channel;
        console.log("new channel received: ", e.channel);
        receiveChannel.onmessage = function (e) {
            var obj = JSON.parse(e.data);
            chatArea.innerHTML += obj.name + ": " + obj.message + "<br />";
        };
    };

    //when we receive an IceCandidate, send our candidate
    var guestOnIceCandidate = function (event) {
        if (event.candidate) {
            send({
                type: "candidate",
                candidate: JSON.stringify(event.candidate),
                room: $scope.myRoom,
                sendTo: "guest"
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
                sendTo: "observer"
            });
        }
    };


    var printError = function (error) {
        console.log("Ooops...error:", error);
    };

    //not sure we even need this part
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

    //open a connection with the guest by sending an offer.
    //The guest must be in the session before the offer is made.
    //then hide the call button and show the record button
    $scope.callGuest = function () {
        guestConn.createOffer(function (offer) {
            send({
                type: "offer",
                offer: JSON.stringify(offer),
                room: $scope.myRoom,
                sendTo: "guest"
            });
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

    //In general, we should only expect to receive an offer from the observer, as the guest never makes an offer,
    //but logic to handle an offer from either is supported
    function handleOffer(data) {
        if (data.role == "observer") {
            connectionHandleOffer(data, obsConn);
        } else if (data.role == "guest") {
            connectionHandleOffer(data, guestConn);
        } else {
            console.log("no role defined: Offer");
        }
    };

    //when an offer comes in we send an answer using the correct connection.
    function connectionHandleOffer(data, connection) {
        var offer = JSON.parse(data.offer);
        connection.setRemoteDescription(new RTCSessionDescription(offer));
        connection.createAnswer(function (answer) {
            connection.setLocalDescription(answer);
            send({
                type: "answer",
                answer: JSON.stringify(answer),
                room: $scope.myRoom,
                sendTo: data.role
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
        } else {
            console.log("no role defined: Answer");
        }
    }

    //when we got an ice candidate from a remote user
    function handleCandidate(data) {
        var candidate = JSON.parse(data.candidate);
        if (data.role == "observer") {
            obsConn.addIceCandidate(new RTCIceCandidate(candidate));

        } else if (data.role == "guest") {
            guestConn.addIceCandidate(new RTCIceCandidate(candidate)).then(function (val) {
                console.log("addIceCandidate promise? ", val);
            }).catch(function (err) {
                console.log("addIceCandidate Error: ", err);
            });
        } else {
            console.log("no role defined: Candidate");
        }

    };

    //update the members in the chat room when someone new enters.
    function handleNewMember(val) {
        currentMembers.innerHTML = "Currently in chat..."
        currentMembers.innerHTML += '<hr style="height:2px!important; background-color: darkslategray !important; border: solid 2px darkslategray !important;">'
        console.log("handlenemember", val);
        val.forEach(function (element) {
            currentMembers.innerHTML += element + "<br />" ;
        }, this);

    };

    //close connections when we want to exit the session.
    function handleLeave() {
        if (obsConn) {
            obsConn.close();
            obsChannel.close();
            obsConn = null;

        }
        if (guestConn) {
            guestConn.close();
            guestChannel.close();
            guestConn = null;
        }
    };


    //when user clicks the "send message" button.  As the observer currently does not work, we send messages only to the
    //guest
    $scope.sendMessage = function(){
        var val = {
            type: "chatMessage",
            message: msgInput.value,
            name: $scope.hostName,
            room: $scope.myRoom
        };
        chatArea.innerHTML += val.name + ": " + val.message + "<br />";
        console.log("sent message", val);
        msgInput.value = "";
        // obsChannel.send(JSON.stringify(val));
        guestChannel.send(JSON.stringify(val));
    };

    //____________________________________________________________________________________________________
    //____________________________________________________________________________________________________
    // ___________________________________________________________________________________________________
    //Recordings: handle equipment testing, guest and host recordings during session


    $scope.startRecordingSession = function(){
        recordBtn.style.display = 'none';
        endRecordBtn.style.display = 'block';
        $scope.doneRecording = false;
        startRecording();
    };

    $scope.stopRecordingSession = function(){
        recordBtn.style.display = 'block';
        endRecordBtn.style.display = 'none';
        document.querySelector('#recordedVideoArea').style.display = 'block';
        document.querySelector('#showRecording').style.display= 'block';
        $scope.doneRecording = true;
        stopRecording();
    };



    $scope.showSaveArea = function () {
        $scope.doneRecording = !$scope.doneRecording;
    }


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
        mediaRecorder = new MediaRecorder(streamGuest);
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
    };


    var stopRecording = function () {
        mediaRecorderHost.stop();
        mediaRecorder.stop();


    };





    //____________________________________________________________________________________________________
    //____________________________________________________________________________________________________
    // ___________________________________________________________________________________________________
    //Logic for saving session to the bucket

    $scope.saveRecording = function () {

        $scope.download();

        signalingService.saveRecording($scope.Recording)
            .then(function (response) {
                $scope.feedback = response.data;
            }, function (error) {
                $scope.feedback = error.data;
                console.log(error);
            });


    };

    //download recording file function
    $scope.download = function () {
        var a = document.getElementById("a");
        var name = $scope.Recording.name + ".ogg";
        a.href = URL.createObjectURL($scope.blobHost);
        $scope.videoLink = a.href;
        a.download = name;
//        console.log(a);
//        a.click();

    };


});
