var should = require('should');
var mongoose = require('mongoose');
var User = require("../models/intermixuser.js");
var Project = require("../models/intermixproject.js");
var Skill = require("../models/intermixskill.js");
var server = require('../server.js')
var request = require('supertest')(server)
var index = require('../routes/index.js')

var cookies = []

describe('Create Users', function () {
    before(function (done) {
        User.remove({}, done)
    })

    describe('#User.create()', function (done) {
        it('should create user admin', function (done) {
            request.post('/signup')
                .send({
                    username: 'admin',
                    password: 'admin',
                    email: 'intermixservices@gmail.com',
                    skills: ''
                })
                .expect(302)
                .end(function (err, res) {
                    res.text.should.containEql('Redirecting to /home')
                    done(err)
                })
        })

        it('should create user bobm1267', function (done) {
            request.post('/signup')
                .send({
                    username: 'bobm1267',
                    password: 'bobm1267',
                    email: 'bobm1267@yahoo.com',
                    skills: 'Graphic Design, Adobe Illustrator, Adobe Photoshop'
                })
                .expect(302)
                .end(function (err, res) {
                    res.text.should.containEql('Redirecting to /home')
                    done(err)
                })
        })

        it('should create user jane_rhoads', function (done) {
            request.post('/signup')
                .send({
                    username: 'jane_rhoads',
                    password: 'jane_rhoads',
                    email: 'jane_rhoads@aol.com',
                    skills: 'C/C++, Java, node.js, angularjs'
                })
                .expect(302)
                .end(function (err, res) {
                    res.text.should.containEql('Redirecting to /home')
                    done(err)
                })
        })

        it('should create user joshscott05', function (done) {
            request.post('/signup')
                .send({
                    username: 'joshscott05',
                    password: 'joshscott05',
                    email: 'joshscott05@outlook.com',
                    skills: 'Accounting, Business Intelligence, Marketing, Public Speaking, Sales, Time Management, Finance, Decision Making, Conflict Resolution, Business Storytelling'
                })
                .expect(302)
                .end(function (err, res) {
                    res.text.should.containEql('Redirecting to /home')
                    done(err)
                })
        })

        it('should create user danfeilds', function (done) {
            request.post('/signup')
                .send({
                    username: 'danfeilds',
                    password: 'danfeilds',
                    email: 'danfeilds@zoho.com',
                    skills: 'C/C++, Operating Systems, Compilers, Computer Architecture'
                })
                .expect(302)
                .end(function (err, res) {
                    res.text.should.containEql('Redirecting to /home')
                    done(err)
                })
        })
    })
})

describe('Login Users & Create Sessions', function () {
    describe('#User.login()', function () {
        it('should login & create session for admin', function (done) {
            request.post('/login')
                .send({
                    username: 'admin',
                    password: 'admin'
                })
                .expect(302)
                .end(function (err, res) {
                    res.text.should.containEql('Redirecting to /home')
                    cookies.push(res.header['set-cookie'])
                    done(err)
                })
        })

        it('should login & create session for bobm1267', function (done) {
            request.post('/login')
                .send({
                    username: 'bobm1267',
                    password: 'bobm1267'
                })
                .expect(302)
                .end(function (err, res) {
                    res.text.should.containEql('Redirecting to /home')
                    cookies.push(res.header['set-cookie'])
                    done(err)
                })
        })

        it('should login & create session for jane_rhoads', function (done) {
            request.post('/login')
                .send({
                    username: 'jane_rhoads',
                    password: 'jane_rhoads'
                })
                .expect(302)
                .end(function (err, res) {
                    res.text.should.containEql('Redirecting to /home')
                    cookies.push(res.header['set-cookie'])
                    done(err)
                })
        })

        it('should login & create session for joshscott05', function (done) {
            request.post('/login')
                .send({
                    username: 'joshscott05',
                    password: 'joshscott05'
                })
                .expect(302)
                .end(function (err, res) {
                    res.text.should.containEql('Redirecting to /home')
                    cookies.push(res.header['set-cookie'])
                    done(err)
                })
        })

        it('should login & create session for danfeilds', function (done) {
            request.post('/login')
                .send({
                    username: 'danfeilds',
                    password: 'danfeilds'
                })
                .expect(302)
                .end(function (err, res) {
                    res.text.should.containEql('Redirecting to /home')
                    cookies.push(res.header['set-cookie'])
                    done(err)
                })
        })
    })
})

