/**
 * Created by Hao Zhang on 3/23/15.
 */

var GlobalObj = function(){
    this.path = window.location.pathname;
}

GlobalObj.prototype = {
    init: function(){
        switch (this.path){
            case '/':
            case '/login':
                break;
            case '/users/login':
                this.extend(this.UsersLogin.prototype, {
                    // Hard code inside
                    // It will set session after redirect to this page
                    init: function () {
                        var session = document.getElementById("session").textContent;
                        var expireTime = document.getElementById("expireTime").textContent;
                        var loginBtn = document.getElementById("ajaxBtnLogin");
                        loginBtn.addEventListener("click", this.loginEvent.bind(this));
                        this.setSessionLogin(JSON.stringify({expire_time: expireTime, session: session}));
                        var period = (new Date(expireTime)).getTime() - (new Date()).getTime();
                        expireTime = new Date(expireTime).getTime();
                        if(period <= 0){
                            alert("Session has expired!!! Please login again!");
                        }else{
                            this.runVerifySession(expireTime, period);
                        }
                    },
                    loginEvent: function(e){
                        var req = new XMLHttpRequest();
                        req.open("POST", "/login");
                        req.onreadystatechange = function(){
                            if(req.readyState === 4 && this.loginCallback){
                                this.loginCallback(req);
                            }
                        }.bind(this);
                        req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        req.send(this.encodeFormData({
                            name: document.getElementById("name").textContent,
                            birthday: document.getElementById("birthday").textContent
                        }));
                    },
                    encodeFormData: function(data) {
                        if (!data) return "";
                        var pairs = [];
                        for(var name in data) {
                            if (!data.hasOwnProperty(name)) continue;
                            if (typeof data[name] === "function") continue;
                            var value = data[name].toString();
                            name = encodeURIComponent(name.replace(" ", "+"));
                            value = encodeURIComponent(value.replace(" ", "+")); // Encode value
                            pairs.push(name + "=" + value);
                        }
                        return pairs.join('&');
                    },
                    loginCallback: function(req){
                        "use strict"
                        if(req.status === 200){
                            if(req.responseText !== ""){
                                var data = JSON.parse(req.responseText);
                                var sessionObj = this.getSessionLogin();
                                if(sessionObj === null || new Date(sessionObj.expire_time).getTime() <= (new Date()).getTime()){
                                    this.setSessionLogin(data);
                                    sessionObj = JSON.parse(data);
                                }
                                this.runVerifySession(sessionObj.expire_time, sessionObj.period);
                                alert("Login again successfully!");
                            }
                            else{
                                window.location = "https://localhost:3000/login";
                            }
                        }
                    },
                    setSessionLogin: function(sessionObj){
                        if(window.localStorage){
                            window.localStorage.setItem(this.userId, sessionObj);
                        }
                    },
                    getSessionLogin: function(){
                        if(window.localStorage){
                            return JSON.parse(window.localStorage.getItem(this.userId));
                        }
                    },
                    verifySession: function(expireTime){
                        "use strict"
                        var now = new Date().getTime();
                        if(expireTime <= now){
                            alert("Session has expired!");
                            clearInterval(this.verifySessionInterval);
                        }
                    },
                    runVerifySession: function(expireTime, period){
                        this.verifySessionInterval = setInterval(function(){
                            this.verifySession(expireTime)
                        }.bind(this), period);
                    }
                });
                break;
            default :
                break;
        }
    },
    extend: function(obj, methods){
        for(o in methods){
            obj[o] = methods[o];
        }
    },
    index: function(){},
    indexLogin: function(){},
    UsersLogin: function(id){
        this.userId = id;
        this.verifySessionInterval = undefined;
    }
}

var globalObjInstance = new GlobalObj();
globalObjInstance.init();
if(globalObjInstance.path === '/users/login'){
    var usersLogin = new globalObjInstance.UsersLogin(document.getElementById("userId").textContent);
    usersLogin.init();
}