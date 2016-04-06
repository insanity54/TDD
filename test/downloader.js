var path = require('path');
var os = require('os');
var Downloader = require(path.join(__dirname, '..', 'lib', 'downloader'));
var assert = require('chai').assert;
var fs = require('fs');


var testPath = os.tmpdir();
assert(path.isAbsolute(testPath));


describe('downloader', function() {

    describe('fetch()', function() {
	this.timeout(10000);

	beforeEach(function(done) {
	    // delete test mp3
	    fs.unlink(path.join(testPath, 'Mh2GQmfN-AI.mp3'), function(err) {
		done();
	    });
	});

	it('should get an mp3 of a yt video', function(done) {
	    var downloader = new Downloader({
		videoID: "Mh2GQmfN-AI",
		dest: testPath
	    });

	    downloader.check().fetch();

	    downloader.on("progress", function(err, prog) {
		console.log(err);
		console.log(prog);
	    });


	    downloader.on("error", function(err) {
		throw err;
	    });
	    
	    downloader.on("complete", function(filePath) {
		assert.isTrue(path.isAbsolute(filePath));
		assert.equal(path.dirname(filePath), testPath);
		fs.stat(filePath, function(err, stats) {
		    assert.isNull(err);
		    done();
		});
	    });
	    
	});

	it('should revert to default download directory if none supplied', function(done) {
	    var downloader = new Downloader({
		videoID: "Mh2GQmfN-AI"
	    });
	    
	    downloader.check().fetch();

	    downloader.on("error", function(err) {
		assert.isNull(err);
	    });
	    
	    downloader.on("complete", function(filePath) {
		assert.isTrue(path.isAbsolute(filePath));
		assert.equal(path.dirname(filePath), path.join(os.homedir(), 'tdd', 'src'));
		fs.stat(filePath, function(err, stats) {
		    assert.isNull(err);
		    done();
		});
	    });
	    
	});
	
	
	it('should abort download if the same video has already been downloaded', function(done) {
	    var downloader = new Downloader({
		videoID: "Mh2GQmfN-AI"
	    });
	    
	    downloader.check().fetch();

	    downloader.on("error", function(err) {
		throw err
	    });
	    
	    downloader.on("complete", function(filePath) {
		assert.isTrue(path.isAbsolute(filePath));
		fs.stat(filePath, function(err, stats) {
		    assert.isNull(err);

		    downloader.check().fetch();
		    
		    downloader.on("error", function(err) {
			assert.isDefined(err);			
			assert.match(err, /already exists/, "got an error that did not match the expected 'already exists' error");
			done();
		    });
		    
		    downloader.on("complete", function(path) {
			throw new Error("download completed when it should have had an 'already exists' error");
		    });		
		});
	    });
	});


    });
});
