var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
        {
            name: "Salmon Creek",
            image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg", 
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
        },
        {
            name: "Granite Hill", 
            image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
            
        },
        {
            name: "Mountain Goat's Rest", 
            image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg", 
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
        }
    ];

function seedDB() {
    // remove all campgrounds in the beginning
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
        console.log("Removed all campgrounds");
        }
        
        // add a few campgrounds
        data.forEach(function (seed) {
            Campground.create(seed, function (err, campground) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Add a new campgrounds");
                    // add a new comment
                    Comment.create({
                        text: "Here is great except no wifi",
                        author: "lu"
                    }, function (err, comment) {
                        if (err) {
                            console.log(err);
                        } else {
                            campground.comments.push(comment);
                            campground.save()
                            console.log("Created a new comment")
                        }
                    });
                }
            });
        });
    }); 
    
    // add a few comments
}

module.exports = seedDB;
