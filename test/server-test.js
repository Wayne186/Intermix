var server = require('../server.js')
var assert = require('assert')
var http = require('http')

describe('server', function () {
    before(function () {
        server.listen(5000);
    })

    after(function () {
        server.close();
    })
})

describe('Checking Page Interactions', function () {
    describe('Load Page /', function () {
        it('should return 200', function (done) {
            http.get('http://localhost:5000/', function (res) {
                assert.equal(200, res.statusCode);
                done()
            })
        })
    })

    describe('Not logged in, prompt redirect', function () {
        it('should return 302 from /home', function (done) {
            http.get('http://localhost:5000/home', function (res) {
                assert.equal(302, res.statusCode);
                done()
            })
        })

        it('should return 302 from /profile', function (done) {
            http.get('http://localhost:5000/myProfile', function (res) {
                assert.equal(302, res.statusCode);
                done()
            })
        })
    })
})
