require("dotenv").config();
const mongoose = require("mongoose");



const userSchema = mongoose.Schema({
    username: String,
    email:String,
    password:String,
    profilePic:{
      type:String,
      default:"profile.png",
    },
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"post"
    }]
});

module.exports = mongoose.model("user", userSchema);