// import packages
var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");

// requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require('./routes/index');
    
// set up the mongodb
mongoose.connect("mongodb://localhost:/9");
// set up body-parser
app.use(bodyParser.urlencoded({extended: true}));
// set up the ejs view engine
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// seedBD for testing
// seedDB();

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

// set up routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// set up the server
app.listen(process.env.PORT, process.env.IP, function () {
   console.log("The YelpCamp server is running at port: " + process.env.PORT); 
});