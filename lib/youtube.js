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
  if (typeof cb === 'undefined') throw new Error('getChannel() first param must be a callback');

  request('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=UCqNCLd2r19wpWWQE6yDLOOQ&key='+ process.env.YOUTUBE_API_KEY, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      //console.log(body) // Show the HTML for the Google homepage.
      try {
        var chan = JSON.parse(body)
        return cb(null, chan);
      }

      catch(e) {
        return cb(e, null);
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
 var getVideos = function(playlist, cb) {
   if (typeof playlist === 'undefined') throw new Error('getVideos() first param must be a playlist ID');
   if (typeof cb === 'undefined') throw new Error('getVideos() second param must be a callback');

   request('https://www.googleapis.com/youtube/v3/playlistItems?'+
     'part=snippet&'+
     'maxResults=50&'+
     'playlistId='+playlist+'&'+
     'key='+ process.env.YOUTUBE_API_KEY,
     function (error, response, body) {
     if (!error && response.statusCode == 200) {

       //console.log(body)
       try {
         var vid = JSON.parse(body);
         return cb(null, vid);
       }

       catch(e) {
         return cb(e, null);
       }

     }
   });
 }
 /**
  * @callback {onGotVideosCallback}
  * @param {Error} err
  * @param {Array} videos
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
  getChannel: getChannel,
  getVideos: getVideos,
  getUploadsPlaylist: getUploadsPlaylist,
  getChannelUploads: getChannelUploads
}
