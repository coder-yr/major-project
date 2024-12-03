const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose")

const UserSchema = new Schema({
    //passport local moongoose automatically add username and password no need to describe beow
  email : {
    type : String ,
    required : true
  }   
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);