describe('Create Projects', function(){
    before(function (done) {
        Project.remove({}, done)
    })

    describe('#User.createProject()', function(){
        // bobm1267 #1
        it('should create a new project by bobm1267 called Bumble Bees', function(done){
            this.timeout(10000)
            request.post('/createProject')
            .send({
                projectName: 'Bumble Bee Merchandise',
                projectDescription: 'This project is to design and manufacture new merchandise for a company called Bumble Bee. Bumble Bee sells pre-made kits for starting your own beehive.'
            })
            .set('cookie', cookies[1])
            .expect(200)
            .end(function(err, res){
                res.text.should.containEql('Project Created')
                done(err)
            })
        })

        // jane_rhoads #1
        it('should create a new project by jane_rhoads called Skatr', function(done){
            this.timeout(10000)
            request.post('/createProject')
            .send({
                projectName: 'Skatr',
                projectDescription: 'Create a website to setup people that find skateboarding fun.',
                projectSkills: 'Web-Dev, Merchandising, Graphic Design'
            })
            .set('cookie', cookies[2])
            .expect(200)
            .end(function(err, res){
                res.text.should.containEql('Project Created')
                done(err)
            })
        })

        // bobm1267 #2
        it('should create a new project by bobm1267 called Purdue Catapult', function(done){
            this.timeout(10000)
            request.post('/createProject')
            .send({
                projectName: 'Purdue Catapult',
                projectDescription: 'My goal is to create the worlds largest catapult. I\'m looking for excited individuals to join me',
                projectSkills: 'Mechanical Engineering'
            })
            .set('cookie', cookies[1])
            .expect(200)
            .end(function(err, res){
                res.text.should.containEql('Project Created')
                done(err)
            })
        })

        // bobm1267 #3
        it('should create a new project by bobm1267 called Purdue Snackbar', function(done){
            this.timeout(10000)
            request.post('/createProject')
            .send({
                projectName: 'Purdue Snackbar',
                projectDescription: 'I think that there should be a cheap snack bar built near the engineering fountain for students to grab a quick bite between classes.',
                projectSkills: 'Finance, Architecture, Cooking'
            })
            .set('cookie', cookies[1])
            .expect(200)
            .end(function(err, res){
                res.text.should.containEql('Project Created')
                done(err)
            })
        })

        // bobm1267 #4
        it('should create a new project by bobm1267 called Tweeter', function(done){
            this.timeout(10000)
            request.post('/createProject')
            .send({
                projectName: 'Tweeter',
                projectDescription: 'The aim of this project is to build a bot that gathers analytics on the users tweets',
                projectSkills: 'Python, Social Networking, C/C++'
            })
            .set('cookie', cookies[1])
            .expect(200)
            .end(function(err, res){
                res.text.should.containEql('Project Created')
                done(err)
            })
        })

        // danfeilds #1
        it('should not create a new project by danfeilds called Purdue Catapult', function(done){
            this.timeout(10000)
            request.post('/createProject')
            .send({
                projectName: 'Purdue Catapult',
                projectDescription: 'I just want to launch stuff.'
            })
            .set('cookie', cookies[4])
            .expect(302)
            .end(function(err, res){
                res.text.should.containEql('Project Exists')
                done(err)
            })
        })

        // bobm1267 #5
        it('should create a new project by bobm1267 called 360 Picture Stitching', function(done){
            this.timeout(10000)
            request.post('/createProject')
            .send({
                projectName: '360 Picture Stitching',
                projectDescription: 'I want to create an app for IOS that allows users to stitch together pictures to create a 360 degree view.',
                projectSkills: 'IOS, Obective-C, C/C++'
            })
            .set('cookie', cookies[1])
            .expect(200)
            .end(function(err, res){
                res.text.should.containEql('Project Created')
                done(err)
            })
        })

        // jane_rhoads #2
        it('should create a new project by jane_rhoads called NoteShare', function(done){
            this.timeout(10000)
            request.post('/createProject')
            .send({
                projectName: 'NoteShare',
                projectDescription: 'Create a website to share and collaborate class notes.',
                projectSkills: 'Web-Dev'
            })
            .set('cookie', cookies[2])
            .expect(200)
            .end(function(err, res){
                res.text.should.containEql('Project Created')
                done(err)
            })
        })

        // bobm1267 #5.2
        it('should not create a new project by bobm1267 called 360 Picture Stitching', function(done){
            this.timeout(10000)
            request.post('/createProject')
            .send({
                projectName: '360 Picture Stitching',
                projectDescription: 'I want to create an app for IOS that allows users to stitch together pictures to create a 360 degree view.',
                projectSkills: 'IOS, Obective-C, C/C++'
            })
            .set('cookie', cookies[1])
            .expect(302)
            .end(function(err, res){
                res.text.should.containEql('Project Exists')
                done(err)
            })
        })

        // bobm1267 #6
        it('should create a new project by bobm1267 called Raspberry Pi Drone', function(done){
            this.timeout(10000)
            request.post('/createProject')
            .send({
                projectName: 'Raspberry Pi Drone',
                projectDescription: 'I want to create a Raspberry Pi Drone.',
                projectSkills: 'C/C++, Python'
            })
            .set('cookie', cookies[1])
            .expect(200)
            .end(function(err, res){
                res.text.should.containEql('Project Created')
                done(err)
            })
        })

        // jane_rhoads #3
        it('should not create a new project by jane_rhoads called Raspberry Pi Drone', function(done){
            this.timeout(10000)
            request.post('/createProject')
            .send({
                projectName: 'Raspberry Pi Drone',
                projectDescription: 'Create a drone controlled via bluetooth and raspberrypi.',
                projectSkills: 'C/C++, Python'
            })
            .set('cookie', cookies[2])
            .expect(302)
            .end(function(err, res){
                res.text.should.containEql('Project Exists')
                done(err)
            })
        })

        // bobm1267 #7
        it('should create a new project by bobm1267 called Cluster Robots', function(done){
            this.timeout(10000)
            request.post('/createProject')
            .send({
                projectName: 'Cluster Robots',
                projectDescription: 'I want to create a cluster of robots that trade information to efficiently complete a task.',
                projectSkills: 'C/C++'
            })
            .set('cookie', cookies[1])
            .expect(200)
            .end(function(err, res){
                res.text.should.containEql('Project Created')
                done(err)
            })
        })

        // bobm1267 #8
        it('should not create a new project by bobm1267 for exceeding limit', function(done){
            this.timeout(10000)
            request.post('/createProject')
            .send({
                projectName: 'Exceeding Limit',
                projectDescription: 'I want to exceed the websites limit for creating projects',
                projectSkills: ''
            })
            .set('cookie', cookies[1])
            .expect(200)
            .end(function(err, res){
                res.text.should.containEql('Exceeded Project Limit')
                done(err)
            })
        })

        // danfeilds #2
        it('should create a new project by danfeilds called Mega-Garden', function(done){
            this.timeout(10000)
            request.post('/createProject')
            .send({
                projectName: 'Mega-Garden',
                projectDescription: 'I want to create a school garden that uses natural pest protection.',
                projectSkills: 'Bio, Biology'
            })
            .set('cookie', cookies[4])
            .expect(200)
            .end(function(err, res){
                res.text.should.containEql('Project Created')
                done(err)
            })
        })
    })
})

