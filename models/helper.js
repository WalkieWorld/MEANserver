/**
 * Created by HZ on 3/28/15.
 */

var helperObj = {
    isEmpty: function(obj){
        if (obj == null) return true;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        for (var e in obj) {
            if (obj.hasOwnProperty(e)) return false;
        }

        return true;
    }
}

module.exports = helperObj;