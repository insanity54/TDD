var assert = require('chai').assert;
var path = require('path');
var thumbnailer = require(path.join(__dirname, '..', 'lib', 'thumbnailer'));
var os = require('os');
var fs = require('fs');

var testThumbnail = 'https://i.ytimg.com/vi/-FHeXrY65V4/default.jpg'
var testFile = path.join(os.tmpdir(), '-FHeXrY65V4.jpg');			 
			  

describe('thumbnailer', function() {

    describe('get()', function() {

	it('should download an image to the specified destination', function(done) {
	    this.timeout(10000);
	    thumbnailer.get(testThumbnail, testFile, function(err) {
		assert.isNull(err);
		fs.stat(testFile, function(err, stats) {
                    assert.isNull(err);
		    done();
		});

	    });
	    
	});

    });
});
