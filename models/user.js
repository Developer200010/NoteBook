const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/notepad");

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