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
    dest: path.resolve(os.homedir(), 'tdd', 'src'),
    force: false // if forced, will download even if file exists
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
Downloader.prototype.check = function check(cb) {
    var self = this;


    // set some useful vars
    self.dl = {};
    self.dl.fileName = self.opts.videoID+'.mp3';	
    self.dl.fullPath = path.join(self.opts.dest, self.dl.fileName);

    
    // abort if an mp3 for this video already exists locally
    fs.readFile(self.dl.fullPath, function(err, f) {
	if (err && err.code !== 'ENOENT')
	    return cb(err);
	
	if (f && !self.opts.force) {
	    console.log('skipping %s because it is already downloaded', self.dl.fileName);
	    //console.log(f);
	    return cb(new Error('mp3 already exists'));
	}

	if (self.opts.force) console.log('forcefully downloading %s', self.dl.fileName);


	// create download dir if not exist
	fs.mkdir(path.dirname(self.dl.fullPath), function(err) {
	    if (err && err.code !== 'EEXIST')
		self.emit("error", err);
	    else
		return cb(null); // all good, go ahead with fetch
	});
    });
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
    //console.log('downloading video id %s, to file %s', self.opts.videoID, self.opts.dest);
    var YD = new YoutubeMp3Downloader({
	"ffmpegPath": "/usr/bin/ffmpeg",                       // Where is the FFmpeg binary located? 
	"outputPath": self.opts.dest,                          // Where should the downloaded and encoded files be stored? 
	"youtubeVideoQuality": "highest",                      // What video quality should be used? 
	"queueParallelism": 2,                                 // How many parallel downloads/encodes should be started? 
	"progressTimeout": 2000                                // How long should be the interval of the progress reports 
    });
    



    // do checks to make sure directories exist, etc.
    self.check(function(err) {
	if (err && !/already exists/.test(err)) {
	    // emit error only if not an error we can handle
	    self.emit("error", err);
	}
	else if (err && /already exists/.test(err)) {
	    // if video already downloaded, just return the path of the mp3
	    self.emit("complete", path.join(self.opts.dest, self.dl.fileName));
	}
	else {
	    // Download video and save as MP3 file
	    YD.download(self.opts.videoID, self.dl.fileName);
	    YD.on("finished", function(data) {
		self.emit("complete", path.join(self.opts.dest, self.dl.fileName));
	    });
	    YD.on("error", function(err) {
		self.emit("error", err);
	    });
	    YD.on("progress", function(progress) {
		if (self.opts.force) progress['forced'] = true;
		self.emit("progress", progress);
	    });
	}
    });
}


module.exports = Downloader;
