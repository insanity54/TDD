var path = require('path');
var youtube = require(path.join(__dirname, 'lib', 'youtube'));
var downloader = require(path.join(__dirname, 'lib', 'downloader'));
var iprofessor = require(path.join(__dirname, 'lib', 'ipfs-professor'));


// make sure the youtube api key exists in the system environment
if (typeof process.env.YOUTUBE_API_KEY === 'undefined') throw new Error('YOUTUBE_API_KEY is not defined in your environment, and it is required.')


// when a TDD YT video is uploaded, download it and podcastify.
youtube.on('upload', function(video) {
  queue.push({ videoID: video.id });
});


// when this program is starts up, get list of all TDD vids and download any
// that have not been podcastified.
youtube.getChannelUploads(function(err, videos) {
  queue.push(videos)
});
