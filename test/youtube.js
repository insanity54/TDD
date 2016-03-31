var path = require('path');
var youtube = require(path.join(__dirname, '..', 'lib', 'youtube'));
var assert = require('chai').assert;


// make sure the youtube api key exists in the system environment
if (typeof process.env.YOUTUBE_API_KEY === 'undefined')
    throw new Error('YOUTUBE_API_KEY is not defined in your environment, and it is required');


describe('youtube', function() {

    describe('getVideoDetails()', function() {

	this.timeout(5000);
	
	it('should get video details', function(done) {
	   youtube.getVideoDetails('dQw4w9WgXcQ', function(err, deets) {
	       assert.isNull(err);
	       assert.isObject(deets);
	       assert.isString(deets.items[0].snippet.title);
	       assert.equal(deets.items[0].snippet.title, 'Rick Astley - Never Gonna Give You Up');
	       done();
	   });
	});
    });
    
});
