var path = require('path');
var async = require('async');
var iprofessor = require(path.join(__dirname, 'ipfs-professor'));
var downloader = require(path.join(__dirname, 'downloader'));
//var converter = require(path.join(__dirname, 'converter'));


// concurrency (number of tasks to run at once)
const downloadConcurrency = 2;
const intelConcurrency = 2;


var dlQueue = async.queue(function(video, cb) {
  // see if video is new to iprofessor
    iprofessor.research(video.id, function(err, findings) {
	if (err) return cb(err);
	if (!findings.isNew) return cb(null);
	
	async.parallel([
	    function(cb) {
		
		// download new video as mp3
		// this creates a file at /home/$USER/tdd/mp3/{{video.id}}.mp3
		downloader.fetch(video.id, function(err, vid) {
		    if (err) cb(err, null);
		    return cb(null, vid);
		});
	    },
	    function(cb) {

		// fetch video metadata
		// this creates a file at /home/$USER/tdd/data/{{video.id}}.json
		youtube.getVideoDetails(video.id, function(err, deets) {
		    if (err) cb(err, null);
		    return cb(null, deets);
		});
	    }
	], function(err, results) {
	    // when mp3 is downloaded
	    // and metadata is downloaded
	    // write MP3 ID3 tags into the MP3
	    if (err) console.error(err);
	    console.log('got dun');
	    console.log(results);
	});
    });
}, downloadConcurrency);



var intelQueue = async.queue(function(, cb) {
    
}, intelConcurrency);



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



module.exports = {
    dl: dlQueue,
    intel: intelQueue
    
};
