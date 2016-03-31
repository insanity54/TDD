var path = require('path');
var youtube = require(path.join(__dirname, 'youtube'));
//var converter = require(path.join(__dirname, 'converter'));
//var ytdl = require('ytdl-core');
var YoutubeMp3Downloader = require('youtube-mp3-downloader');


//Configure YoutubeMp3Downloader
var YD = new YoutubeMp3Downloader({
    "ffmpegPath": "/usr/bin/ffmpeg",                       // Where is the FFmpeg binary located? 
    "outputPath": "/home/"+process.env.USER+"/tdd/mp3",    // Where should the downloaded and encoded files be stored? 
    "youtubeVideoQuality": "highest",                      // What video quality should be used? 
    "queueParallelism": 2,                                 // How many parallel downloads/encodes should be started? 
    "progressTimeout": 2000                                // How long should be the interval of the progress reports 
});







/**
 * fetch
 *
 * downloads a youtube video given its youtube video id
 *
 * @param {String} videoID
 */
var fetch = function(videoID, cb) {
  youtube.getVideoDetails(videoID, function(err, videos) {
    if (err) throw err;
    console.log(videos);
  
    //Download video and save as MP3 file 
    YD.download(videoID, videoID+'.mp3');

      
    YD.on("finished", function(data) {
	console.log(data);
	return cb(null);
    });
 
    YD.on("error", function(error) {
	console.error(error);
	return cb(error);
    });
 
    //YD.on("progress", function(progress) {
	//console.log(progress);
    //});


      
  });      
}
/**
 * @callback {onFetchedCallback}
 * @param {Error} err
 */


module.exports = {
    fetch: fetch
}
