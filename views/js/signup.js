var LocalStrategy = require('passport-local').Strategy
var IntermixUser = require('../../models/intermixuser')
var IntermixSkill = require('../../models/intermixskill')
var bCrypt = require('bcrypt-nodejs')
/*
 *  configure mail system
 */
var nodemailer = require('nodemailer')
var initEmail = require('./email.js')

module.exports = function (passport) {

    passport.use('signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, username, password, done) {
            findOrCreateUser = function () {
                // check availablity of username and email
                IntermixUser.findOne({
                    $or: [
                        { 'username': username },
                        { 'email': req.body.email }
                    ]
                }).exec(function (err, user) {
                    // any error
                    if (err) {
                        console.log('Error in signup')
                        return done(err)
                    }
                    // already exists
                    if (user) {
                        console.log('Account already exists')
                        return done(null, false, req.flash('message', 'User already exists'))
                    } else {
                        // create new user
                        var newUser = new IntermixUser();

                        newUser.username = username
                        newUser.password = createHash(password)
                        newUser.email = req.body.email
                        let num = parseInt('1');
                        //console.log(num)
                        if(req.body.skills) {
                            newUser.skills = req.body.skills.split(',')
                            req.body.skills.split(',').forEach(function(entry){
                                //console.log(entry)
                                IntermixSkill.findOne({ skillName: entry}, function(err, skill){
                                    if(err) console.log(err)
                                    else if(skill){
                                        IntermixSkill.update({ skillName: entry }, {$inc: { skillCount: parseInt(num)}}, function(err){
                                            if(err) console.log(err)
                                        })
                                    } else {
                                        newSkill = new IntermixSkill()
                                        newSkill.skillName = entry
                                        newSkill.skillCount = 1
                                        newSkill.save(function(err){
                                            if(err) console.log(err)
                                        })
                                    }
                                })
                            })
                        }

                        //save newUser
                        newUser.save(function (err) {
                            if (err) {
                                console.log('Error in saving new user: ' + err)
                                throw err
                            }
 				//initEmail(newUser.username,newUser.email,'Welcome to Intermix','Thank you for joining us '+newUser.username)
                            return done(null, newUser)
                        })
                    }
                })
            }
            // execute findOrCreate in next event loop
            process.nextTick(findOrCreateUser)
        })
    )

    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
    }

}
