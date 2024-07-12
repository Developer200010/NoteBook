const express = require("express");
const route = express.Router();
const {UserRegister, UserLogin, UserLogout} = require("../controllers/authController.js")

route.post("/register", UserRegister);

route.post("/login", UserLogin);

route.get("/logout", UserLogout)

module.exports = route;