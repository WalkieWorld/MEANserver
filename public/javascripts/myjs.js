/**
 * Created by Hao Zhang on 3/23/15.
 */

var GlobalObj = function(){
    //
}

GlobalObj.prototype = {
    init: function(){
        var path = window.location.pathname;
        console.log(path);
        switch (path){
            case '/':
            case '/login':
                break;
            case '/users/login':
                this.extend(this.usersLogin(), {
                    loginCallback: function(data){
                        "use strict"
                        var sessionObj = this.getSessionLogin;
                        if(sessionObj === null){
                            this.setSessionLogin = data;
                        }else{
                            this.runVerifySession(sessionObj.expire_time, sessionObj.period);
                        }
                    },
                    set setSessionLogin(sessionObj){
                        if(window.localStorage){
                            window.localStorage.setItem(this.userId, sessionObj);
                        }
                    },
                    get getSessionLogin(){
                        if(window.localStorage){
                            return JSON.parse(window.localStorage.getItem(this.userId));
                        }
                    },
                    verifySession: function(expireTime){
                        "use strict"
                        var now = new Date().getTime();
                        if(expireTime <= now){
                            clearInterval(this.verifySessionInterval);
                        }
                    },
                    runVerifySession: function(expireTime, period){
                        this.verifySessionInterval = setInterval(this.verifySession(expireTime), period);
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
    usersLogin: function(id){
        this.userId = id;
        this.verifySessionInterval = undefined;
    }
}

var globalObjInstance = new GlobalObj();
globalObjInstance.init();