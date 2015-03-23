/**
 * Created by Hao Zhang on 3/23/15.
 */

var GlobalObj = function(){
    //
}

GlobalObj.prototype = {
    init: function(){
        var btnSignUp = document.getElementById('btnSignUp');
        btnSignUp.addEventListener('click', function(e){
            var formSignUp = document.getElementById('formSignUp');
            formSignUp.submit();
        });
    }
}