const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("db is connected successfully"))
.catch((error)=> console.log(error));


module.exports = mongoose.connection;