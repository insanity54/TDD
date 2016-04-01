/**
 * the overlord orders things around,
 * keeps things in check,
 * eats your babies if you misbehave.
 *
 * BEWARE!
 */

var _ = require('underscore');

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
  this.opts = _.extend({}, defaultOpts, options);

  if (typeof this.opts.youtube === 'undefined') throw new Error('overlord must get the youtube module as option');
  if (typeof this.opts.queue === 'undefined') throw new Error('overlord must get the queue module as option');
  if (typeof this.opts.channel === 'undefined') throw new Error('overlord must get a {string} channel as option');

  this.youtube = this.opts.youtube;
  this.queue = this.opts.queue;
  this.channel = this.opts.channel;

 }


Overlord.prototype.watch = function watch(channel) {
  // var yt = this.youtube.watch(channel || this.opts.channel);
  // yt.on('upload', function(deets) {
  // });
}


Overlord.prototype.download = function download(channel) {
    var self = this;
    var yt = this.youtube;

    // get videos belonging to yt channel
    // forEach video
    //   add to download queue


    if (self.nextPageToken) {
	// if calling the next page of results has been queued by a previous call
	// of self.download, get the next page of results

	// wait a few seconds so as not to get rate limited
	setTimeout(function() {
	    yt.getChannelUploads(this.channel, self.nextPageToken, function(err, vData) {
		if (err) console.error('overlord encountered err getting next page of channel videos-- ' + err);

		// format vData appropriatly for sending to download queue
		// ? maybe, maybe not?



		// debug
		console.log(vData.items[i].snippet);
		
		// send each video snippet to the queues
		for (var i=0; i>vData.items.length; i++) {
		    
		    //self.queue.i.push({videoid: vData.items[i].snippet.
		    self.queue.dl.push(vData.items[i].snippet);
		}

		
	    });
	}, 2000);
    }

    else {
	// next page of results has not been queued by a previous call of self.download
	yt.getChannelUploads(this.channel, function(err, vData) {
	    if (err) {
		console.error('overlord could not get channel videos');
		console.error(err);
	    }
	    
	    if (!vData.nextPageToken) {
		// this was the last page of results
		
		
	    }
	    
	    else {
		// if there is another page of results, queue another call to retrieve the next page	    
		
		self.nextPageToken = vData.nextPageToken;
	    }
	    
	    
	    nextPageToken: 'CDIQAA';
	    //console.log(videos);
	    //console.log(this.queue);
	    //self.queue.download.push(videos)
	    
	    
	});
    } // /else
	    
}



module.exports = Overlord;
