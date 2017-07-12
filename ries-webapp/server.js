var http = require("http");
var fs = require("fs");

var doGet = function (req, res) {
    console.log(req.url);
    //request for js files
    var jsRe = /javascript\/\w*.js/;
    var jsmatch = jsRe.exec(req.url);
    /*
    var jsRe2 = /app\/\w*\-\w*.Min.js/;
    var jsmatch2 = jsRe2.exec(req.url);

    var jsRe3 = /fusioncharts-suite-xt\/js\/\w*.js/;
    var jsmatch3 = jsRe3 = jsRe3.exec(req.url);

    var jsRe4 = /fusioncharts-suite-xt\/js\/\w*.\w*.js/;
    var jsmatch4 = jsRe4 = jsRe4.exec(req.url);
    */
    //request for /pages/*.html
    var pgRe = /pages\/\w*.html/;
    var pgmatch = pgRe.exec(req.url);

    //request for css
    var css = /css\/\w*.css/;
    var cssmatch = css.exec(req.url);

    //Request of png
    var imp = /\w*\-*\w*.png/;
    var immatch = imp.exec(req.url);
    
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
        console.log(jsmatch);
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
        jsmatch2 = jsmatch2[0];
        console.log(jsmatch2);
        //requesting .js file
        fs.readFile(jsmatch2.toString(), function (err, data) {
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
        jsmatch3 = jsmatch3[0];
        console.log(jsmatch3);
        //requesting .js file
        fs.readFile(jsmatch3.toString(), function (err, data) {
            if (err) {
                console.error(err);
                res.writeHead(400, { "Content-Type": 'text/html' });
                res.end("<h1>An error has occured during your request</h1>");
            }
            res.writeHead(200, { "Content-Type": "text/javascript" });
            res.write(data);
            res.end();
        });
    } else if (jsmatch4) {
        jsmatch4 = jsmatch4[0];
        console.log(jsmatch4);
        //requesting .js file
        fs.readFile(jsmatch4.toString(), function (err, data) {
            if (err) {
                console.error(err);
                res.writeHead(400, { "Content-Type": 'text/html' });
                res.end("<h1>An error has occured during your request</h1>");
            }
            res.writeHead(200, { "Content-Type": "text/javascript" });
            res.write(data);
            res.end();
        });
    } else if(pgmatch){
        pgmatch = pgmatch[0];
        console.log(pgmatch, req.url);
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
    }else if(immatch){
        immatch = immatch[0];
        console.log(immatch, req.url);
        fs.readFile(immatch.toString(), function (err, data) {
            if (err) {
                console.error(err);
                res.writeHead(400, { "Content-Type": 'text/html' });
                res.end("<h1>An error has occured during your request</h1>");
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
        });
    }else if (cssmatch){
        cssmatch = cssmatch[0];
        console.log(cssmatch, req.url);
        fs.readFile(cssmatch.toString(), function(err, data){
            if (err) {
                console.error(err);
                res.writeHead(400, { "Content-Type": 'text/html' });
                res.end("<h1>An error has occured during your request</h1>");
            }
            res.writeHead(200, { "Content-Type": "text/css" });
            res.write(data);
            res.end();
        })
    
    }else {
        fs.readFile('index.html', function(err, data){
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
