/**
 * the overlord orders things around,
 * keeps things in check,
 * eats your babies if you misbehave.
 *
 * BEWARE!
 */

var _ = require('underscore');
var ee = require('events').EventEmitter;
var util = require('util');


var defaultOpts = {
  channel: 'UCqNCLd2r19wpWWQE6yDLOOQ'
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
  ee.call(this);
  this.opts = _.extend({}, defaultOpts, options);

  if (typeof this.opts.youtube === 'undefined') throw new Error('overlord must get the youtube module as option');
  if (typeof this.opts.queue === 'undefined') throw new Error('overlord must get the queue module as option');
  if (typeof this.opts.channel === 'undefined') throw new Error('overlord must get a {string} channel as option');

  this.youtube = this.opts.youtube;
  this.queue = this.opts.queue;
  this.channel = this.opts.channel;

}
util.inherits(Overlord, ee);



Overlord.prototype.watch = function watch() {
  // var yt = this.youtube.watch(channel || this.opts.channel);
  // yt.on('upload', function(deets) {
  // });
}


Overlord.prototype.download = function download() {
    var self = this;
    var yt = this.youtube;

    // get videos belonging to yt channel
    // forEach video
    //   add to download queue


    if (self.nextPageToken) {
	console.log('downloading with npt');
	// if calling the next page of results has been queued by a previous call
	// of self.download, get the next page of results

	// wait a few seconds so as not to get rate limited
	setTimeout(function() {
	    yt.getChannelUploads(self.channel, self.nextPageToken, function(err, vData) {
		if (err) console.error('overlord encountered err getting next page of channel videos-- ' + err);

		// format vData appropriatly for sending to download queue
		// ? maybe, maybe not?


		// debug
		//console.log('%s, %s', vData.items[0].snippet.title, vData.nextPageToken);
		//console.log(vData);

		
		// send each video snippet to the queues
		for (var i=0; i<vData.items.length; i++) {
		    //self.queue.i.push({videoid: vData.items[i].snippet.
		    console.log(vData.items[i].snippet.title);
		    self.queue.push(vData.items[i].snippet);
		}

		

		console.log(vData);
		console.log('!!! nextPageToken-- %s  prevPageToken-- %s', vData.nextPageToken, vData.prevPageToken);
		
		// there are more pages, so retrieve the next page
		if (typeof vData.nextPageToken === 'undefined')
		    self.nextPageToken = null;
		else {
		    self.nextPageToken = vData.nextPageToken;
		    console.log('next page up is %s', vData.nextPageToken);		    
		    self.download();		    
		}
		
		
	    });
	}, 2000);
    }

    else {
	console.log('downloading withOUT npt');	
	// next page of results has not been queued by a previous call of self.download
	yt.getChannelUploads(self.channel, function(err, vData) {
	    if (err) {
		console.error('************************************************8 overlord could not get channel videos');
		console.error(err);
	    }

	    // send each video snippet to the queues
	    for (var i=0; i<vData.items.length; i++) {
		//self.queue.i.push({videoid: vData.items[i].snippet.
		console.log(vData.items[i].snippet.title);
		self.queue.push(vData.items[i].snippet);
	    }
	    
	    
	    if (!vData.nextPageToken) {
		// this was the last page of results
		// send data to queue
		self.nextPageToken = '';
	    }
	    
	    else {
		// if there is another page of results, queue another call to retrieve the next page	    
		self.nextPageToken = vData.nextPageToken;
		self.download();		
	    }

	    

	    	    
	    
	});
    } // /else


    // react when downloading is complete
    self.queue.on('complete', function(err) {
	if (err) console.error(err);
	self.emit('complete');
    });
}





module.exports = Overlord;
