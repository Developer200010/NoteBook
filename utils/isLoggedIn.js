const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
    if (req.cookies.token === "") res.redirect("/login");
    else {
      let data = jwt.verify(req.cookies.token, "shhhh");
      req.user = data;
    }
    next();
  }

module.exports = isLoggedIn;