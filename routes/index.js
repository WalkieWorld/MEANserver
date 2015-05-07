var express = require('express');
var GUID = require('./../models/GUID');
var router = express.Router();
var _Period = require('./../models/Period');
var usersObj = require('./../models/Users');
var loginHistoryObj = require('./../models/LoginHistory');
var User = usersObj.usersModel;
var LoginHistory = loginHistoryObj.loginHistoryModel;
var ObjectID = require('mongodb').ObjectID;
var helperObj = require('./../models/helper');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express', btnContent: 'Sign Up', action: 'users/', csrfToken: req.csrfToken() });
});

router.get('/login', function(req, res, next){
    res.render('index', { title: 'Express', btnContent: 'Log In', action: 'login', csrfToken: req.csrfToken() });
});

/* Login as a specific user. */
router.post('/login', csrfProtection, function(req, res, next) {
    "use strict"
    if(!req.xhr){
        User.findOne({name: req.body.name, birthday: req.body.birthday}).exec(function(err, user){
            var sessionToken = "";
            if (err) {
                return console.error(err);
            } else {
                if(user){
                    var guid = (new GUID()).getGUID;
                    var now = new Date().getTime();
                    sessionToken = guid + "_" + now;
                    var currentSessionObj = new LoginHistory({
                        _id: new ObjectID(),
                        user_id: user._id,
                        time: now,
                        session: guid,
                        period: _Period
                    });
                    currentSessionObj.save(function(err){
                        if (err){
                            console.log(err);
                            return next(err);
                        }
                    });
                }
            }
            res.redirect("/users/login?access_token=" + sessionToken)
        });
    }else{
        next();
    }
}, function(req, res){
    if(!helperObj.isEmpty(req.body)){
        User.findOne({name: req.body.name, birthday: req.body.birthday}, function (err, user) {
            if (err) {
                return console.error(err);
            } else {
                if (user !== null) {
                    loginHistoryObj.loginHistoryModel.findOne({user_id: user._id}).sort({time: -1}).exec(function(err, loginSession){
                        if (err) {
                            return console.error(err);
                        } else {
                            console.log("Time compared: " + (new Date().getTime() - parseInt(loginSession.time, 10) - parseInt(loginSession.period, 10)));
                            if(parseInt(loginSession.time, 10) + parseInt(loginSession.period, 10) < new Date().getTime()){
                                res.json();
                            }else{
                                var resJSON = JSON.stringify({
                                    user_id: user.user_id,
                                    name: user.name,
                                    birthday: user.birthday,
                                    expire_time: parseInt(loginSession.time, 10) + parseInt(loginSession.period, 10),
                                    session: loginSession.session,
                                    period: loginSession.period
                                });
                                res.json(resJSON);
                            }
                        }
                    });
                }
            }
        });
    }
});

module.exports = router;
