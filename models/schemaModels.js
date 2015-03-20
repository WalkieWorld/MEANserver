/**
 * Created by Hao Zhang on 3/20/15.
 */

var Models = function (){
    this.mongoose = require('mongoose');
    this.userCollection = "users";
    this.userSchema = new this.mongoose.Schema({ _id: Number, name: String, birthday: String });
}

Models.prototype = {
    get models(){
        return {
            UserSchema: this.mongoose.model(this.userCollection, this.userSchema)
        }
    }
}

module.exports = Models;
