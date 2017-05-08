var LocalStrategy = require('passport-local').Strategy
var User = require('../../models/intermixuser.js')
var bCrypt = require('bcrypt-nodejs')

module.exports = function (passport) {
    
    passport.use('login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, username, password, done) {
            // Check if username exists
            // console.log("passportlogin.js")
            User.findOne({ 'username': username }, function (err, user) {
                if (err) return done(err)
                // Username does not exist
                if (!user) {
                    console.log('Incorrect Username')
                    return done(null, false, req.flash('message', 'User not found'))
                }
                // Password is wrong
                if (!isValidPassword(user, password)) {
                    console.log('Incorrect Password')
                    return done(null, false, req.flash('message', 'Invalid Password'))
                }
                // if both are correct return user
                // console.log('returning user')
                return done(null, user)
            })
        }))

    var isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password)
    }
}
