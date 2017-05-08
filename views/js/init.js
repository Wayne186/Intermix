var passportlogin = require('./login')
var passportsignup = require('./signup')
var IntermixUser = require('../../models/intermixuser')

module.exports = function (passport) {
    // serialize and deserialize are needed for persistent sessions
    passport.serializeUser(function (user, done) {
        done(null, user._id)
    })

    passport.deserializeUser(function (id, done) {
        IntermixUser.findById(id, function (err, user) {
            // console.log('deserializing user: ' + user)
            done(err, user)
        })
    })

    // setting up strategies for login and signup
    passportlogin(passport)
    passportsignup(passport)
}