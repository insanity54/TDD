/**
 * the overlord orders things around,
 * keeps things in check,
 * eats your babies if you misbehave. BEWARE!
 */

var path = require('path');
var os = require('os');
var fs = require('fs');
var _ = require('underscore');
var ee = require('events').EventEmitter;
var util = require('util');
var async = require('async');
var Youtube = require(path.join(__dirname, 'youtube'));
var Queue = require(path.join(__dirname, 'queue'));
var informant = require(path.join(__dirname, 'informant'));
var Validator = require(path.join(__dirname, 'validator'));
var Downloader = require(path.join(__dirname, 'downloader'));
var Builder = require(path.join(__dirname, 'builder'));


var defaultOpts = {
    channel: 'UCqNCLd2r19wpWWQE6yDLOOQ',
    mp3Directory: path.join(os.homedir(), 'tdd', 'src')
}


//https://www.youtube.com/xml/feeds/videos.xml?channel_id=UCqNCLd2r19wpWWQE6yDLOOQ



/**
 * Overlord Class
 *
 * @param {object} options
 * @param {object} options.youtube - the youtube module
 * @param {object} options.queue   - the queue module
 * @param {string} options.channel - string of the youtube channel to overwatch
 */
var Overlord = function Overlord(options) {
    var self = this;
    ee.call(self);
    
    self.opts = _.extend({}, defaultOpts, options);
    
    if (typeof self.opts.channel === 'undefined') throw new Error('overlord must get a {string} channel as option');

    
    self.channel = self.opts.channel;
    self.count = 0; // keeps track of how many items have been sent to the queue & processed
    
}
util.inherits(Overlord, ee);



Overlord.prototype.begin = function begin() {
    var self = this;

    console.log(self.opts);
    console.log("TDD BEGIN");

    // async.series([
    //     youtube.findVideos.bind(self),
    //     download.bind(self),
    //     validate.bind(self),
    //     tagger.tag.bind(self),
    //     builder.build.bind(self)
    // ],
    //     function(err, results) {
    //         if (err) throw err;
    //         for (var i=0; i>results.length; i++) {
    //             console.log(results[i]);
    //         }
    //     }
    
    
    async.series(
	[
	    self.download.bind(self),     // download youtube videos as mp3
	    self.validate.bind(self),     // validate mp3 files for integrity
	    self.build.bind(self),        // build the static html website
	],
	function(err, results) {
	    if (err) throw err;
	    for (i=0; i>results.length; i++) {
		console.log(results[i]);
	    }

	    console.log("TDD COMPLETE");	    
	});


	    

}


// @todo implement reactive podcastification
//Overlord.prototype.watch = function watch() {
  // var yt = this.youtube.watch(channel || this.opts.channel);
  // yt.on('upload', function(deets) {
  // });
//}

Overlord.prototype.build = function build(cb) {
    var self = this;
    
    var builder = new Builder({
	cwd: self.opts.cwd,
	src: self.opts.src,
	dest: self.opts.dest,
	podcastTitle: self.opts.podcastTitle,
	podcastDesc: self.opts.podcastDesc,
	podcastLink: self.opts.podcastLink,
	podcastImage: self.opts.podcastImage,
	podcastCopyright: self.opts.podcastCopyright,
	podcastAuthor: self.opts.podcastAuthor,
	podcastAuthorEmail: self.opts.podcastAuthorEmail,
	podcastAuthorLink: self.opts.podcastAuthorLink,
	podcastWebsite: self.opts.podcastWebsite,
	podcastIPNS: self.opts.podcastIPNS,

    });
    builder.build(function(err) {
	if (err) throw err;
	return cb(null);
    });
}











/**
 * validate all downloaded MP3s
 *
 * @param {onValidatedCallback} cb
 */
