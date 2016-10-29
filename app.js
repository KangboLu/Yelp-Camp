// import packages
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// set up the mongodb
mongoose.connect("mongodb://localhost:/yelp_camp");
// set up body-parser
app.use(bodyParser.urlencoded({extended: true}));
// set up the ejs view engine
app.set("view engine", "ejs");

// schema set up
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

// create campground model using the schema
var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Granite Hill", 
//         image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
//         description: "Beautiful Granite Hill Campground"
//     }, function (err, campground) {
//         if (err) {
//             console.log("SOMETHING WENT WRONG");
//             console.log(err);
//         } else {
//             console.log("NEWLY CREATED CAMPGROUND");
//             console.log(campground);
//         }
//     } 
// );

// var campgrounds = [
//     {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//     {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//     {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
//     {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//     {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//     {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
//     {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//     {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//     {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
// ];


// default route
app.get("/", function (req, res) {
    res.render("landing");
});

// INDEX -- view all campgrounds, GET route
app.get("/campgrounds", function (req, res) {
    // get all campgrounds data from Datebase
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds})
        }
    });
    // res.render("campgrounds", {campgrounds: campgrounds});
});

// CREATE -- create new campground, POST route 
app.post("/campgrounds", function (req, res) {
    // get data from the form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    
    // create a new campground and save it to the Database
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            // redirect to the campgrounds route
            res.redirect("/campgrounds");
        }
    });
    
    // // add the newCampground object to the campgrounds array
    // campgrounds.push(newCampground);
});

// NEW -- new campgrounds form, GET route
app.get("/campgrounds/new", function (req, res) {
    res.render("new");
});
 
// SHOW -- display info about a specific campground, GET route
app.get("/campgrounds/:id", function (req, res) {
    // find the campground with provided ID
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // render the show template with the foundCampground
            res.render("show", {campground: foundCampground});
        }
    });
});

// set up the server
app.listen(process.env.PORT, process.env.IP, function () {
   console.log("The YelpCamp server is running at port: " + process.env.PORT); 
});