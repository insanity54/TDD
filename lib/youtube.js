var request = require('request');



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
 * @param {onGotChannelCallback} cb
 */
var getChannel = function(cb) {
  if (typeof cb === 'undefined') throw new Error('getChannel() first param must be a callback');

    request('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=UCqNCLd2r19wpWWQE6yDLOOQ&key='+ process.env.YOUTUBE_API_KEY, function (err, res, body) {
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
 * @param {String} playlist - youtube playlist ID
 * @param {onGotVideosCallback} cb
 */
 var getVideos = function(playlist, cb) {
   if (typeof playlist === 'undefined') throw new Error('getVideos() first param must be a playlist ID');
   if (typeof cb === 'undefined') throw new Error('getVideos() second param must be a callback');

   request('https://www.googleapis.com/youtube/v3/playlistItems?'+
	   'part=snippet&'+
	   'maxResults=50&'+
	   'playlistId='+playlist+'&'+
	   'key='+ process.env.YOUTUBE_API_KEY,
	   function (err, res, body) {
	       if (err) return cb(err, null);
	       if (res.statusCode != 200)
		   return cb(new Error('HTTP code was not 200 when getting videos'));

	       try { var vid = JSON.parse(body) }
	       catch(e) { return cb(e, null) }
	       return cb(null, vid);	 
	   });
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
 *
 * @param {onGotChannelUploadsCallback} cb
 */
var getChannelUploads = function(cb) {
  getChannel(function(err, channel) {
    if (err) throw err;
    // console.log('channel');
    // console.log(channel);

    getUploadsPlaylist(channel, function(err, playlist) {
      if (err) throw err;
      // console.log('palylist')
      // console.log(playlist)

      getVideos(playlist, function(err, videos) {
        if (err) throw err;
        // console.log('vids')
        // console.log(videos)

        return cb(null, videos);
      });
    });
  });
}
/**
 * @callback {onGotChannelUploadsCallback}
 * @param {Error} err
 * @param {Array} videos - an array of youtube video IDs
 */







module.exports = {
  getVideoDetails: getVideoDetails,
  getChannel: getChannel,
  getVideos: getVideos,
  getUploadsPlaylist: getUploadsPlaylist,
  getChannelUploads: getChannelUploads
}
