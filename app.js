const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const userModel = require("./models/user.js");
const isLoggedIn = require("./utils/isLoggedIn.js")

require('./config/mongdb-connection.js');
// route

const userRoute = require("./routes/userRoute.js");
const userPost = require("./routes/postRoute.js");
const indexRoute = require("./routes/index.js");

require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
// app.set('views', path.join(__dirname, 'components'));


app.use(express.static(path.join(__dirname, "public")));


app.use("/user", userPost);

app.get("/register", indexRoute);

app.use("/", indexRoute);

app.get("/login", indexRoute);

app.get("/upload", userPost);

// change route

app.use("/user", userRoute);

app.use("/user", userRoute);

app.use("/user",userPost)

app.use("/user", userPost);

app.use("user", userPost)

app.use("/user", userPost);

app.use("/user", userPost)

app.use("/user", userPost);

app.use("/logout", userRoute);


app.listen(process.env.PORT || 8080, function () {
  console.log("server is running well");
});
