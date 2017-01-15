// all middlewares are here
var Campground = require("../models/campground");    
var Comment    = require("../models/comment");

// declare a empty middleware object
var middlewareObj = {};

// middleware to detect if the user is logged in
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    
    // send flash message for the next request if error
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

// middleware to check if the user has the campground ownership
middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        // find the campground with the requested id
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not found!");
                res.redriect("back");
            } else {
                // does the user own the campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        // send flash notification to user to log in first
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

// middleware to check if the user has the comment ownership
middlewareObj.checkCommentOwnership = function (req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        // find the campground with the requested id
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redriect("back");
            } else {
                // does the user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        // send flash notification to user to log in first
        req.flash("error", "You don't have permission to do that!");
        res.redirect("back");
    }
}

module.exports = middlewareObj;