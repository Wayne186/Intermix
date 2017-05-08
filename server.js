/*
 *  configure Express Server
 */
var express = require('express')
var parser = require('body-parser')
var app = express()
var path = require('path')
var fs = require('fs')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var http = require('http')
var https = require('https')


app.set('views', path.join(__dirname, 'views'))
app.set('public', path.join(__dirname, 'js'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'js')))
app.use(express.static(path.join(__dirname, 'views')))
app.use(parser.urlencoded({ extended:true }))
app.use(parser.json())

/*
 *  configure MongoDB & Mongoose
 */
var mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://admin:intermixadmin@ds157469.mlab.com:57469/heroku_v7smm75n')
var Schema = mongoose.Schema

/*
 *  configure Passport
 */
var passport = require('passport')
var expressSession = require('express-session')
var LocalStrategy = require('passport-local').Strategy
var bCrypt = require('bcrypt-nodejs')
var flash = require('connect-flash')

app.use(cookieParser())
app.use(expressSession({
  secret: 'secretKey',
  name: 'secret_name',
  proxy: true,
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// initialize passport
var initPassport = require('./views/js/init.js')
initPassport(passport)

var routes = require('./routes/index')(passport)
app.use('/', routes)

var options = {
    key: 'server.key',
    cert: 'server.crt'
}

http.createServer(app).listen(process.env.PORT || 5000)

module.exports = app