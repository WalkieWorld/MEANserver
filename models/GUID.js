/**
 * Created by Hao zhang on 3/22/15.
 */

var GUID = function(){
    return {
        get getGUID(){
            "use strict"
            var part;
            var guid;
            for(var i = 0; i < 8; i++){
                part = (((1+Math.random())*0x10000)|0).toString(16).substring(1);
                switch (i){
                    case 0: guid = part;
                        break;
                    case 1: guid += part + "-";
                        break;
                    case 2: guid += part + "-4";
                        break;
                    case 3: guid += part.substr(0,3) + "-";
                        break;
                    case 4: guid += part + "-";
                        break;
                    case 5: guid += part;
                        break;
                    case 6: guid += part;
                        break;
                    case 7: guid += part;
                        break;
                }

            }
            return guid.toLowerCase();
        }
    }
}

module.exports = GUID;