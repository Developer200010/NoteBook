const express = require("express");
const route = express.Router();

route.get("/", function (req, res) {
    res.render("register");
})

route.get("/register",function (req, res) {
    res.render("register");
  });

 route.get("/login", function (req, res) {
    res.render("login");
  });
  
module.exports = route;