var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Rating = new Schema({
    ratingbyUsername: String,
    ratingForUsername: String,
    rating: { type: Number, default: 0 },
    comments: String
})

var IntermixRating = mongoose.model('IntermixRating', Rating)

module.exports = IntermixRating