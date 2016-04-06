var request = require('request');
const ee = require('events');
const util = require('util');


/**
 * getVideoDetails
 *
 * Given a youtube video id (example: DLzxrzFCyOs)
 * returns a js object containing title, description, publish date, etc.
 *
 * @param {string} videoID - youtube video ID to look up
 * @param {onGotVideoDetailsCallback} cb
 */
var getVideoDetails = function getVideoDetails(videoID, cb) {
    if (typeof videoID === 'undefined')
	throw new Error('getideoDetails() first param must be a {string} youtube video id, but got-- ' + videoID);
    if (typeof cb === 'undefined')
	throw new Error('getVideoDetails() first param must be a callback');

    //GET https://www.googleapis.com/youtube/v3/videos?part=snippet&id=DLzxrzFCyOs&key={YOUR_API_KEY}
    request('https://www.googleapis.com/youtube/v3/videos?'+
	    'part=snippet&'+
	    'id='+videoID+'&'+
	    'key='+ process.env.YOUTUBE_API_KEY,
	    function (err, res, body) {
		if (err) return cb(err, null);
		if (res.statusCode != 200)
		    return cb(new Error('did not get HTTP code 200 while looking for video deets. got instead-- '+res.statusCode), null);

		try { var deets = JSON.parse(body) }
		catch(e) { return cb(e, null) }
		return cb(null, deets);

	    });
}
/**
 * @callback {onGotVideoDetailsCallback}
 * @param {Error} err
 * @param {object} deets
 * @param {string} deets.title
 * @param {string} deets.description
 * @param {string} deets.date
 * @param {string} deets.thumbnail
 */










/**
 * getVideoContentDetails
 *
 * @param {string} videoID
 * @param {onGotVideoContentDetailsCallback} cb
 */
var getVideoContentDetails = function getVideoContentDetails(videoID, cb) {
    if (typeof videoID === 'undefined')
	throw new Error('getideoDetails() first param must be a {string} youtube video id, but got-- ' + videoID);
    if (typeof cb === 'undefined')
	throw new Error('getVideoDetails() first param must be a callback');

    //GET https://www.googleapis.com/youtube/v3/videos?part=snippet&id=DLzxrzFCyOs&key={YOUR_API_KEY}
    request('https://www.googleapis.com/youtube/v3/videos?'+
	    'part=contentDetails&'+
	    'id='+videoID+'&'+
	    'key='+ process.env.YOUTUBE_API_KEY,
	    function (err, res, body) {
		if (err) return cb(err, null);
		if (res.statusCode != 200)
		    return cb(new Error('did not get HTTP code 200 while looking for video file deets. got instead-- '+res.statusCode), null);
		try { var deets = JSON.parse(body) }
		catch(e) { return cb(e, null) }
		return cb(null, deets);
	    });
}
/**
 * @callback {onGotVideoContentDetailsCallback}
 * @param {error} err
 * @param {object} details
 * @param {string} details.kind - should be youtube#videoListResponse
 * @param {array} details.items - array of objects. example: details.items[0].contentDetails.duration a
 */







/**
 * getChannel
 *
 * get the Daily Decrypt channel JSON
 * this returns JSON like this:
 *
 * {
 *   "kind": "youtube#channelListResponse",
 *  "etag": "\"q5k97EMVGxODeKcDgp8gnMu79wM/pxFXXPHX7UklbMHitGMLPXsk4Wg\"",
 *  "pageInfo": {
 *   "totalResults": 1,
 *   "resultsPerPage": 1
 *  },
 *  "items": [
 *   {
 *    "kind": "youtube#channel",
 *    "etag": "\"q5k97EMVGxODeKcDgp8gnMu79wM/OEN35-cpqvLzj44DKWIxoe4azLA\"",
 *    "id": "UCqNCLd2r19wpWWQE6yDLOOQ",
 *    "contentDetails": {
 *     "relatedPlaylists": {
 *      "likes": "LLqNCLd2r19wpWWQE6yDLOOQ",
 *      "uploads": "UUqNCLd2r19wpWWQE6yDLOOQ"
 *     },
 *     "googlePlusUserId": "101685843653400341537"
 *    }
 *   }
 *  ]
 * }
 *
 * which we use to find the "uploads" playlist.
 *
 *
 * @param {string} channel - channel of which to get uploads with for inline (greets)
 * @param {onGotChannelCallback} cb
 */
