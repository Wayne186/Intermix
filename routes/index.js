var express = require('express')
var router = express.Router()
var IntermixUser = require('../models/intermixuser')
var IntermixProject = require('../models/intermixproject')
var IntermixSkill = require('../models/intermixskill')
var IntermixConversation = require('../models/intermixconversation')
var Chat = require('../views/js/chat')
var bCrypt = require('bcrypt-nodejs')
var LocalStrategy = require('passport-local').Strategy
var nodemailer = require('nodemailer')
var initEmail = require('../views/js/email.js')
var IntermixRating = require('../models/intermixrating')
var IntermixSkill = require('../models/intermixskill')

/*
 *  Checks that user is real and logged in
 */
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect('/')
}

/*
 *  Hashes password
 */
var createHash = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
}

module.exports = function (passport) {

  /*  Login/Logout & User Creation Page */

  /*
   *  Load Login/Create account page
   * 
   *  URL: __env.sourceURL 
   */
  router.get('/', function (req, res) {
    res.render('login.ejs')
  })

  /*
   *  Creates user in database
   * 
   *  URL: __env.signupURL = '/signup/'
   */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash: true
  }))

  /*
   *  Login user with given credentials
   *  Create session for user
   * 
   *  URL: __env.loginURL
   */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash: true
  }))

  /*
   *  Logs out user
   * 
   *  URL: __env.logoutURL
   */
  router.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/')
  })

  /*  Home Page */

  /*
   *  Load home page
   * 
   *  URL: __env.homeURL
   */
  router.get('/home', isAuthenticated, function (req, res) {
    res.render('../views/home', { user: req.user })
  })

  /*
   *  Returns all projects in the database
   * 
   *  URL: __env.getAllProjectsURL
   */
  router.get('/getAllProjects', isAuthenticated, function (req, res) {
    IntermixProject.find({}, function (err, projects) {
      if (err) {
        console.log("Error: Get All Projects");
      } else if (!projects) {
        console.log("Error: No Projects")
      } else {
        return res.end(JSON.stringify(projects))
      }
    }).sort({ _id: 'desc' }).lean()
  })

  /*
   *  Verifies project count for user in past 7 days is < 7
   *  Creates a project in database
   * 
   *  URL: __env.createProjectURL
   */
  router.post('/createProject', isAuthenticated, function (req, res) {
    IntermixProject.count({
      $and: [
        { projectLeader: req.user.username },
        {
          $where: function () {
            return Date.now() - this._id.getTimestamp() < (7 * 24 * 60 * 60 * 1000)
          }
        }
      ]
    }, function (err, amt) {
      if (amt < 7) {
        IntermixProject.findOne({ projectName: req.body.projectName }, function (err, proj) {
          if (err) {
            console.log("Error: Create Project")
          } else if (proj) {
            //console.log("Error: Project exists")
            res.status(302).json({ message: 'Project Exists' })
          } else {
            var newProj = new IntermixProject()

            newProj.projectLeader = req.user.username
            newProj.projectLeaderEmail = req.user.email
            newProj.projectName = req.body.projectName
            newProj.projectDescription = req.body.projectDescription
            if (req.body.projectSkills) {
              newProj.projectSkills = req.body.projectSkills.split(',')
            }
            newProj.createdAt = new Date();

            newProj.save(function (err) {
              if (err) {
                console.log('Error: Creating Project')
                throw err
              }else {
                IntermixUser.update({ username: req.user.username }, { $inc: { userCount: 1 } }, function (err) 
                {
                      if (err) 
                    {
                    console.log("Error: Updating user count")

                      }
                })
              }
              //console.log(newProj)
              res.status(200).json({ message: 'Project Created' })
            })
          }
        })
      } else {
        res.status(200).json({ message: 'Exceeded Project Limit' })
      }
    })
  })

  /*
  *  Adds user to project teamMembers
  * 
  *  URL: __env.applyURL
  */
  router.post('/apply', isAuthenticated, function (req, res) {
    IntermixProject.findOne({ 
      projectName: req.body.projectName, 
      teamMembers: req.user.username 
    }, function (err, user) {
      if (err) {
        console.log("Error: Apply Project")
      } else if (user) {
        console.log("Error: User already part of project")
        res.status(302).json({ message: 'Already in project'})
      } else {
        IntermixProject.update({ projectName: req.body.projectName }, { $push: { teamMembers: req.user.username }}, function (err) {
          if (err) {
            console.log("Error: Apply Project")
          } else {
            IntermixUser.update({ username: req.user.username }, { $inc: { userCount: 1 } }, function (err) {
              if (err) {
                console.log("Error: Updating user count")
              }
            })
            // email project lead
            initEmail(req.body.projectLeader, req.body.projectLeaderEmail, req.user.username + ' has joined your 							project', 'Good luck!')
            // email user who joined project
            initEmail(req.user.username, req.user.email, 'Welcome to project ' + req.body.projectName, 'Welcome to 							the team!')
            res.status(200).json('Applied to project')
          }
        })
      }
    })
  })

  /*  Current User Profile Page */

  /*
   *  Load current user profile page
   * 
   *  URL: __env.myProfileURL
   */
  router.get('/myProfile', isAuthenticated, function (req, res) {
    res.render('../views/profile')
  })

  /*
   *  Returns all projects in which the current user is teamLeader or teamMember
   * 
   *  URL: __env.myProjectsURL
   */
  router.get('/myProjects', isAuthenticated, function (req, res) {
    IntermixProject.find({
      $or: [
        { 'projectLeader': req.user.username },
        { 'teamMembers': req.user.username }
      ]
    }, function (err, projects) {
      if (err) console.log(err)
      else
        return res.end(JSON.stringify(projects))
    }).sort({ createdAt: 'desc' }).lean()
  })

  /*
   *  Returns user info
   * 
   *  URL: __env.getUserURL
   */
  router.get('/getUser', isAuthenticated, function (req, res) {
    IntermixUser.find({ username: req.user.username }, function (err, user) {
      if (err) {
        console.log("Error: Getting User");
      } else if (!user) {
        console.log("Error: No User")
      } else {
        return res.end(JSON.stringify(user))
      }
    }).lean()
  })

  /*
   *  Updates user in database
   * 
   *  URL: __env.updateUserURL
   */
  router.post('/updateUser', isAuthenticated, function (req, res) {
    // console.log("Update user req.body: " + JSON.stringify(req.body))
    if (req.body.password) {
      IntermixUser.update({ username: req.user.username }, { $set: { password: createHash(req.body.password) } }, function (err) {
        if (err) {
          console.log(err)
          res.status(500).json({ message: 'Failed to update password' })
        }
      })
    }

    if (req.body.skills) {
      IntermixUser.update({ username: req.user.username }, { $set: { skills: req.body.skills.split(',') } }, function (err) {
        if (err) {
          console.log("Error: Updating User")
          res.status(500).json({ message: 'Failed to update skills' })
        }
      })

      let num = 1
      IntermixUser.findOne({ username: req.user.username }, function (err, usr) {
        if (usr) {
          //console.log(usr)
          usr.skills.forEach(function (entry) {
            IntermixSkill.findOne({ skillName: entry }, function (err, skill) {
              if (err) console.log(err)
              else if (skill) {
                IntermixSkill.update({ skillName: entry }, { $inc: { skillCount: parseInt(num) } }, function (err) {
                  if (err) console.log(err)
                })
              } else {
                newSkill = new IntermixSkill()
                newSkill.skillName = entry
                newSkill.skillCount = 1
                newSkill.save(function (err) {
                  if (err) console.log(err)
                })
              }
            })
          })
        }
      })
    }
    res.status(200).json({ message: 'Updated User' })
  })

  /*
   *  Returns project info
   * 
   *  URL: __env.getProjectURL
   */
  router.get('/getProject', isAuthenticated, function (req, res) {
    IntermixProject.find({ projectName: req.body.projectName }, function (err, proj) {
      if (err) {
        console.log("Error: Getting Project");
      } else if (!proj) {
        console.log("Error: Project does not exist")
      } else {
        return res.end(JSON.stringify(proj))
      }
    }).lean()
  })

  /*
   *  Updates project in database
   * 
   *  URL: __env.updateProjectURL
   */
  router.post('/updateProject', function (req, res) {
    IntermixProject.update({ projectName: req.body.projectName }, { $set: { projectDescription: req.body.projectDescription, projectSkills: req.body.projectSkills } }, function (err) {
      if (err) console.log("Error: Updating Project")
    })
  })

  /*  Foreign User Profile Page */

  /*
   *  Load foreign user page
   * 
   *  URL: __env.findUserURL
   */
  router.get('/findUser', isAuthenticated, function (req, res) {
    res.render('../views/user')
  })

  /*
   *  Returns foreign user info
   * 
   *  URL: __env.getForeignUserURL
   */
  router.post('/getForeignUser', isAuthenticated, function (req, res) {
    IntermixUser.find({ username: req.body.username }, function (err, usr) {
      if (err) console.log("Error: Get user information");
      else if (!usr) console.log("Error: No user exists")
      else return res.end(JSON.stringify(usr))
    })
  })

  /*
   *  Returns foreign user project
   * 
   *  URL: __env.getForeignUserProjectsURL
   */
  router.post('/getForeignUserProjects', isAuthenticated, function (req, res) {
    console.log(req.body.username);
    IntermixProject.find({
      $or: [
        { 'projectLeader': req.body.username },
        { 'teamMembers': req.body.username }
      ]
    }, function (err, projects) {
      if (err) console.log(err)
      else
        return res.end(JSON.stringify(projects))
    }).sort({ createdAt: 'desc' }).lean()
  })

  /*
   *  Adds rating to foreign user
   * 
   *  URL: __env.submitRatingURL
   */

  /*
 router.post('/submitRating', isAuthenticated, function (req, res) {
   IntermixUser.update({ username: req.user.username }, { $set: { ratingsCount: req.body.ratings, ratingsCount: req.body.ratingsCount } }, function (err) {
     if (err) console.log(err)
   })
 })*/

  /*  Messaging Page  */

  /*
   *  Loads messages page
   * 
   *  URL: __env.messagesURL
   */
  router.get('/messages', isAuthenticated, function (req, res) {
    res.render('../views/messages')
  })

  /*
   *  Load all conversations
   * 
   *  URL: __env.loadAllConversations
   */
  router.get('/loadAllConversations', isAuthenticated, Chat.loadAllConversations)

  /*
   *  Load a conversation
   * 
   *  URL: __env.loadConversation
   */
  router.get('/loadConversation', isAuthenticated, Chat.loadConversation)

  /*
   *  Send a reply
   * 
   *  URL: __env.sendReply
   */
  router.post('/sendReply', isAuthenticated, Chat.sendReply)

  /*
   *  Create a conversation
   * 
   *  URL: __env.createConversation
   */
  router.post('/createConversation', isAuthenticated, Chat.createConversation)

  /*  About Page  */

  /*
   *  Load about page
   * 
   *  URL: __env.aboutURL
   */
  router.get('/about', isAuthenticated, function (req, res) {
    res.render('../views/about')
  })

  /*
   *  Sends email to intermix
   * 
   *  URL: 
   */
  router.post('/submitFeedback', isAuthenticated, function (req, res) {
    //initEmail('Admin', 'intermixservices@gmail.com', 'Feedback from ' + req.body.username, 'Email ' + req.body.email + ' Feedback ' + req.body.feedback)
  })

  /*  Ban User/Project  Page  */

  /*
   *  Load ban page
   */
  router.get('/ban', isAuthenticated, function (req, res) {
    if (req.user.username === 'admin') {
      res.render('../views/ban')
    } else {
      res.redirect('/home')
    }
  })

  /*
   *  Remove user from database
   * 
   *  URL: __env.banUserURL
   */
  router.post('/banUser', isAuthenticated, function (req, res) {
    IntermixUser.remove({ username: req.body.username }, function (err) {
      if (err) console.log(err)
    })
  })

  /*
   *  Remove project from database
   * 
   *  URL: __env.banProjectURL
   */
  router.post('/banProject', isAuthenticated, function (req, res) {
    IntermixProject.remove({ projectName: req.body.projectName }, function (err) {
      if (err) console.log(err)
    })
  })

  /*
   *  Remove user from project
   * 
   *  URL: __env.removeUserURL
   */
  // remove a user from a project
  router.post('/removeUser', function (req, res) {
    console.log('Removing user ' + req.body.teamMember)
    IntermixProject.update({ projectName: req.body.projectName }, { $pull: { teamMembers: req.body.teamMember } }, function (err, proj) {
      if (err) console.log("problem removing user from project" + err)
      else {	//sends user bad news
        // sends admin information about user removal 
        initEmail('Admin', 'intermixservices@gmail.com', 'User removed from project' + req.body.projectName, 'User ' + req.body.teamMember + ' removed by ' + req.body.projectLeader)
        //decrements user couunt
        IntermixUser.update({ username: req.body.teamMember }, { $inc: { userCount: -1 } }, function (err) {
          if (err) {
            console.log("Error: Updating user count")
          }
        })
      }
    })
  })

  router.post('/submitRating', isAuthenticated, function (req, res) {
    //console.log('saving rating...')
    IntermixRating.findOne({ ratingbyUsername: req.user.username, ratingForUsername: req.body.ratingForUsername }, function (err, rating) {
      console.log('stuff' + req.body)
      if (err) {
        console.log(err)
      } else if (rating) {
        console.log(rating)
        console.log("Rating exists")
      } else {
        var newRating = new IntermixRating()
        newRating.ratingbyUsername = req.user.username
        newRating.ratingForUsername = req.body.ratingForUsername
        newRating.rating = req.body.rating
        newRating.comments = req.body.comments
        newRating.save(function (err) {
          if (err) {
            console.log('Error in saving rating: ' + err)
            throw err
          }
          else {
            //increments user couunt
            IntermixUser.update({ username: req.body.ratingForUsername }, { $inc: { userRatingCount: 1, userRatingTotal: req.body.rating } }, function (err) {
              if (err) {
                console.log("Error: Updating rating")
              }

            })
          }
        })
      }
    })

  })

  /*
   *  Returns ratings for a specified user
   * 
   *  
   */
  router.post('/getrating', isAuthenticated, function (req, res) {
    console.log(JSON.stringify(req.body.username));
    IntermixRating.find({ ratingForUsername: req.body.username }, function (err, rating) {
      if (err) {
        console.log("Error: Getting ratings");
      } else if (!rating) {
        console.log("Error: Project does not exist")
      } else {
        return res.end(JSON.stringify(rating))
      }
    }).lean()
  })

  /*
    router.get('/getrating', isAuthenticated, function (req, res) {
      IntermixRating.find({ ratingForUsername: req.body.username }, function (err, rating) {
        if (err) {
          console.log("Error: Getting Project");
        } else if (!rating) {
          console.log("Error: Project does not exist")
        } else {
          return res.end(JSON.stringify(rating))
        }
      }).lean()
    })
  */

  /*  Analytic  Page  */

  /*
   *  Load analytic page
   */
  router.get('/analytic', isAuthenticated, function (req, res) {
    if (req.user.username === 'admin') {
      res.render('../views/analytic')
    } else {
      res.redirect('/home')
    }
  })

  /*
  *  Returns number of team members in each project
  * 
  *  URL: __env.getProjectStatURL
  */
  router.get('/getProjectAnalytic', isAuthenticated, function (req, res) {
    IntermixProject.aggregate([{ $project: { item: 1, numberOfMembers: { $size: '$teamMembers' }, 'projectName': '$projectName' } }, { $sort: { numberOfMembers: -1 } }], function (err, proj) {
      if (err) {
        console.log("Error: Getting Projects and memebr counts");
      } else if (!proj) {
        console.log("Error: Project does not exist")
      } else {
        return res.end(JSON.stringify(proj))
      }
    })
  })



  /*
*  Returns all users in the database
* 
*  URL: __env.getAllUsersURL
*/
  router.get('/getAllUsers', isAuthenticated, function (req, res) {
    IntermixUser.find({}, function (err, users) {
      if (err) {
        console.log("Error: Get All users");
      } else if (!users) {
        console.log("Error: No Users")
      } else {
        return res.end(JSON.stringify(users))
      }
    }).sort({ userCount: -1 }).lean()
  })

  /*
    *  Returns all skills and counts
    * 
    *  URL: __env.myProjectsURL
    */
  router.get('/skillanly', isAuthenticated, function (req, res) {
    IntermixSkill.find({}
         , function (err, skills) {
      if (err) console.log(err)
      else
      {
        //console.log('data '+skills)
        return res.end(JSON.stringify(skills))
          }
    })
  })


  return router

}