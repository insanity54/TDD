var path = require('path');
var os = require('os');
var Downloader = require(path.join(__dirname, '..', 'lib', 'downloader'));
var assert = require('chai').assert;
var fs = require('fs');


var dlPath = path.join(os.tmpdir(), 'Mh2GQmfN-AI.mp3');
var defaultDlPath = path.join(os.homedir(), 'tdd', 'src', 'Mh2GQmfN-AI.mp3');
assert(path.isAbsolute(dlPath));
assert(path.isAbsolute(defaultDlPath));


describe('downloader', function() {

    describe('fetch()', function() {
	this.timeout(10000);

	beforeEach(function(done) {
	    // delete test mp3s
	    //console.log('deleting %s and %s', dlPath, defaultDlPath);
	    fs.unlink(dlPath, function(err) {
		fs.unlink(defaultDlPath, function(err) {
		    done();
		});
	    });
	});

	it('should get an mp3 of a yt video', function(done) {
	    var downloader = new Downloader({
		videoID: "Mh2GQmfN-AI",
		dest: path.dirname(dlPath)
	    });

	    downloader.fetch();

	    downloader.on("error", function(err) {
		assert.isNull(err);
	    });
	    
	    downloader.on("complete", function(filePath) {
		//console.log('downloaded to %s', filePath);
		assert.isTrue(path.isAbsolute(filePath));
		assert.equal(filePath, dlPath);
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
	    
	    downloader.fetch();

	    downloader.on("error", function(err) {
		assert.isNull(err);
	    });
	    
	    downloader.on("complete", function(filePath) {
		//console.log('downloaded to %s', filePath);		
		assert.isTrue(path.isAbsolute(filePath));
		assert.equal(path.dirname(filePath), path.join(os.homedir(), 'tdd', 'src'));
		fs.stat(filePath, function(err, stats) {
		    assert.isNull(err);
		    done();
		});
	    });
	    
	});
	
	
	it('should abort download if the same video has already been downloaded', function(done) {
	    var downloader1 = new Downloader({
		videoID: "Mh2GQmfN-AI"
	    });
	    var downloader2 = new Downloader({
		videoID: "Mh2GQmfN-AI"
	    });
	    
	    downloader1.fetch();

	    downloader1.on("error", function(err) {
		assert.isNull(err);
	    });


	    
	    downloader1.on("complete", function(filePath) {
		//console.log('downloaded to %s', filePath);
		assert.isTrue(path.isAbsolute(filePath));
		fs.stat(filePath, function(err, stats) {
		    assert.isNull(err);

		    downloader2.fetch();
		    
		    downloader2.on("error", function(err) {
			assert.match(err, /already exists/, "got an error that did not match the expected 'already exists' error");
			done();
		    });
		    
		    downloader2.on("complete", function(path) {
			throw new Error("download completed when it should have had an 'already exists' error");
		    });		
		});
	    });
	    
	});


    });
});