var getChannel = function(channel, cb) {
    if (typeof channel === 'undefined') throw new Error('getChannel() first param must be a {string} channel ID');
    if (typeof cb !== 'function') throw new Error('getChannel() second param must be a callback');
    request('https://www.googleapis.com/youtube/v3/channels?'+
	    'part=contentDetails&'+
	    'id='+channel+'&'+
	    '&key='+process.env.YOUTUBE_API_KEY,
	    function (err, res, body) {
		if (err) return cb(err, null);
		if (res.statusCode != 200)
		    return cb(new Error('did not get HTTP code 200 while looking for video deets'), null);
		try { var chan = JSON.parse(body) }
		catch(e) { return cb(e, null) }
		return cb(null, chan);
    });
}
/**
 * @callback {onGotChannelCallback} cb
 * @param {Error} err
 * @param {JSON} channel
 */



/**
 * getVideos
 *
 * gets the videos contained in a playlist
 *
 *
 * example returned blob:
 *
 * { kind: 'youtube#playlistItemListResponse',
 *    etag: '"q5k97EMVGxODeKcDgp8gnMu79wM/yB0ZXKHjGdK2MC7p7Fqh9CQ8JKE"',
 *    nextPageToken: 'CDIQAA',
 *    pageInfo: { totalResults: 134, resultsPerPage: 50 },
 *    items:
 *     [ { kind: 'youtube#playlistItem',
 *        etag: '"q5k97EMVGxODeKcDgp8gnMu79wM/GDUjcoqYSEMzNeKfLcl7ZpVTVLc"',
 *        id: 'VVVxTkNMZDJyMTl3cFdXUUU2eURMT09RLk9oSTNZclZSaVVF',
 *         snippet: [Object] },
 *       { kind: 'youtube#playlistItem',
 *         etag: '"q5k97EMVGxODeKcDgp8gnMu79wM/MlesVXuhWaOIiB2E69NZJCOAgjE"',
 *         id: 'VVVxTkNMZDJyMTl3cFdXUUU2eURMT09RLkVOeEJteXN3U3Vv',
 *         snippet: [Object] },
 *       { kind: 'youtube#playlistItem',
 *         etag: '"q5k97EMVGxODeKcDgp8gnMu79wM/VnK7U4UDGOJsgOTwimnujY7V0IA"',
 *         id: 'VVVxTkNMZDJyMTl3cFdXUUU2eURMT09RLnl2dTdHbkFua1Bj',
 *         snippet: [Object] },
 *
 *
 * @param {String} playlist - youtube playlist ID
 * @param {string} [nextPageToken] - token for calling the next page of results
 * @param {onGotVideosCallback} cb
 */
 var getVideos = function(playlist, nextPageToken, cb) {
     if (typeof cb === 'undefined') {
	 if (typeof nextPageToken === 'function') {
	     cb = nextPageToken;
	     nextPageToken = null;
	 }
       else throw new Error('call it correctly! getVideos({string} playlist, {string} [nextPageToken], {onGotVideosCallback} cb)');
     }
     if (typeof playlist !== 'string') throw new Error('getVideos() first param must be a playlist ID');


     var onComplete = function (err, res, body) {
	 if (err) return cb(err, null);
	 if (res.statusCode != 200)
	     return cb(new Error('HTTP code was not 200 when getting videos'));
	 
	 try { var vid = JSON.parse(body) }
		     catch(e) { return cb(e, null) }
	 return cb(null, vid);
     }


     if (nextPageToken) {
	 request('https://www.googleapis.com/youtube/v3/playlistItems?'+
		 'part=snippet&'+
		 'maxResults=50&'+
		 'pageToken='+nextPageToken+'&'+
		 'playlistId='+playlist+'&'+
		 'key='+ process.env.YOUTUBE_API_KEY,
		 onComplete);

     } else {
	 request('https://www.googleapis.com/youtube/v3/playlistItems?'+
		 'part=snippet&'+
		 'maxResults=50&'+
		 'playlistId='+playlist+'&'+
		 'key='+ process.env.YOUTUBE_API_KEY,
		 onComplete);
     }
 }
