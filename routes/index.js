var express = require('express');
var GUID = require('./../models/GUID');
var router = express.Router();
var _Period = require('./../models/Period');
var usersObj = require('./../models/Users');
var loginHistoryObj = require('./../models/LoginHistory');
var User = usersObj.usersModel;
var LoginHistory = loginHistoryObj.loginHistoryModel;
var ObjectID = require('mongodb').ObjectID;
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express', btnContent: 'Sign Up', action: 'user/' });
});

router.get('/login', function(req, res, next){
    res.render('index', { title: 'Express', btnContent: 'Log In', action: 'login' });
});

/* Login as a specific user. */
router.post('/login', function(req, res, next) {
    "use strict"
    User.findOne({name: req.body.name, birthday: req.body.birthday}).exec(function(err, user){
        var sessionToken = "";
        if (err) {
            return console.error(err);
        } else {
            if(user){
                var guid = (new GUID()).getGUID;
                var now = new Date().getTime();
                sessionToken = guid + "_" + now;
                var currentSessionObj = {
                    _id: new ObjectID(),
                    time: now,
                    session: guid,
                    period: _Period
                }
                LoginHistory.create(currentSessionObj, function (err, post) {
                    if (err){
                        console.log(err);
                        return next(err);
                    }
                });
            }
        }
        res.redirect("/users/login?access_token=" + sessionToken)
    });
});

module.exports = router;
