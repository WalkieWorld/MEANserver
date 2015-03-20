/**
 * Created by Hao Zhang on 3/19/15.
 * This is a server that will listen REST requests
 */

/*
 * The first argv must be a port
 * */
(function (argv) {
    var http = require('http');
    var url = require('url');
    var Models = require('./../models/schemaModels.js');
    var addr = "localhost:27017/MEANdb";
    var modelList = new Models();
    var resJSON = "";
    var mongoose = require('mongoose');
    http.createServer(function (req, res) {
        if (req.method === "GET") {
            console.log("GET");
            var queryObj = url.parse(req.url, true);
            var id = queryObj.pathname.match(/id\/[0-9]{1,}/g);
            if(id instanceof Array){
                id = id[0].split('/')[1];
            }
            var users = mongoose.model('users', modelList.models.UserSchema);
            mongoose.connect('mongodb://' + addr).connection.on('error', function () {
                console.error.bind(console, "Connect error:");
            });
            mongoose.connect('mongodb://' + addr).connection.once('open', function () {
                users.findOne({_id: id}, function (err, user) {
                    if (err) {
                        return console.error(err);
                    } else {
                        resJSON = JSON.stringify({
                            id: user._id,
                            name: user.name,
                            birthday: user.birthday
                        })
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(resJSON);
                    }
                });
            });
        } else if (req.method === "POST") {
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
        } else if (req.method === "PUT") {
            //
        } else if (req.method === "DELETE") {
            //
        }
    }).listen(argv[2]);
})(process.argv)