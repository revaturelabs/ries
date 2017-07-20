/**
 * Created by Jhoan Osorno on 7/14/2017.
 */
var app = angular.module("RIESApp");

app.controller("hostCtrl", function ($scope, $http, signalingService, guestHostService) {
    var usernameInput = document.querySelector('#usernameInput');
    var callPage = document.querySelector('#callPage');
    var callBtn = document.querySelector('#callBtn');
    var hangUpBtn = document.querySelector('#hangUpBtn');
    var msgInput = document.querySelector('#msgInput');
    var sendMsgBtn = document.querySelector('#sendMsgBtn');
    var recordBtn = document.querySelector('#recordBtn');
    var endRecordBtn = document.querySelector('#endRecordBtn');
    var chatArea = document.querySelector('#chatarea');
    var currentMembers = document.querySelector('#currentlyInChat');
    var yourConn;
    var dataChannel;
    callPage.style.display = "none";
    var recordedVideo = document.querySelector('#recordedVideo');
    var modalEndSess = document.getElementById('myModal');
    //var modalBtn = document.getElementById("modalBtn");
    var outsideModal = document.getElementsByClassName("close")[0];
    $scope.myIpV4 = "no response yet...";
    $scope.feedback = "";
    var connectedUser;
    $scope.isTesting = true;
    $scope.myRoom = "";
    $scope.doneRecording = false;

    var hostInfo = guestHostService.getHostInfo();

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
        console.log("starting session");
        document.querySelector('#callPage').style.display = 'block';
        document.querySelector('#equipmentTest').style.display = 'none';
        $scope.myRoom = roomService();
        console.log("$scope.myRoom", $scope.myRoom);
        send({
            type: "login",
            name: hostInfo.firstName+hostInfo.lastName,
            room: $scope.myRoom
        });

    };

    var roomService = function(){
        var hostFirst = "hostFirst";
        var hostLast = "hostLast";
        var guestLast = "guestLast";
        var guestFirst = "guestFirst";
        return hostFirst + hostLast + guestFirst + guestLast;
    }


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


    $scope.isRecording = true;
    recordBtn.addEventListener("click", function (event) {
        startRecording();
        $scope.isRecording = !$scope.isRecording;
        recordBtn.innerHTML = "Recording...";
    });

    endRecordBtn.addEventListener("click", function (event) {
        stopRecording();
        $scope.isRecording = !$scope.isRecording;
        recordBtn.innerHTML = "<i class='fa fa-microphone' aria-hidden='true'></i> Record";
        $scope.doneRecording = true;
    });

    var myStream;

    function handleLogin(success) {
        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(function (stream) {
            myStream = stream;
            setUpMediaRecorderHost(stream);
            var lVideo = document.querySelector("#local");
            var rVideo = document.querySelector("#remote");
            lVideo.src = window.URL.createObjectURL(stream);

            setUpConnection(stream, lVideo, rVideo);
            setUpDataChannel();
        }).then(function (err) {
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
            setUpMediaRecorder(e.stream, myStream);
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
        dataChannel = yourConn.createDataChannel($scope.myRoom, {reliable: true});

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

    }

    callBtn.addEventListener("click", function () {
        yourConn.createOffer(function (offer) {
            send({
                type: "offer",
                offer: JSON.stringify(offer)
            });
            console.log("offer", offer);
            yourConn.setLocalDescription(offer);
        }, function (error) {
            if(error){
                alert("Error when creating an offer");
            }
        });
    });


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
            name: hostInfo.firstName+hostInfo.lastName
        };
        chatArea.innerHTML += val.name + ": " + val.message + "<br />";
        console.log("dataChannel: ", dataChannel);
        //sending a message to a connected peer
        dataChannel.send(JSON.stringify(val));
        console.log("sent message", val);
        msgInput.value = "";
    });



    //_____________________________________________________________________________________________________
    $scope.saveRecording = function(){

        //make file using blob object made during recording; add name and date fields to make it a file
        //need to add fields for amazonS3 keys
        $scope.Recording.file =  $scope.blobHost;
        // $scope.Recording.file.name = $scope.Recording.name;
        // $scope.Recording.file.lastModifiedDate = new Date();
        console.log($scope.Recording);

        //make download link for recording
        $scope.videoLink  = URL.createObjectURL($scope.Recording.file);

        //uncomment if you want to download recording when saving to s3
        $scope.download();

        // signalingService.saveRecording($scope.Recording)
        //     .then(function(response) {
        //         $scope.feedback = response.data;
        //     }, function(error) {
        //         $scope.feedback= error.data;
        //         console.log(error);
        //     });
    };

    //download recording file function
    $scope.download = function() {
        var a = document.getElementById("a");
        var name = $scope.Recording.name +".mp4";
        a.href = URL.createObjectURL($scope.Recording.file);
        $scope.videoLink = a.href;
        a.download = name;
        console.log(a);
        a.click();

    };


});

