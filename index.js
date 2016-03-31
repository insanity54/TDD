var path = require('path');
var youtube = require(path.join(__dirname, 'lib', 'youtube'));
var downloader = require(path.join(__dirname, 'lib', 'downloader'));
var iprofessor = require(path.join(__dirname, 'lib', 'ipfs-professor'));
var queue = require(path.join(__dirname, 'lib', 'queue'));


// make sure the youtube api key exists in the system environment
if (typeof process.env.YOUTUBE_API_KEY === 'undefined') throw new Error('YOUTUBE_API_KEY is not defined in your environment, and it is required.')


// when a TDD YT video is uploaded, download it and podcastify.
// youtube.on('upload', function(video) {
//   queue.dl.push({ videoID: video.id });
// });


// when this program starts up, get list of all TDD vids and download any
// that have not been podcastified.
youtube.getChannelUploads(function(err, videos) {
    if (err) throw err;
    console.log(videos.items[0].snippet);

    queue.intel.push(videos)
  //queue.dl.push(videos)
});


// when program starts
//   get array of videos from channel
//   create videoID.json
//   create videoID.mp3
