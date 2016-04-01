var path = require('path');
var youtube = require(path.join(__dirname, '..', 'lib', 'youtube'));
var assert = require('chai').assert;


// make sure the youtube api key exists in the system environment
if (typeof process.env.YOUTUBE_API_KEY === 'undefined')
    throw new Error('YOUTUBE_API_KEY is not defined in your environment, and it is required');


describe('youtube', function() {

    var npt = 'CDIQAA';
    var pir = 'youtube#playlistItemListResponse';


    
    
    describe('getVideos()', function() {
	var playlistID = 'UUqNCLd2r19wpWWQE6yDLOOQ';

	it('should accept a playlistID and a callback', function(done) {
	    youtube.getVideos(playlistID, function(err, videos) {
		assert.isNull(err);
		assert.isObject(videos);
		//console.log(videos.items[0].snippet.title);		
		assert.equal(videos.kind, pir);
		assert.isString(videos.items[0].snippet.title);
		done();
	    });
	});
	

	it('should accept a playlistID, nextPageToken, and a callback', function(done) {
	    youtube.getVideos(playlistID, npt, function(err, videos) {
		assert.isNull(err);
		assert.isObject(videos);
		//console.log(videos.items[0].snippet.title);
		assert.equal(videos.kind, pir);
		assert.isString(videos.items[0].snippet.title);
		done();
	    });
	});

	it('should get a new page if using nextPageToken', function(done) {
	    youtube.getVideos(playlistID, npt, function(err, videos) {
		assert.isNull(err);
		var nnpt = videos.nextPageToken;
		youtube.getVideos(playlistID, nnpt, function(err, v) {
		    assert.isNull(err);
		    assert.isObject(v);
		    assert.equal(videos.kind, pir);
		    assert.isString(videos.items[0].snippet.title);
		    assert.notEqual(videos.items[0].snippet.title, v.items[0].snippet.title);
		    done();
		});
	    });
	});
	    
    });

    
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


    describe('getChannelUploads()', function() {
	this.timeout(5000);
	var cid = 'UCqNCLd2r19wpWWQE6yDLOOQ';
	
	it('should accept the channelID and a callback', function(done) {
	    youtube.getChannelUploads(cid, function(err, vDeets) {
		assert.isNull(err);
		assert.isObject(vDeets);
		assert.equal(vDeets.kind, pir);
		done();
	    });
	});

	it('should accept the channelID, a nextPageToken, and a callback', function(done) {
	    youtube.getChannelUploads(cid, npt, function(err, vDeets) {
		assert.isNull(err);
		assert.isObject(vDeets);
		assert.equal(vDeets.kind, pir);
		done();
	    });
	});

    });
    
});