/**
  * @callback {onGotVideosCallback}
  * @param {Error} err
  * @param {Array} videos
  */





/**
 * getVideosPage
 *
 * Gets the next page of videos
 * Since youtube will only give a max of 50 at once
 *
 *
 *
 */






/**
 * getUploadsPlaylist
 *
 * Calls back with the uploads playlist given Channel JSON
 *
 * @param {JSON} channel
 * @param {onGotUploadsPlaylistCallback} cb
 */
var getUploadsPlaylist = function(channel, cb) {
  if (typeof channel === 'undefined') throw new Error('getUploadsPlaylist() first param must be channel JSON');
  if (typeof channel.items[0].contentDetails.relatedPlaylists.uploads === 'undefined') throw new Error('the channel JSON received did not have the expected data, items.contentDetails.uploads');
  //console.log('getUploadsPlaylist: ', items[0].contentDetails.uploads);
  return cb(null, channel.items[0].contentDetails.relatedPlaylists.uploads);
}
/**
 * @callback {onGotUploadsPlaylistCallback}
 * @param {Error} err
 * @param {String} playlist
 */


/**
 * getChannelUploads
 *
 * calls back with all the Daily Decrypt videos
 * The main function to call from outside this module. (this abstracts the other functions here)
 *
 * @todo potential improvement - this call is very inefficient if nextPageToken is set.
 *
 * @param {string} channel - youtube channel id to get uploads of
 * @param {string} [nextPageToken] - the token for calling the next page of channel results
 * @param {onGotChannelUploadsCallback} cb
 */
var getChannelUploads = function(channel, nextPageToken, cb) {
    if (typeof cb !== 'function') {
	if (typeof channel === 'string' && typeof nextPageToken === 'function') {
	    cb = nextPageToken;
	    nextPageToken = null;
	} else
	    throw new Error('call it correctly! getChannelUploads({string} channel, {string} [nextPageToken], {onGotChannelUploadsCallback} cb)');

    }
    if (typeof channel !== 'string')
	throw new Error('getChannelUploads() first param must be a {string} youtube channel ID');



    getChannel(channel, function(err, chanObj) {
	if (err) throw err;
	// console.log('channel');
	// console.log(channel);
	
	getUploadsPlaylist(chanObj, function(err, playlist) {
	    if (err) throw err;
	    // console.log('palylist')
	    // console.log(playlist)

	    if (!nextPageToken) {
	    
		getVideos(playlist, function(err, videos) {
		    if (err) throw err;
		    // console.log('vids')
		    // console.log(videos)
		    
		    return cb(null, videos);
		});

	    } else {
		getVideos(playlist, nextPageToken, function(err, videos) {
		    if (err) throw err;
		    // console.log('vids')
		    // console.log(videos)
		    
		    return cb(null, videos);
		});
	    }
	});
    });


    
}
/**
 * @callback {onGotChannelUploadsCallback}
 * @param {Error} err
 * @param {Array} videos - an array of youtube video IDs
 */




/**
 * watch
 *
 * watch youtube channel for video uploads
 *
 * @param {string} channel - youtube channel id
 * @returns {EventEmitter} ee
 */
// var watch = function watch() {
//   ee.call(this);

   
// }
// util.inherits(watch, ee);

// Watch.Prototype.




module.exports = {
  getVideoDetails: getVideoDetails,
  getVideoContentDetails: getVideoContentDetails,
  getChannel: getChannel,
  getVideos: getVideos,
  getUploadsPlaylist: getUploadsPlaylist,
  getChannelUploads: getChannelUploads
  //watch: watch
}
