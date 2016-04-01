var path = require('path');
var os = require('os');
var youtube = require(path.join(__dirname, 'youtube'));
//var converter = require(path.join(__dirname, 'converter'));
//var ytdl = require('ytdl-core');
var YoutubeMp3Downloader = require('youtube-mp3-downloader');




/**
 * fetch
 *
 * downloads a youtube video given its youtube video id
 *
 * @param {String} videoID
 * @param {String} [file] - absolute path of the mp3 to be saved
 * @param {onFetchedCallback} cb
 */
var fetch = function(videoID, file, cb) {
    if (typeof cb === 'undefined') {
	if (typeof file === 'function') {
	    // only 2 params received, assuming default filePath
	    cb = file;
	    file = path.resolve(os.homedir(), 'tdd', 'mp3');
	}
    }
    if (typeof videoID !== 'string') throw new Error('downloader.fetch() first param must be a {string} youtube videoID. got instead-- '+videoID);
    if (!path.isAbsolute(file)) return cb(new Error('downloader.fetch() requires an absolute path. got instead-- '+path), null);

    console.log('downloading video id %s, to file %s', videoID, file);
    var YD = new YoutubeMp3Downloader({
	"ffmpegPath": "/usr/bin/ffmpeg",                       // Where is the FFmpeg binary located? 
	"outputPath": file,                                    // Where should the downloaded and encoded files be stored? 
	"youtubeVideoQuality": "highest",                      // What video quality should be used? 
	"queueParallelism": 2,                                 // How many parallel downloads/encodes should be started? 
	"progressTimeout": 2000                                // How long should be the interval of the progress reports 
    });

    
    //Download video and save as MP3 file 
    YD.download(videoID, videoID+'.mp3');

      
    YD.on("finished", function(data) {
	//console.log(data);
	return cb(null, file);
    });
 
    YD.on("error", function(err) {
	//console.error(error);
	return cb(err, null);
    });
 
    //YD.on("progress", function(progress) {
	//console.log(progress);
    //});


}
/**
 * @callback {onFetchedCallback}
 * @param {Error} err
 * @param {string} path - the path where the mp3 was saved
 */


module.exports = {
    fetch: fetch
}
