/**
 * Created by craig on 7/11/2017.
 */
var connection = new WebSocket("ws://localhost:9999");
var name = "";
var loginButton = document.querySelector("#login");
var callButton = document.querySelector("#call");
var recordButton = document.querySelector("#record");
var sendButton = document.querySelector("#send");
var chatText = document.querySelector("#text");
var chatLog = document.querySelector("#log");
var connectedUser, myConnection, myStream, username;
var mediaStreamRecorder, chunks=[];
var recording = false;
var chatChannel, receiveChannel;
function prepChatEntry(text, username){
    var line;
    if(username){
        line = "<div>"+ username + ": " + text + "</div>";
    }else{
        line = "<div class=\"me\">"+ text + "</div>";
    }
    return line;
}
sendButton.addEventListener("click", function(event){
    var text = prepChatEntry(chatText.value, username);
    chatChannel.send(text);
    chatLog.innerHTML += prepChatEntry(chatText.value, null);
    chatText.value = "";
});
recordButton.addEventListener("click", function(event){
    console.log(this);
    if(recording){
        console.log("Stopping recording");
        mediaStreamRecorder.stop();
        this.value = "Record";
        recording = false;
    }else{
        console.log("Starting recording");
        mediaStreamRecorder.start(2000);
        this.value = "Stop Recording";
        recording = true;
    }
});
loginButton.addEventListener("click", function (event) {
    username = document.querySelector("#name").value;
    if (!username || username.length < 6) {
        alert("please enter a username");
        return;
    }
    send({
        type: "login",
        name: username
    })
});
callButton.addEventListener("click", function (event) {
    var username = document.querySelector("#other").value;
    connectedUser = username;
    if (username && username.length > 0) {
        //make an offer
        myConnection.createOffer(function (offer) {
            send({
                type: 'offer',
                offer: offer
            });
            myConnection.setLocalDescription(offer)
        }, function (err) {
            alert("an error has occured making a call to", username);
        });
    }
});
function onOffer(offer, name) {
    connectedUser = name;
    myConnection.setRemoteDescription(new RTCSessionDescription(offer));
    myConnection.createAnswer(function (answer) {
        myConnection.setLocalDescription(answer);
        send({
            type: "answer",
            answer: answer
        });
    }, function (err) {
        alert('an error has occured answering an incoming call from', name);
    });
}
function onAnswer(answer) {
    myConnection.setRemoteDescription(new RTCSessionDescription(answer));
}
function onCandidate(candidate) {
    myConnection.addIceCandidate(new RTCIceCandidate(candidate));
}
connection.onmessage = function (message) {
    console.log("Got message", message.data);
    var data = JSON.parse(message.data);
    switch (data.type) {
        case 'login':
            onLogin(data.success);
            break;
        case 'offer':
            onOffer(data.offer, data.name);
            break;
        case 'answer':
            onAnswer(data.answer);
            break;
        case 'candidate':
            onCandidate(data.candidate);
            break;
        default:
            break;
    }
};
function onLogin(success) {
    if (success === false) {
        alert("oops try a different username");
    } else {
        createPeerConnection();
    }
}
function newRTCPeerConnection(config) {
    var rtcPeerConnection = RTCPeerConnection || webkitRTCPeerConnection || mozRTCPeerConnection || msRTCPeerConnection;
    return new rtcPeerConnection(config);
}
function send(message) {
    if (connectedUser) {
        message.name = connectedUser;
    }
    connection.send(JSON.stringify(message));
}
connection.onopen = function () {
    console.log("Connected");
}
connection.onerror = function (err) {
    console.log("Got error", err);
}
var hasUserMedia = function () {
    //check for WebRTC support
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    return !!navigator.getUserMedia;
}
var videoTrack;
var mediaStream;
function createPeerConnection() {
    if (hasUserMedia()) {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
            || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        //get audio and video streams
        navigator.getUserMedia({ video: true, audio: true }, function (stream) {
            myStream = stream;
            var lVideo = document.querySelector("#local");
            var rVideo = document.querySelector("#remote");
            //insert stream into video
            lVideo.src = window.URL.createObjectURL(stream);
            var configuration = [{ "url": "stun:stun.1.google.com:19302" }]
            console.log("creating myConnection");
            myConnection = newRTCPeerConnection(configuration, {optional: [{RtpDataChannels: true}]});
            myConnection.ondatachannel = function(e){
                receiveChannel = e.channel;
                console.log(e.channel);
                receiveChannel.onmessage = function(e){
                    document.querySelector("#log").innerHTML += event.data;
                }
            }
            myConnection.addStream(stream);
            myConnection.addEventListener("addstream", function (e) {
                rVideo.src = window.URL.createObjectURL(e.stream);
            });
            //ice handling
            myConnection.onicecandidate = function (event) {
                console.log("new candidate");
                if (event.candidate) {
                    send({ type: 'candidate', candidate: event.candidate });
                }
            }
            mediaStreamRecorder = new MediaRecorder(stream);
            mediaStreamRecorder.ondataavailable = function(e){
                chunks.push(e.data);
            }
            mediaStreamRecorder.onstart = function(e){
                console.log("Recording has started");
            }
            mediaStreamRecorder.onstop = function(e){
                var blob = new Blob(chunks, {'type': 'video/mp4; codecs=H.264'});
                var blobUrl = window.URL.createObjectURL(blob);
                document.querySelector("#url").innerHTML = blobUrl;
            }
            chatChannel = myConnection.createDataChannel("publicChannel", {reliable:true});
        }, function (err) { });
    } else {
        alert("Your browser doesn't have support for WebRTC which is required for this chat feature");
    }
}