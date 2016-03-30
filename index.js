var path = require('path');
var getChannel = require(path.join(__dirname, 'lib'));

if (typeof process.env.YOUTUBE_API_KEY === 'undefined') throw new Error('YOUTUBE_API_KEY is not defined in your environment, and it is required.')


youtube.getChannelUploads(function(err, videos) {
  if (err) throw err;
  
});
