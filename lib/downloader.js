var path = require('path');
var youtube = require(path.join(__dirname, 'youtube'));
var converter = require(path.join(__dirname, 'converter'));
var ytdl = require('ytdl-core');


/**
 * fetch
 *
 * downloads a youtube video given its youtube video id
 *
 * @param {String} videoID
 */
var fetch = function(videoID, cb) {
  // youtube.getVideoDetails(videoID, function(err, videos) {
  //   if (err) throw err;
  //   console.log(videos);
  // });


  var dlStream = ytdl('http://www.youtube.com/watch?v='+videoID)
    //.pipe(fs.createWriteStream('video.flv'));

    converter.convert(dlStream, {dest: path.join(__dirname, 'src', 'assets_mp3')+videoID+'.mp3'}, function(err, file) {
      if (err) throw err;
      return cb(null);
    });


}
/**
 * @callback {onFetchedCallback}
 * @param {Error} err
 * @param {Buffer} video
 */


module.exports = {
    fetch: fetch
}
