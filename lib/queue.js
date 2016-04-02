var path = require('path');
var async = require('async');
var os = require('os');
var _ = require('underscore');
var iprofessor = require(path.join(__dirname, 'ipfs-professor'));
var downloader = require(path.join(__dirname, 'downloader'));
var hoarder = require(path.join(__dirname, 'hoarder'));
//var converter = require(path.join(__dirname, 'converter'));


// concurrency (number of tasks to run at once)
const defaultOptions = {
    downloadConcurrency: 2,
    intelConcurrency: 2,
    dlPath: path.join(os.homedir(), 'tdd')
}




var Queue = function Queue(options) {
    var self = this;
    this.opts = _.extend({}, defaultOptions, options);

    this._q = async.queue(function(video, cb) {
	console.log('dl queue');
	console.log(video.resourceId.videoId);
	
	
	// see if video is new to iprofessor
	iprofessor.research(video.resourceId.videoId, function(err, findings) {
	    if (err) return cb(err);
	    if (!findings.isNew) return cb(null);
	    
	    async.parallel([
		function(cb) {
		    
		    // download new video as mp3
		    // this creates a file at /home/$USER/tdd/mp3/{{video.id}}.mp3
		    setTimeout(function() {
			console.log('simulate fetch. fetching- '+video.title);
			return cb(null);
		    }, 2000);
		    // downloader.fetch(video.resourceId.videoId, self.opts.dlPath, function(err, vid) {
		    // 	if (err) cb(err, null);
		    // 	return cb(null, vid);
		    //});
		},
		function(cb) {
		    
		    // save video metadata as .json
		    setTimeout(function() {
			console.log('simulate hoarder');
			return cb(null);
		    }, 2000);		    
		    // hoarder.save(video,
		    // 		 path.join(self.opts.dlPath, video.resourceId.videoId+'.json'), 
		    // 		 function(err) {
		    // 		     if (err) cb(err);
		    // 		     return cb(null);
		    // 		 });
		}
	    ], function(err, results) {
		// when mp3 is downloaded
		// and metadata is downloaded
		// write MP3 ID3 tags into the MP3
		if (err) throw err;
		console.log('parallel done');
		//console.log(results);
		cb(null, results);
	    });
	});
    }, self.opts.downloadConcurrency);
    
}



/**
 * download queue
 *
 * accepts a youtube snippet
 *
 *
 * blob sample:
 *
 * { publishedAt: '2016-01-21T21:47:04.000Z',
 *   channelId: 'UCqNCLd2r19wpWWQE6yDLOOQ',
 *   title: 'wow such money - What is Dogecoin?',
 *   description: 'Each Dogecoin may be worth very little, but collectively the coin\'s market cap places it among the top c…
 *   thumbnails:
 *    { default:
 *       { url: 'https://i.ytimg.com/vi/LxhR2WBYI-I/default.jpg',
 *         width: 120,
 *         height: 90 },
 *      medium:
 *       { url: 'https://i.ytimg.com/vi/LxhR2WBYI-I/mqdefault.jpg',
 *         width: 320,
 *         height: 180 },
 *      high:
 *       { url: 'https://i.ytimg.com/vi/LxhR2WBYI-I/hqdefault.jpg',
 *         width: 480,
 *         height: 360 },
 *      standard:
 *       { url: 'https://i.ytimg.com/vi/LxhR2WBYI-I/sddefault.jpg',
 *         width: 640,
 *         height: 480 } },
 *   channelTitle: 'The Daily Decrypt',
 *   playlistId: 'UUqNCLd2r19wpWWQE6yDLOOQ',
 *   position: 50,
 *   resourceId: { kind: 'youtube#video', videoId: 'LxhR2WBYI-I' } }
 *
 * @param {function} @todo idk how to document this
 *
 */
Queue.prototype.push = function(video) {

    var self = this;
    self._q.push(video, function(err, res) {
	if (err) throw err;
	console.log('push dun -'+res);
    });

}







// Queue.prototype.i = function(video) {
//     async.queue(function(video, cb) {
// 	var self = this;
// 	console.log('intel queue running');
//     }, self.opts.intelConcurrency);
// }



//
// // assign a callback
// q.drain = function() {
//     console.log('all items have been processed');
// }
//
// // add some items to the queue
// q.push({name: 'foo'}, function (err) {
//     console.log('finished processing foo');
// });
// q.push({name: 'bar'}, function (err) {
//     console.log('finished processing bar');
// });




//
//
// var q = async.queue(function (task, callback) {
//     console.log('hello ' + task.name);
//     callback();
// }, 2);
//
// // per video
// - download
// - convert


// per all
// - render
// - ipfs add



module.exports = Queue;
