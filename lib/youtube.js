var request = require('request');

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
  request('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=UCqNCLd2r19wpWWQE6yDLOOQ&key='+ process.env.YOUTUBE_API_KEY, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      console.log(body) // Show the HTML for the Google homepage.
      try JSON.parse(body) {
        return cb(null, body);
      }

      catch(e) {
        return cb(err, null);
      }
    }
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
 request('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=UUbW18JZRgko_mOGm5er8Yzg&key='+ process.env.YOUTUBE_API_KEY, function (error, response, body) {
   if (!error && response.statusCode == 200) {

     console.log(body)
     try JSON.parse(body) {
       return cb(null, body);
     }

     catch(e) {
       return cb(err, null);
     }

   }
 });
 /**
  * @callback {onGotVideosCallback}
  * @param {Error} err
  * @param {Array} videos
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
    getUploadsPlaylist(channel, function(err, playlist) {
      if (err) throw err;
      getVideos(playlist, function(err, videos) {
        if (err) throw err;
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



/**
 * getUploadsPlaylist
 *
 * Calls back with the uploads playlist given Channel JSON
 *
 * @param {JSON} channel
 * @param {onGotUploadsPlaylistCallback} cb
 */
var getUploadsPlaylist = function(channel, cb) {

}
/**
 * @callback {onGotUploadsPlaylistCallback}
 * @param {String} playlist
 */



module.exports = {
  getChannel: getChannel,
  getVideos: getVideos,
  getUploadsPlaylist: getUploadsPlaylist;
  getChannelUploads: getChannelUploads
}
