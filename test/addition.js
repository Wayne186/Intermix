'use strict'

describe('addition', function(){
    it('should add 1+1 correctly', function(done){
        var onePlusOne = 1 + 1
        onePlusOne.should.equal(2)
        // must call so mocha knows that we are done
        done()
    })
})