const express = require("express");
const route = express.Router();
const postModel = require("../models/posts.js");
const userModel = require("../models/user.js");
const isLoggedIn = require("../utils/isLoggedIn.js");
const upload = require("../config/multerConfig.js");

route.get("/home", isLoggedIn, async function (req, res) {
  const user = await userModel
    .findOne({ email: req.user.email })
    .populate("posts");
  res.render("home", { user });
});

route.get("/upload", isLoggedIn, function (req, res) {
  res.render("profileUpload");
});

route.post("/post", isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({ email: req.user.email });
  let { content } = req.body;
  const post = await postModel.create({
    user: user._id,
    content,
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/user/home");
});

route.get("/like/:id", isLoggedIn, async function (req, res) {
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

route.get("/edit/:id", isLoggedIn, async function (req, res) {
  const post = await postModel.findOne({ _id: req.params.id }).populate("user");
  res.render("edit", { post });
});

route.post("/update/:id", isLoggedIn, async function (req, res) {
  const post = await postModel.findOneAndUpdate(
    { _id: req.params.id },
    { content: req.body.content },
    { new: true }
  );
  res.redirect("/user/home");
});

route.post(
  "/uploaded",
  isLoggedIn,
  upload.single("image"),
  async function (req, res) {
    // console.log(req.file);
    const user = await userModel.findOne({ email: req.user.email });
    user.profilePic = req.file.filename;
    await user.save();
    res.redirect("/user/home");
  }
);

route.get("/delete/:id", isLoggedIn, async function (req, res) {
  const post = await postModel.findOneAndDelete({ _id: req.params.id });
  res.redirect("/user/home");
});

//simple route

module.exports = route;
