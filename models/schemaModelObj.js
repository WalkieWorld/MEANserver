/**
 * Created by Hao Zhang on 3/20/15.
 */

var ModelObj = function (collection){
    this.mongoose = require('mongoose');
    this.collection = (
        collection === undefined
        ? "" : collection
    );
    this.userSchema = new this.mongoose.Schema(this.User);
    this.loginHistorySchema = new this.mongoose.Schema(this.LoginHistory);
}

ModelObj.prototype = {
    User: {
        _id: Number,
        name: String,
        birthday: String,
        profession: Number
    },
    LoginHistory:{
        _id: {type: require('mongoose').Schema.Types.ObjectId, auto: true},
        user_id: Number,
        time: String,
        session: String,
        period: String
    },
    set setCollection(collection){
        this.collection = collection;
    },
    get usersModel(){
        return this.mongoose.model(this.collection, this.userSchema);
    },
    get loginHistoryModel(){
        return this.mongoose.model(this.collection, this.loginHistorySchema);
    }
}

module.exports = ModelObj;
