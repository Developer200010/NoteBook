require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("db is connected successfully"))
.catch((error)=> console.log(error));
console.log(process.env.MONGO_URL);

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