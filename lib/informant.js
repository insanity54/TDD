/**
 * the overlord orders things around,
 * keeps things in check,
 * eats your babies if you misbehave. BEWARE!
 */

var path = require('path');
var _ = require('underscore');
var ee = require('events').EventEmitter;
var util = require('util');
var async = require('async');
var Youtube = require(path.join(__dirname, 'youtube'));
var queue = require(path.join(__dirname, 'queue'));




var defaultOpts = {
  channel: 'UCqNCLd2r19wpWWQE6yDLOOQ'
}


//https://www.youtube.com/xml/feeds/videos.xml?channel_id=UCqNCLd2r19wpWWQE6yDLOOQ



/**
 * Informant
 *
 * @param {object} options
 * @param {object} options.youtube - the youtube module
 * @param {object} options.queue   - the queue module
 * @param {string} options.channel - string of the youtube channel to overwatch
//  */
// var Overlord = function Overlord(options) {
//     var self = this;
//     ee.call(self);
    
//     self.opts = _.extend({}, defaultOpts, options);
    
//     if (typeof self.opts.channel === 'undefined') throw new Error('overlord must get a {string} channel as option');
    
//     self.channel = self.opts.channel;
//     self.count = 0; // keeps track of how many items have been sent to the queue & processed
    
// }
// util.inherits(Overlord, ee);



// Overlord.prototype.begin = function begin() {
//     var self = this;

//     console.log("TDD BEGIN");

//     // async.series([
//     //     youtube.findVideos.bind(self),
//     //     download.bind(self),
//     //     validate.bind(self),
//     //     tagger.tag.bind(self),
//     //     builder.build.bind(self)
//     // ],
//     //     function(err, results) {
//     //         if (err) throw err;
//     //         for (var i=0; i>results.length; i++) {
//     //             console.log(results[i]);
//     //         }
//     //     }
    
    
//     async.series(
// 	[
// 	    youtube.findVideos.bind(this),
// 	    downloader.download.bind(this),
// 	    //validate.
// 	    //self.download.bind(self),
// 	    //self.validate.bind(self),
// 	    //self.build.bind(self)
// 	],
// 	function(err, results) {
// 	    if (err) throw err;
// 	    for (i=0; i>results.length; i++) {
// 		console.log(results[i]);
// 	    }

	    
// 	});


	    
// 	    console.log("TDD COMPLETE");
// 	});
// }


// // @todo implement reactive podcastification
// //Overlord.prototype.watch = function watch() {
//   // var yt = this.youtube.watch(channel || this.opts.channel);
//   // yt.on('upload', function(deets) {
//   // });
// //}

// Overlord.prototype.build = function build(cb) {
//     console.log('OVERLORD: simulated build');
//     // @todo
//     setTimeout(function() {
// 	return cb(null);
//     }, 2000);
// }


// Overlord.prototype.validate = function validate(cb) {
//     console.log('OVERLORD: simulated validation');
//     // @todo
//     setTimeout(function() {
// 	return cb(null);
//     }, 2000);
// }

    


var download = function download(cb) {
    console.log('downloading');
    var self = this;
    var yt = new Youtube();

    // get videos belonging to yt channel
    // forEach video
    //   add to download queue


    if (self.nextPageToken) {
	//console.log('downloading with npt');
	// if calling the next page of results has been queued by a previous call
	// of self.download, get the next page of results

	// wait a few seconds so as not to get rate limited
	setTimeout(function() {
	    yt.getChannelUploads(self.channel, self.nextPageToken, function(err, vData) {
		if (err) console.error('overlord encountered err getting next page of channel videos-- ' + err);

		// send each video snippet to the queues
		for (var i=0; i<vData.items.length; i++) {
		    //self.queue.i.push({videoid: vData.items[i].snippet.
		    //console.log(vData.items[i].snippet.title);
		    self.count++;
		    queue.push(vData.items[i].snippet, function(err) {
			if (err) console.error(err);
			self.count--;
			if (self.count == 0) {
			    console.log('QUEUE done. Processed %s videos.', self.count);
			    return cb(null);
			}			
		    });
		}

		
		//console.log(vData);
		//console.log('!!! nextPageToken-- %s  prevPageToken-- %s', vData.nextPageToken, vData.prevPageToken);
		
		// there are more pages, so retrieve the next page
		if (typeof vData.nextPageToken === 'undefined')
		    self.nextPageToken = null;
		else {
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
	yt.getChannelUploads(self.channel, function(err, vData) {
	    if (err) {
		console.error('************************************************8 overlord could not get channel videos');
		console.error(err);
	    }

	    // send each video snippet to the queues
	    for (var i=0; i<vData.items.length; i++) {
		//self.queue.i.push({videoid: vData.items[i].snippet.
		//console.log(vData.items[i].snippet.title);
		self.count++;
		queue.push(vData.items[i].snippet, function(err) {
		    if (err) console.log(err);
		    self.count--;
		    if (self.count == 0) {
			console.log('QUEUE done. Processed %s videos.', self.count);
			return cb(null);
		    }
		});
	    }
	    
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





module.exports = {
    download: download
}
