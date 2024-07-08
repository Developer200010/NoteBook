const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const userModel = require("./models/user.js");
const postModel = require("./models/posts.js");
const upload = require("./config/multerConfig.js");
const user = require("./models/user.js");
require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
// app.set('views', path.join(__dirname, 'components'));


app.use(express.static(path.join(__dirname, "public")));


app.get("/home", isLoggedIn, async function (req, res) {
  const user = await userModel
    .findOne({ email: req.user.email })
    .populate("posts");
  res.render("home", { user });
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/", function (req, res) {
  res.render("register");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/create", async function (req, res) {
  let { username, email, password } = req.body;
    // if(!username,!email,!password) res.redirect("/register");
  const user = await userModel.findOne({ email });
  // if (user) res.send("already exist");
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      const user = await userModel.create({
        username,
        email,
        password: hash,
      });
      const token = jwt.sign({ email: email, userId: user._id }, "shhhh");
      res.cookie("token", token);
      res.redirect("/home");
    });
  });
});

app.post("/login", async function (req, res) {
  let { email, password } = req.body;
  const user = await userModel.findOne({ email: email });
  if (!user) res.send("not found!");
  const userMatched = bcrypt.compare(
    password,
    user.password,
    function (err, result) {
      console.log(result);
      if (result) {
        const token = jwt.sign({ email: email, userId: user._id }, "shhhh");
        res.cookie("token", token);
        res.redirect("/home");
      } else {
        res.redirect("/login");
      }
    }
  );
});

app.post("/post", isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({ email: req.user.email });
  let { content } = req.body;
  console.log(content + " content");
  const post = await postModel.create({
    user: user._id,
    content,
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/home");
});

app.get("/like/:id", isLoggedIn, async function (req, res) {
  const post = await postModel.findOne({ _id: req.params.id }).populate("user");
  // console.log(post);
  if (post.like.indexOf(req.user.userId) === -1) {
    post.like.push(req.user.userId);
  } else {
    post.like.splice(post.like.indexOf(req.user.userId, 1));
  }
  await post.save();
  res.redirect("/home");
});

app.get("/edit/:id", isLoggedIn, async function (req, res) {
  const post = await postModel.findOne({ _id: req.params.id }).populate("user");
  console.log(post);
  res.render("edit", { post });
});

app.post("/update/:id", isLoggedIn, async function (req, res) {
  const post = await postModel.findOneAndUpdate(
    { _id: req.params.id },
    { content: req.body.content },
    { new: true }
  );
  res.redirect("/home");
});

app.get("/delete/:id", isLoggedIn, async function (req, res) {
  const post = await postModel.findOneAndDelete({ _id: req.params.id });
  res.redirect("/home");
});

app.get("/upload",isLoggedIn, function (req, res) {
  res.render("profileUpload");
});

app.post("/uploaded",isLoggedIn, upload.single("image"), async function (req, res) {
  // console.log(req.file);
  const user = await userModel.findOne({email:req.user.email});
  user.profilePic = req.file.filename;
  await user.save();
  res.redirect("/home");
});
// creating protected route code

function isLoggedIn(req, res, next) {
  if (req.cookies.token === "") res.redirect("/login");
  else {
    let data = jwt.verify(req.cookies.token, "shhhh");
    req.user = data;
  }
  next();
}

app.get("/logout", function (req, res) {
  res.cookie("token", "");
  res.redirect("/login");
});

app.listen(8080, function () {
  console.log("server is running well");
});
