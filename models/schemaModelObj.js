/**
 * Created by Hao Zhang on 3/20/15.
 */

var ModelObj = function (collection){
    this.mongoose = require('mongoose');
    this.userCollection = (
        collection === undefined
        ? "" : collection
    );
}

ModelObj.prototype = {
    User: {
        _id: Number,
        name: String,
        birthday: String,
        profession: Number
    },
    set setCollection(collection){
        this.userCollection = collection;
    },
    get usersModel(){
        return this.mongoose.model(this.userCollection, new this.mongoose.Schema(this.User));
    }
}

module.exports = ModelObj;
