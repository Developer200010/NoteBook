const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserRegister = async function (req, res) {
  let { username, email, password } = req.body;
  if ((!username, !email, !password)) res.redirect("/register");
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
      res.redirect("/user/home");
    });
  });
};

const UserLogin = async function (req, res) {
  let { email, password } = req.body;
  const user = await userModel.findOne({ email: email });
  if (!user) res.send("not found!");
  const userMatched = bcrypt.compare(
    password,
    user.password,
    function (err, result) {
      if (result) {
        const token = jwt.sign({ email: email, userId: user._id }, "shhhh");
        res.cookie("token", token);
        res.redirect("/user/home");
      } else {
        res.redirect("/login");
      }
    }
  );
};

const UserLogout = function (req, res) {
  res.cookie("token", "");
  res.redirect("/login");
};

module.exports = { UserRegister, UserLogin, UserLogout };