Overlord.prototype.validate = function validate(cb) {

    var self = this;
    if (typeof self.opts.mp3Directory === 'undefined') throw new Error('self.opts.mp3 directory is required, but was undefined');
    var directory = self.opts.mp3Directory;

    var validator = new Validator();

    fs.readdir(directory, function(err, files) {
        if (err) throw err;
        //console.log(files);

	self.invalid = [];

	// create a validation queue
	// this is done so we don't get rate limited by youtube
	var q = async.queue(function(task, cb) {
	    console.log('validating %s', task.file);
	    setTimeout(function() {
		validator.validate(task.file, function(err, isValid) {
		    if (err) throw err;
		    var res = {};
		    res.file = task.file;
		    res.isValid = isValid;
		    cb(err, res);
		});
	    }, 2000);
	}, 10); //concurrency #

	
        // validate all mp3s
	var count = 0;
        for (var i=0; i<files.length; i++) {
            if (path.extname(files[i]) === '.mp3') {

		// do the following with all the mp3s
		count+=1;
		var f = path.join(directory, files[i]);
		q.push({ file: f }, function(err, result) {
		    // validation complete
		    if (err) throw err;
		    count-=1;
		    //console.log('callback data or no? err: %s valid:%s', err, result.isValid);
		    
		    if (!result.isValid) self.invalid.push(result.file);

		    if (count == 0) {
			console.log('vvv invalid files (self.invalid) vvv');
			console.log(self.invalid);


			// if there are no invalid files, call back
			if (self.invalid.length === 0) return cb(null, self.invalid);
			    

			
			// re-download any invalid files
			
			// create download queue
			var dq = async.queue(function(task, cb) {
			    var opts = { force: true, videoID: task.videoID };
			    var downloader = new Downloader(opts);
			    downloader.fetch();
			    downloader.on("error", function(err) { cb(err, null) });
			    downloader.on("complete", function(path) {
				var res = {};
				res.path = path;
				cb(null, res);
			    });
				
			});


			var ct=0;
			for (i=0; i<self.invalid.length; i++) {
			    ct+=1;
			    dq.push({videoID: path.basename(self.invalid[i], '.mp3')}, function(err, results) {
				if (err) throw err;
				ct-=1;

				console.log("re-downloaded %s", results.path);

				// if the last task in the queue has returned, call back
				if (ct == 0) {
				    return cb(null, self.invalid);
				}
			    });
			}
			
		    }	    
		});
	    }
        }
    });

}






Overlord.prototype.download = function download(cb) {
    console.log('downloading');
    var self = this;
    self.yt = new Youtube();
    self.queue = new Queue();
    

    // get videos belonging to yt channel
    // forEach video
    //   add to download queue


    if (self.nextPageToken) {
	//console.log('downloading with npt');
	// if calling the next page of results has been queued by a previous call
	// of self.download, get the next page of results

	// wait a few seconds so as not to get rate limited
	self.requestCount++;
	setTimeout(function() {
	    self.requestCount--;
	    self.yt.getChannelUploads(self.channel, self.nextPageToken, function(err, vData) {
		if (err) console.error('overlord encountered err getting next page of channel videos-- ' + err);

		// send each video snippet to the queues
		for (var i=0; i<vData.items.length; i++) {
		    //self.queue.i.push({videoid: vData.items[i].snippet.
		    //console.log(vData.items[i].snippet.title);
		    self.count++;
		    self.queue.push(vData.items[i].snippet, function(err) {
			if (err) console.error(err);
			self.count--;
			// if (self.requestCo == 0) { // dont callback if there are still requests in progress
			//     console.log('QUEUE done. Processed %s videos.', self.queue.processCount);
			//     return cb(null);
			// }			
		    });
		}

		
		//console.log(vData);
		//console.log('!!! nextPageToken-- %s  prevPageToken-- %s', vData.nextPageToken, vData.prevPageToken);


		if (typeof vData.nextPageToken === 'undefined') {
		    // there are no more pages		    
		    self.nextPageToken = '';
		    self.queue.on("drain", function() {
			console.log('QUEUE done.');
			return cb(null);
		    });		
		    
		}
		else {
		    
		    // there are more pages, so retrieve the next page
		    self.nextPageToken = vData.nextPageToken;
		    //console.log('next page up is %s', vData.nextPageToken);
		    self.download(cb);
		}
		
	    });
	}, 2000);
    }

    else {
	//console.log('downloading withOUT npt');
	// next page of results has not been queued by a previous call of self.download
	self.yt.getChannelUploads(self.channel, function(err, vData) {
	    if (err) {
		console.error('************************************************8 overlord could not get channel videos');
		console.error(err);
	    }

	    // send each video snippet to the queues
	    for (var i=0; i<vData.items.length; i++) {
		//self.queue.i.push({videoid: vData.items[i].snippet.
		//console.log(vData.items[i].snippet.title);
		self.count++;
		self.queue.push(vData.items[i].snippet, function(err) {
		    if (err) console.log(err);
		    self.count--;
		});
		// dont call back if requests are still in progress
		// 
		// wait for
		//   - last page
		//   - no requests in progress
		//
		// once those conditions happen, listen for queue to be drained
		// if (self.nextPageToken == '' && self.requestCount == 0) { 
		//     console.log('waiting for queue drain');
		    

		// }

	    }

	    console.log(vData.nextPageToken);
	    if (!vData.nextPageToken) {
		// this was the last page of results
		// clear the nextPageToken.
		// getting here means that all the needed information from youtube has
		// been fetched, but there are potentially downloads going on, handled by the queue & download module.
		// it is not safe to proceed until the queue module emits "complete", which is detected below.
		self.nextPageToken = '';
	    }
	    
	    else {
		// if there is another page of results, queue another call to retrieve the next page	    
		self.nextPageToken = vData.nextPageToken;
		self.download(cb);
	    }
	    
	});
    }

}





module.exports = Overlord;
