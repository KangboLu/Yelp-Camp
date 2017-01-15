var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

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
});

// CREATE -- create new campground, POST route 
router.post("/", middleware.isLoggedIn, function (req, res) {
    // get data from the form
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    
    // create a new campground and save it to the Database
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            // redirect to the campgrounds route
            res.redirect("/campgrounds");
        }
    });
});

// NEW -- new campgrounds form, GET route
router.get("/new", middleware.isLoggedIn, function (req, res) {
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

// EDIT campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
        // find the campground with the requested id
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err)
                console.log(err);
            // parse foundCampground to the edit template and render it
            res.render("campgrounds/edit", {campground: foundCampground});
        });
});

// UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
   // find and update the correct campground
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
       // redirect to campground page or page with specific id
       if (err) {
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

// DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    // delete a campground with given id and redirect to camprgounds page
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// export the router module
module.exports = router;