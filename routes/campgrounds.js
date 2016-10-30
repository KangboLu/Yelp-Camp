var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

// INDEX -- view all campgrounds, GET route
router.get("/", function (req, res) {
    // get all campgrounds data from Datebase
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
    // res.render("campgrounds", {campgrounds: campgrounds});
});

// CREATE -- create new campground, POST route 
router.post("/", isLoggedIn, function (req, res) {
    // get data from the form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author: author};
    
    // create a new campground and save it to the Database
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            // redirect to the campgrounds route
            console.log(newlyCreated); // debug
            res.redirect("/campgrounds");
        }
    });
});

// NEW -- new campgrounds form, GET route
router.get("/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});
 
// SHOW -- display info about a specific campground, GET route
router.get("/:id", function (req, res) {
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            // render the show template with the foundCampground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect("/login");
}

// express the router module
module.exports = router;