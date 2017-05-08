var mongoose = require('mongoose')
var Schema = mongoose.Schema

var User = new Schema({
    username: {
        type: String,
        required: true
    },
    password: { 
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    skills: [ String ],
    userCount: { type: Number, default: 0 },
    userRatingCount: { type: Number, default: 0 },
    userRatingTotal: { type: Number, default: 0 }
})

var IntermixUser = mongoose.model('IntermixUser', User)

module.exports = IntermixUser