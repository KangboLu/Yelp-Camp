var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");
var middleware  = require("../middleware");

// Show new comments route
router.get("/new", middleware.isLoggedIn, function (req, res) {
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
router.post("/", middleware.isLoggedIn, function (req, res) {
   // look up campground by ID
   Campground.findById(req.params.id, function (err, campground) {
       if (err) {
           console.log(err);
           res.redirect("/campgrounds");
       } else {
          // create a new comment
          Comment.create(req.body.comment, function (err, comment) {
              if (err) {
                  req.flash("error", "Something went wrong!");
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
                  
                  // redirect to the SHOW router
                  req.flash("success", "Successfully added comment!");
                  res.redirect('/campgrounds/' + campground._id);
              }
          });
       }
   });
});

// edit comment route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    // found the comment by requested id
   Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
          res.redirect("back");
      } else {
          // if found, render the edit form and parse the campground and comment object
          res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
      }
   });
});

// update comment route
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    // find comment with given requested comment_id and update the comment
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
       if (err) {
           res.redirect("back");
       } else {
           // redirect to the show page for the campsite
           res.redirect("/campgrounds/" + req.params.id);
       }
   }); 
});

// comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    // find the given comment with id and remove it from database
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            // show flash message and redirect to show if successfully deleted 
            req.flash("success", "Comment deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// export the router module
module.exports = router;