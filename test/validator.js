var validator = require('../lib/validator');
var youtube = require('../lib/youtube');
var Downloader = require('../lib/downloader');
var path = require('path');
var fs = require('fs');
var assert = require('chai').assert;


var badMp3Path = path.join(__dirname, 'blobs', '0AcHmDxVnMI.mp3'); // this mp3 is truncated


describe('validator', function() {
    describe('validate()', function() {

	it('should report a truncated mp3 as invalid', function(done) {
	    validator.validate(badMp3Path, function(err, isValid) {
		assert.isNull(err);
		assert.isFalse(isValid);
		done();
	    });
	});
	
	it('should validate a downloaded youtube mp3', function(done) {
	    this.timeout(120000);
	    var downloader = new Downloader({ videoID: "0AcHmDxVnMI" });
	    downloader.fetch();
	    downloader.on("error", function(err) {
		assert.isNull(err);
	    });
	    downloader.on("complete", function(filePath) {
		assert.isString(filePath);
		validator.validate(filePath, function(err, isValid) {
		    assert.isNull(err);
		    assert.isTrue(isValid);
		    done();
		});
	    });
	});


	
    });
});
