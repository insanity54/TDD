var path = require('path');
var async = require('async');
var iprofessor = require(path.join(__dirname, 'ipfs-professor'));
var downloader = require(path.join(__dirname, 'downloader'));
var converter = require(path.join(__dirname, 'converter'));



const c = 8; // concurrency (number of tasks to run at once)


var q = async.queue(function(video, cb) {
  // see if video is new to iprofessor
  iprofessor.research(video.id, function(err, findings) {
    if (err) return cb(err);
    if (!findings.isNew) return cb(null);

    // download new video
    downloader.fetch(video.id, function(err, dl) {
      if (err) return cb(err);

      // convert to mp3
      

    });

  });

  // convert to mp3
  // store locally
}, c);


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



module.exports = q;
