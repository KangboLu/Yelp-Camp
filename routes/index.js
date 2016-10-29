var express = require("express");
var router = express.Router();
var passport = require("passport");
var User  = require("../models/user");

// default route
router.get("/", function (req, res) {
    res.render("landing");
});

// show register form
router.get("/register", function(req, res) {
    res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res) {
router// register an user from given request body
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user) {
        // callback details
        if (err) {
           console.log(err);
           return res.render("register");
       }
        // authenticate the given user
        passport.authenticate("local")(req, res, function () {
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login");
});

// handling login logic with passport middleware
router.post("/login", passport.authenticate("local",  
    {
        successRedirect: "/campgrounds",
        failureRedirect: "login"
    }), function(req, res) {
});

// log out route
router.get("/logout", function(req, res) {
   req.logout();
   res.redirect("/campgrounds");
});

// middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect("/login");
}

// export the router module
module.exports = router;