var express = require('express');
var router = express.Router();
var usersObj = require('./../models/Users');
var loginHistoryObj = require('./../models/LoginHistory');

var Users = usersObj.usersModel;
/* GET a specific user. */
router.get('/id/:id', function(req, res, next) {
    "use strict"
    Users.findOne({_id: req.params.id}, function (err, user) {
        if (err) {
            return console.error(err);
        } else {
            var resJSON = "";
            resJSON = JSON.stringify({
                id: user._id,
                name: user.name,
                birthday: user.birthday
            })
            res.json(resJSON);
        }
    });
});

router.get('/login', function(req, res, next){
    "use strict"
    var session = req.query.access_token;
    session = session.split('_');
    session = session[0];
    console.log(session);
    loginHistoryObj.loginHistoryModel.findOne({session: session}, function (err, loginSession) {
        if (err) {
            return console.error(err);
        } else {
            var resJSON = "";
            resJSON = JSON.stringify({
                id: loginSession._id,
                time: loginSession.time,
                session: loginSession.session,
                period: loginSession.period
            })
            res.json(resJSON);
        }
    });
});

/* Create a new user */
router.post('/', function(req, res, next) {
    "use strict"
    var userObj = usersObj.User;
    var newId;
    var myUser = Users.find({}).sort({_id: -1}).limit(1);
    myUser.exec(function (err, user) {
        if (err){
            return console.error(err);
        }
        newId = (
            parseInt(user[0]._id, 10) === undefined
            ? 0 : parseInt(user[0]._id, 10)) + 1;
        userObj._id = newId;
        userObj.name = req.body.name;
        userObj.birthday = req.body.birthday;
        userObj.profession = 0;
        Users.create(userObj, function (err, post) {
            if (err){
                return next(err);
            }
        });
        res.redirect('http://' + req.get('host') + "/users/id/" + newId);
    });
});

/* Update an exisiting new user */
router.put('update/id/:id', function(req, res, next) {
    Users.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err){
            return next(err);
        }
        res.send("Successful!");
    });
});

module.exports = router;
