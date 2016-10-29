var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Show new comments route
router.get("/new", isLoggedIn, function (req, res) {
    // find campground by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});     
        }
    });
});

// post new comments route
router.post("/", isLoggedIn, function (req, res) {
   // look up campground by ID
   Campground.findById(req.params.id, function (err, campground) {
       if (err) {
           console.log(err);
           res.redirect("/campgrounds");
       } else {
          // create a new comment
          Comment.create(req.body.comment, function (err, comment) {
              if (err) {
                  console.log(err);
              } else {
                  // add username and id to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  
                  // save comment
                  comment.save();
                  
                  // connect new comment to campground
                  campground.comments.push(comment);
                  campground.save();
                  
                  // redirect to the SHOW route
                  res.redirect('/campgrounds/' + campground._id);
              }
          });
       }
   });
});

// middleware to detect if the user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect("/login");
}

// export the router module
module.exports = router;