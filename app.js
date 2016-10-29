// import packages
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

// set up the mongodb
mongoose.connect("mongodb://localhost:/yelp_camp_v6");
// set up body-parser
app.use(bodyParser.urlencoded({extended: true}));
// set up the ejs view engine
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// seedBD for testing
seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Everything is awesome",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware for currentUser
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

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
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
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
    res.render("campgrounds/new");
});
 
// SHOW -- display info about a specific campground, GET route
app.get("/campgrounds/:id", function (req, res) {
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
// ================================
//         COMMENT ROUTES
// ================================
app.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
    // find campground by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});     
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
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

// ======================
//  Authentication Routes
// ======================

// show register form
app.get("/register", function(req, res) {
    res.render("register");
});

// handle sign up logic
app.post("/register", function(req, res) {
    // register an user from given request body
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
app.get("/login", function(req, res) {
    res.render("login");
});

// handling login logic with passport middleware
app.post("/login", passport.authenticate("local",  
    {
        successRedirect: "/campgrounds",
        failureRedirect: "login"
    }), function(req, res) {
});

// log out route
app.get("/logout", function(req, res) {
   req.logout();
   res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect("/login");
}

// set up the server
app.listen(process.env.PORT, process.env.IP, function () {
   console.log("The YelpCamp server is running at port: " + process.env.PORT); 
});