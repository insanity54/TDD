var path = require('path');
var os = require('os');
var downloader = require(path.join(__dirname, '..', 'lib', 'downloader'));
var assert = require('chai').assert;
var fs = require('fs');


var testPath = os.tmpdir();
assert(path.isAbsolute(testPath));


describe('downloader', function() {

    describe('fetch()', function() {
	this.timeout(10000);
	
	it('should get an mp3 of a yt video', function(done) {
	   downloader.fetch('Mh2GQmfN-AI', testPath, function(err, path) {
	       assert.isNull(err);
	       assert.equal(path, testPath);
	       fs.stat(path, function(err, stats) {
		   assert.isNull(err);
		   done();
	       });	       
	   });
	});

	it('should revert to default download directory if none supplied', function(done) {
	    downloader.fetch('Mh2GQmfN-AI', function(err, path) {
		assert.isNull(err);
		assert.isString(path);
		fs.stat(path, function(err, stats) {
		    assert.isNull(err);
		    done();
		});
	    });
	});

	
    });
});
