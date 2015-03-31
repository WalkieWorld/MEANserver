var express = require('express');
var router = express.Router();
var usersObj = require('./../models/Users');
var loginHistoryObj = require('./../models/LoginHistory');

var helperObj = require('./../models/helper');

var Users = usersObj.usersModel;
/* GET a specific user. */
router.get('/id/:id', function(req, res, next) {
    "use strict"
    Users.findOne({_id: req.params.id}, function (err, user) {
        if (err) {
            return console.error(err);
        } else {
            var resJSON = JSON.stringify({
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
    if(helperObj.isEmpty(req.body) && (req.query.access_token === undefined || req.query.access_token === null)){
        res.redirect('/login');
    }else {
        next();
    }
}, function(req, res){
    var session = req.query.access_token;
    session = session.split('_');
    session = session[0];
    console.log(session);
    loginHistoryObj.loginHistoryModel.findOne({session: session}, function (err, loginSession) {
        if (err) {
            return console.error(err);
        } else {
            if(loginSession !== null){
                Users.findOne({_id: loginSession.user_id}, function (err, user) {
                    if (err) {
                        return console.error(err);
                    } else {
                        res.render('users/login',
                            {
                                user_id: user._id,
                                name: user.name,
                                birthday: user.birthday,
                                session: loginSession.session,
                                expire_time: new Date(parseInt(loginSession.time, 10) + parseInt(loginSession.period, 10))
                            }
                        );
                    }
                });
            }else{
                res.render('error', {
                    message: "Cannot find the user!",
                    error: {
                        status: "200",
                        stack: "null"
                    }
                });
                return console.error("Cannot find the user!");
            }
        }
    });
});

/* Create a new user */
router.post('/', function(req, res, next) {
    "use strict"
    var userObj = usersObj.User;
    var newId;
    Users.findOne({name: req.body.name, birthday: req.body.birthday}).exec(function(err, user){
        if(err){
            return console.error(err);
        }else{
            if(user === null || user.length === 0){
                var myUser = Users.find({}).sort({_id: -1}).limit(1);
                myUser.exec(function (err, user) {
                    if (err){
                        return console.error(err);
                    }
                    newId = (
                        user.length === 0
                            ? 0 : parseInt(user[0]._id, 10)) + 1;
                    userObj._id = newId;
                    userObj.name = req.body.name;
                    userObj.birthday = req.body.birthday;
                    userObj.profession = 0;
                    Users.create(userObj, function (err) {
                        if (err){
                            console.log(err);
                            return next(err);
                        }
                    });
                    res.redirect("/users/id/" + newId);
                });
            }else{
                res.render('error', {
                    message: "The user has been existing!",
                    error: {
                        status: "E11000",
                        stack: "E11000 duplicate key error index: collection users"
                    }
                });
                return console.error("The user has been existing!");
            }
        }
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