describe('Edit User', function(){
    describe('#User.edit()', function(){
        it('should change danfeilds skills to Game Creation and Communications', function(done){
            this.timeout(10000)
            request.post('/updateUser')
            .send({
                skills: 'Game Creation, Communications'
            })
            .set('cookie', cookies[4])
            .expect(200)
            .end(function(err, res){
                res.text.should.containEql('Updated User')
                done(err)
            })
        })

        it('should change danfeilds password to dan_f', function(done){
            this.timeout(10000)
            request.post('/updateUser')
            .send({
                password: 'dan_f'
            })
            .set('cookie', cookies[4])
            .expect(200)
            .end(function(err, res){
                res.text.should.containEql('Updated User')
                done(err)
            })
        })

        it('should change danfeilds back to original info', function(done){
            this.timeout(10000)
            request.post('/updateUser')
            .send({
                password: 'danfeilds',
                skills: 'C/C++, Operating Systems, Compilers, Computer Architecture'
            })
            .set('cookie', cookies[4])
            .expect(200)
            .end(function(err, res){
                res.text.should.containEql('Updated User')
                done(err)
            })
        })

        it('should not change danfeilds', function(done){
            this.timeout(10000)
            request.post('/updateUser')
            .send({})
            .set('cookie', cookies[4])
            .expect(200)
            .end(function(err, res){
                res.text.should.containEql('Updated User')
                done(err)
            })
        })

        it('should change admin skills to administrative duties', function(done){
            this.timeout(10000)
            request.post('/updateUser')
            .send({
                skills: 'administrative duties'
            })
            .set('cookie', cookies[0])
            .expect(200)
            .end(function(err, res){
                res.text.should.containEql('Updated User')
                done(err)
            })
        })
    })
})

