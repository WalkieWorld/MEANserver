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
    usersLogin: function(){}
}

var globalObjInstance = new GlobalObj();
globalObjInstance.init();