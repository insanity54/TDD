var youtube = require(path.join(__dirname, 'youtube'));

youtube.getChannelUploads(function(err, videos) {
  if (err) throw err;
  console.log(videos);


});
