/**
 * Created by craig on 7/18/2017.
 */
/**
 * Created by Jhoan Osorno on 7/14/2017.
 */
var app = angular.module("RIESApp");

app.controller("observerCtrl", function ($scope) {

    var hasUserMedia = function () {
        //check for WebRTC support
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
            || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        return !!navigator.getUserMedia;
    }

    $scope.message = "";
    var name;
    var connectedUser;
    $scope.isTesting = true;


    //connecting to our signaling server
    var conn = new WebSocket('ws://localhost:3001/socket');
    conn.onopen = function () {
        console.log("Connected to the signaling server");
    };

    //when we got a message from a signaling server
    conn.onmessage = function (msg) {

        var data = JSON.parse(msg.data);
        console.log("Got message", data);
        switch (data.type) {
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
                handleNewMember(data.name);
                break;
            default:
                break;
        }
    };

    conn.onerror = function (err) {
        console.log("Got error", err);
    };

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
        if (hasUserMedia()) {

            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
                || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            navigator.getUserMedia({video: true, audio: false}, function (stream) {
                console.log("stream tracks");
                console.log(stream.getTracks());

                myStream = stream;
                var testRecord = document.querySelector("#testRecord");
                testRecord.src = window.URL.createObjectURL(myStream);
                setUpGenericMediaRecorder(myStream);
                testEquipmentStream.start();
                $scope.isTesting = true;
                console.log($scope.isTesting);
                document.querySelector('#startTestEquipment').innerHTML = "Recording...";
            }, function (err) {
                console.log("something went wrong", err);
            });
        } else {
            alert("Your browser is not supported, please use Chrome or Firefox.");
        }

    }

    $scope.endTest = function () {
        var testBlob = testEquipmentStream.stop();
        $scope.isTesting = false;
        console.log($scope.isTesting);
        document.querySelector('#startTestEquipment').innerHTML = "Test Again?";
    }


    $scope.startSession = function () {
        console.log("starting session");
        document.querySelector('#callPage').style.display = 'block';
        document.querySelector('#equipmentTest').style.display = 'none';
        send({
            type: "login",
            name: "host"
        });

    }

    //alias for sending JSON encoded messages
    function send(message) {

        //attach the other peer username to our messages
        if (connectedUser) {
            message.name = connectedUser;
        }

        conn.send(JSON.stringify(message));
    };


    var usernameInput = document.querySelector('#usernameInput');
    var callPage = document.querySelector('#callPage');
    var callToUsernameInput = document.querySelector('#callToUsernameInput');
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
    hangUpBtn.onclick = function () {
        modalEndSess.style.display = "block";
    }

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
    });

    var myStream;
    function handleLogin(success) {

        if (success === false) {
            alert("Ooops...try a different username");
        } else {

            if (hasUserMedia()) {

                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
                    || navigator.mozGetUserMedia || navigator.msGetUserMedia;
                // //get audio and video streams
                navigator.getUserMedia({video: true, audio: false}, function (stream) {


                    // setUpMediaRecorder(stream);

                    myStream = stream;
                    setUpMediaRecorderHost(stream);
                    var lVideo = document.querySelector("#local");
                    var rVideo = document.querySelector("#remote");
                    lVideo.src = window.URL.createObjectURL(stream);

                    setUpConnection(stream, lVideo, rVideo);
                    setUpDataChannel();
                    console.log(dataChannel);


                }, function (err) {
                    console.log("getUserMediaError", err);
                });
            }
        }
    };


    var setUpConnection = function (stream, lVideo, rVideo) {
        var configuration = {
            "iceServers": [{'urls': 'stun:stun.services.mozilla.com'}, {"urls": "stun:stun2.1.google.com:19302"}]
        };
        var rtcPeerConnection = RTCPeerConnection || webkitRTCPeerConnection || mozRTCPeerConnection || msRTCPeerConnection;
        yourConn = new rtcPeerConnection(configuration, {optional: [{RtpDataChannels: true}]});
        yourConn.ondatachannel = function (e) {
            receiveChannel = e.channel;
            console.log(e.channel);
            receiveChannel.onmessage = function (e) {
                var obj = JSON.parse(e.data);
                chatArea.innerHTML += obj.name + ": " + obj.message + "<br />";
            }
        }

        yourConn.addStream(stream);
        yourConn.addEventListener("addstream", function (e) {
            console.log("adding streams", e);
            //rVideo.src = window.URL.createObjectURL(stream);
            lVideo.src = window.URL.createObjectURL(e.stream);
            //setUpMediaRecorder(e.stream,myStream);
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

    }
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
    }

    var chunks = [];
    var mediaRecorder;
    var blobGuest;

    function setUpMediaRecorder(streamGuest,streamHost) {
        console.log("streamHost");
        console.log(streamHost);
        console.log(streamHost.getTracks());
        mediaRecorder = new MediaRecorder([streamGuest,streamHost.getTracks()[0]]);

        // mediaRecorder = new MediaRecorder([streamGuest.getTracks()[0],streamGuest.getTracks()[1],streamHost.getTracks()[0]]);


        // mediaRecorder = new MediaRecorder(streamGuest);
        mediaRecorder.ondataavailable = function (e) {
            console.log("data is available");
            chunks.push(e.data);
        }
        mediaRecorder.onstop = function (e) {
            console.log("recorder stopped");
            console.log(mediaRecorder.state);
            blobGuest = new Blob(chunks, {'type': 'video/ogg; codecs=opus'});
            recordedVideo.src = window.URL.createObjectURL(blobGuest);
            // var tmp = record(new MediaStream([blobGuest, blobHost]),10000);

            recordedVideo.src = window.URL.createObjectURL(tmp);
            chunks = [];

        }
        //console.log(mediaRecorder);
    }


    var chunkHost = [];
    var mediaRecorderHost;
    var blobHost;


    function setUpMediaRecorderHost(stream) {
        mediaRecorderHost = new MediaRecorder(stream);
        mediaRecorderHost.ondataavailable = function (e) {
            console.log("data is available");
            chunkHost.push(e.data);
            chunks.push(e.data);
        }
        mediaRecorderHost.onstop = function (e) {
            blobHost = new Blob(chunkHost, {'type': 'video/ogg; codecs=opus'});
            // recordedVideo.src = window.URL.createObjectURL(blob);
            chunkHost = [];

        }
    }

    var startRecording = function () {
        mediaRecorder.start();
        mediaRecorderHost.start();
        console.log(mediaRecorder.state);
    }
    var stopRecording = function () {
        mediaRecorderHost.stop();

        setTimeout(function () {
            mediaRecorder.stop();
            $scope.message = "Video Recorded. Press save button to store recording."

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
            alert("Error when creating an offer");
        });
    });


    //when somebody sends us an offer
    function handleOffer(offer, name) {
        connectedUser = name;
        yourConn.setRemoteDescription(new RTCSessionDescription(offer));
        console.log("1111111111111111111111");
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
            name: "host"
        };
        chatArea.innerHTML += val.name + ": " + val.message + "<br />";
        console.log("dataChannel: ", dataChannel);
        //sending a message to a connected peer
        dataChannel.send(JSON.stringify(val));
        console.log("sent message", val);
        msgInput.value = "";
    });


    //___________________________________________________________________________________
    //video handling
    var videoTrack;
    var mediaStream;


});


