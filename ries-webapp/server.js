var http = require("http");
var fs = require("fs");

var doGet = function (req, res) {
    console.log(req.url);
    //request for js files
    var jsRe = /javascript\/app\/\w*.js/;
    var jsmatch = jsRe.exec(req.url);

    var jsRe2 = /javascript\/controllers\/\w*.js/;
    var jsmatch2 = jsRe2.exec(req.url);

    var jsRe3 = /javascript\/services\/\w*.js/;
    var jsmatch3 = jsRe3.exec(req.url);




    //request for /pages/*.html
    var pgRe = /pages\/\w*.html/;
    var pgmatch = pgRe.exec(req.url);

    //request for css
    var css = /css\/\w*.css/;
    var cssmatch = css.exec(req.url);

    if (req.url == '/') {
        fs.readFile('index.html', function (err, data) {
            if (err) {
                console.error(err);
                res.writeHead(400, { "Content-Type": 'text/html' });
                res.end("<h1>An error has occured during your request</h1>");
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
        });
    } else if (jsmatch) {
        jsmatch = jsmatch[0];
        //requesting .js file
        fs.readFile(jsmatch.toString(), function (err, data) {
            if (err) {
                console.error(err);
                res.writeHead(400, { "Content-Type": 'text/html' });
                res.end("<h1>An error has occured during your request</h1>");
            }
            res.writeHead(200, { "Content-Type": "text/javascript" });
            res.write(data);
            res.end();
        });
    } else if (jsmatch2) {
        jsmatch = jsmatch2[0];
        // console.log(jsmatch);
        //requesting .js file
        fs.readFile(jsmatch.toString(), function (err, data) {
            if (err) {
                console.error(err);
                res.writeHead(400, { "Content-Type": 'text/html' });
                res.end("<h1>An error has occured during your request</h1>");
            }
            res.writeHead(200, { "Content-Type": "text/javascript" });
            res.write(data);
            res.end();
        });
    } else if (jsmatch3) {
        jsmatch = jsmatch3[0];
        // console.log(jsmatch);
        //requesting .js file
        fs.readFile(jsmatch.toString(), function (err, data) {
            if (err) {
                console.error(err);
                res.writeHead(400, { "Content-Type": 'text/html' });
                res.end("<h1>An error has occured during your request</h1>");
            }
            res.writeHead(200, { "Content-Type": "text/javascript" });
            res.write(data);
            res.end();
        });
    } else if (pgmatch) {
        pgmatch = pgmatch[0];
        // console.log(pgmatch, req.url);
        fs.readFile(pgmatch.toString(), function (err, data) {
            if (err) {
                console.error(err);
                res.writeHead(400, { "Content-Type": 'text/html' });
                res.end("<h1>An error has occured during your request</h1>");
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
        });
    } else if (cssmatch) {
        cssmatch = cssmatch[0];
        // console.log(cssmatch, req.url);
        fs.readFile(cssmatch.toString(), function (err, data) {
            if (err) {
                console.error(err);
                res.writeHead(400, { "Content-Type": 'text/html' });
                res.end("<h1>An error has occured during your request</h1>");
            }
            res.writeHead(200, { "Content-Type": "text/css" });
            res.write(data);
            res.end();
        })

    } else {
        fs.readFile('index.html', function (err, data) {
            res.write(data);
            res.end();
        });
    }

}

http.createServer((req, res) => {
    var method = req.method;

    if (method == "GET") {
        doGet(req, res);
    }
    else {
        res.writeHead(400, { "Content-Type": 'text/html' });
        res.end("<h1>Your request could not be processed</h1>");
    }
})
    .listen(3001, function () {
        console.log("Listening on port", 3001);
    });





//require our websocket library 
var WebSocketServer = require('ws').Server;

//creating a websocket server at port 7000
var wss = new WebSocketServer({ port: 7000 });

//all connected to the server users 
var users = {};

//when a user connects to our sever 
wss.on('connection', function (connection) {

    console.log("User connected");

    //when server gets a message from a connected user 
    connection.on('message', function (message) {

        var data;
        //accepting only JSON messages 
        try {
            data = JSON.parse(message);
        } catch (e) {
            console.log("Invalid JSON");
            data = {};
        }

        //switching type of the user message 
        switch (data.type) {
            //when a user tries to login 
            case "login":
                console.log("User logged", data.name);



                //if anyone is logged in with this username then refuse 
                if (users[data.name]) {
                    sendTo(connection, {
                        type: "login",
                        success: false
                    });
                } else {
                    //save user connection on the server 
                    users[data.name] = connection;
                    connection.name = data.name;

                    sendTo(connection, {
                        type: "newMember",
                        name: data.name
                    });

                    sendTo(connection, {
                        type: "login",
                        success: true
                    });
                }

                break;

            case "offer":
                //for ex. UserA wants to call UserB 
                console.log("Sending offer to: ", data.name, " with data: ", data.offer);

                //if UserB exists then send him offer details 
                var conn = users[data.name];

                if (conn != null) {
                    //setting that UserA connected with UserB 
                    connection.otherName = data.name;

                    sendTo(conn, {
                        type: "offer",
                        offer: data.offer,
                        name: connection.name
                    });
                }

                break;

            case "answer":
                console.log("Sending answer to: ", data.name, " with data: ", data.answer);
                //for ex. UserB answers UserA 
                var conn = users[data.name];

                if (conn != null) {
                    connection.otherName = data.name;
                    sendTo(conn, {
                        type: "answer",
                        answer: data.answer
                    });
                }

                break;

            case "candidate":
                console.log("Sending candidate to:", data.name, " with data: ", data.candidate);
                var conn = users[data.name];

                if (conn != null) {
                    sendTo(conn, {
                        type: "candidate",
                        candidate: data.candidate
                    });
                }

                break;

            case "leave":
                console.log("Disconnecting from", data.name);
                var conn = users[data.name];
                conn.otherName = null;

                //notify the other user so he can disconnect his peer connection 
                if (conn != null) {
                    sendTo(conn, {
                        type: "leave"
                    });
                }

                break;

            default:
                sendTo(connection, {
                    type: "error",
                    message: "Command not found: " + data.type
                });

                break;

        }
    });

    //when user exits, for example closes a browser window 
    //this may help if we are still in "offer","answer" or "candidate" state 
    connection.on("close", function () {

        if (connection.name) {
            delete users[connection.name];

            if (connection.otherName) {
                console.log("Disconnecting from ", connection.otherName);
                var conn = users[connection.otherName];
                conn.otherName = null;

                if (conn != null) {
                    sendTo(conn, {
                        type: "leave"
                    });
                }
            }
        }
    });

    connection.send(JSON.stringify("Hello world"));

});

function sendTo(connection, message) {
    // console.log("connection",connection);
    //console.log("message",message);
    connection.send(JSON.stringify(message));
}