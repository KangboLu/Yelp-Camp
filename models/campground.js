var mongoose = require("mongoose");

// schema set up
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// create campground model using the schema and export it
module.exports = mongoose.model("Campground", campgroundSchema);