/*describe('Apply to Projects', function(){
    describe('#User.apply()', function(){
        it('should not apply bobm1267 to Tweeter', function(done){
            request.post('/apply')
            .send({
                projectName: 'Tweeter',
            })
            .set('cookie', cookies[1])
            .expect(302)
            .end(function(err, res){
                res.text.should.containEql('Already in project')
                done(err)
            })
        })
    })
})*/

/*describe('User:', function () {
    describe('User.create()', function () {
        before(function (done) {
            User.remove({ username: 'user1' }, done)
        })
        it('should create a new valid user', function (done) {
            request.post('/signup')
                .send({
                    username: 'user1',
                    password: 'user.1',
                    email: 'user1@user1.com',
                    skills: 'C, C++, Java'
                })
                .expect(302)
                .end(function (err, res) {
                    res.text.should.containEql('Redirecting to /home')
                    done(err)
                })
        })
    })

    describe('User.logout()', function () {
        it('should logout current user', function (done) {
            request.get('/logout').expect(302).end(function (err, res) {
                res.text.should.containEql('Redirecting to /')
                done(err)
            })
        })
    })

    describe('User.login()', function () {
        it('should login user', function (done) {
            request.post('/login')
                .send({
                    username: 'user1',
                    password: 'user.1'
                })
                .expect(302)
                .end(function (err, res) {
                    res.text.should.containEql('Redirecting to /home')
                    done(err)
                })
        })
    })
})*/

/*describe('Messaging', function(){
    var cookie
    var conID
    it('should login user', function(done){
        request.post('/login')
        .send({
            username: 'admin',
            password: 'admin'
        })
        .expect(302)
        .end(function(err, res){
            res.text.should.containEql('Redirecting to /home')
            cookie = res.header['set-cookie']
            done(err)
        })
    })

    it('should create a new conversation', function(done){
        request.post('/createConversation')
        .send({
            recipient: 'UPJ',
            composedMessage: 'New Conversation Started'
        })
        .set('cookie', cookie)
        .expect(200)
        .end(function(err, res){
            conID = res.body.conversationID
            done(err)
        })
    })

    it('should send a new message', function(done){
        request.post('/sendReply')
        .send({
            recipient: 'UPJ',
            composedMessage: 'Hello world'
        })
        .set('cookie', cookie)
        .expect(200)
        .end(function(err, res){
            console.log(err)
            done(err)
        })
    })

    it('should load all conversations', function(done){
        request.get('/loadAllConversations')
        .send({
            username: 'admin'
        })
        .set('cookie', cookie)
        .expect(200)
        .end(function(err, res){
            //console.log(res.data)
            //console.log(err)
            done(err)
        })
    })

    it('should load one conversation', function(done){
        request.get('/loadConversation')
        .send({
            participant1: 'UPJ',
            participant2: 'admin'
        })
        .set('cookie', cookie)
        .expect(200)
        .end(function(err, res){
            console.log(JSON.stringify(res.text))
            //console.log(err)
            done(err)
        })
    })
})*/

/*describe('Passport:', function(){
    after(function(done){
        Project.remove({ projectName: 'Fake Project 1'}, done)
    })

    var cookie
    it('should navigate to home', function(done){
        request.post('/login')
        .send({
            username: 'user1',
            password: 'user.1'
        })
        .expect(302)
        .end(function(err, res){
            res.text.should.containEql('Redirecting to /home')
            cookie = res.header['set-cookie']
            done(err)
        })
    })

    it('should post project', function(done){
        request.post('/projectpost')
        .send({
            projectName: 'Fake Project 1',
            projectSkills: 'Fake, Skills',
        })
        .set('cookie', cookie)
        .expect(200)
        .end(function(err, res){
            // console.log(res.body)
            // console.log(err)
            res.text.should.containEql('Proj registered')
        })
        done()
    })
})*/