/**
 * Downloader module
 *
 * downloads youtube videos as Mp3
 *
 * example of how to use this module
 *
 *     var downloader = new Downloader({ videoID: 'abcdef838dI', destination: path.join(os.homedir(), 'tdd', 'src') });
 *     downloader.check().fetch();
 *
 *     downloader.on('complete', function(err, file) {
 *         if (err) console.error(err);
 *     });
 *
 */



var path = require('path');
var os = require('os');
var fs = require('fs');
var youtube = require(path.join(__dirname, 'youtube'));
var _ = require('underscore');
var util = require('util');
var ee = require('events').EventEmitter;
//var converter = require(path.join(__dirname, 'converter'));
//var ytdl = require('ytdl-core');
var YoutubeMp3Downloader = require('youtube-mp3-downloader');



var defaultOpts = {
    dest: path.resolve(os.homedir(), 'tdd', 'src')
}


/**
 * Downloader class
 *
 * give it the options of the downloads and it will download when you call fetch()
 * Extends EventEmitter
 *
 * @param {object} options
 * @param {string} options.videoID - youtube video id to download
 * @param {string} options.dest - destination directory to save the mp3 to
 */
var Downloader = function Downloader(options) {
    var self = this;
    ee.call(this);
    
    this.opts = _.extend({}, defaultOpts, options);
}
util.inherits(Downloader, ee);


/**
 * check
 *
 * aborts the download if there is already a matching mp3 file
 *
 * @returns {object} Downloader - returns self (this) for chainable function calls
 */
Downloader.prototype.check = function check() {
    var self = this;

    // abort if an mp3 for this video already exists locally
    fs.readFile(path.join(self.opts.dest, self.opts.videoID, '.mp3'), function(err, f) {
	if (err)
	    if (err.code !== 'ENOENT')
		self.emit("error", err);
	if (f)
	    self.emit("error", new Error('mp3 already exists for this video'));

	//console.log(self);
    });
    return self;
}


    


/**
 * fetch
 *
 * downloads a youtube video given its youtube video id
 *
 * @event complete
 * @event progress
 * @event error
 */
Downloader.prototype.fetch = function fetch() {
    var self = this;
    
    if (typeof self.opts.videoID !== 'string')
	throw new Error('downloader.fetch() first param must be a {string} youtube videoID. got instead-- '+videoID);
    if (!path.isAbsolute(self.opts.dest))
	self.emit("error", new Error('downloader.fetch() requires an absolute path. got instead-- '+self.opts.dest), null);
    
    
    
    // prepare for download
    console.log('downloading video id %s, to file %s', self.opts.videoID, self.opts.dest);
    var YD = new YoutubeMp3Downloader({
	"ffmpegPath": "/usr/bin/ffmpeg",                       // Where is the FFmpeg binary located? 
	"outputPath": self.opts.dest,                                    // Where should the downloaded and encoded files be stored? 
	"youtubeVideoQuality": "highest",                      // What video quality should be used? 
	"queueParallelism": 2,                                 // How many parallel downloads/encodes should be started? 
	"progressTimeout": 2000                                // How long should be the interval of the progress reports 
    });
    
    
    //Download video and save as MP3 file
    var fileName = self.opts.videoID+'.mp3';
    console.log("DEBUG: %s <-- vidID,    %s <--- fileName", self.opts.videoID, fileName);
    
    YD.download(self.opts.videoID, fileName);
    
    
    YD.on("finished", function(data) {
	self.emit("complete", path.join(self.opts.dest, fileName));
    });
    
    YD.on("error", function(err) {
	self.emit("error", err);
    });
    
    YD.on("progress", function(progress) {
	self.emit("progress", progress);
    });
    
    
    return self;
}


module.exports = Downloader;
