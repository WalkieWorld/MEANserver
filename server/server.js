/**
 * Created by Hao Zhang on 3/19/15.
 * This is a server that will listen REST requests
 */

/*
* The first argv must be a port
* */
(function(argv){
    var http = require('http');
    var url = require('url');
    var MongoClient = require('mongodb').MongoClient;
    http.createServer(function(req, res){
        if(req.method === "GET"){
            console.log("GET");
            var queryObj = url.parse(req.url, true);
            var resJSON = "";
            var d = new Date(queryObj.query.id);
            MongoClient.connect("mongodb://localhost:27017/users", function(err, db) {
                if(!err) {
                    console.log("We are connected");
                }
            });
            // TODO: Response data as JSON to client
            resJSON = JSON.stringify({
                //
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(resJSON);
        }else if(req.method === "POST"){
            console.log("POST");
            var body = ""
            req.setEncoding('utf8');
            req.on('data', function (chunk) {
                body += chunk;
            });
            req.on('end', function () {
                // TODO: Connect to database to store data

                res.writeHead(200, {"Content-Type": "text/plain"});
                res.end(body);
            });
        }else if(req.method === "PUT"){
            //
        }else if(req.method === "DELETE"){
            //
        }
    }).listen(argv[2]);
})(process.argv)