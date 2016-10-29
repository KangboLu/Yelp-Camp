// import packages
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var campgrounds = [
    {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
    {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
    {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
    {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
    {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
    {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
    {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
    {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
    {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
];

// set up body-parser
app.use(bodyParser.urlencoded({extended: true}));
// set up the ejs view engine
app.set("view engine", "ejs");

// default route
app.get("/", function (req, res) {
    res.render("landing");
});



// campgrounds  GET route
app.get("/campgrounds", function (req, res) {
    res.render("campgrounds", {campgrounds: campgrounds});
});

// set up campground POST route
app.post("/campgrounds", function (req, res) {
    // get data from the form
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    
    // add the newCampground object to the campgrounds array
    campgrounds.push(newCampground);
    
    // redirect to the campgrounds route
    res.redirect("/campgrounds");
});

// new campgrounds route
app.get("/campgrounds/new", function (req, res) {
    res.render("new");
});

// set up the server
app.listen(process.env.PORT, process.env.IP, function () {
   console.log("The YelpCamp server is running at port: " + process.env.PORT); 
});