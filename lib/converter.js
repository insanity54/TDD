var ffmpeg = require('fluent-ffmpeg');
var _ = require('underscore');

var convert = function convert(buffer, options, cb) {
  var opts = _.extend({}, options);

  var proc = new ffmpeg({ source: buffer , nolog: true, timeout: 60 })
    .withAudioCodec('libmp3lame')
    .toFormat('mp3')
    .saveToFile(opts.dest, function(stdout, stderr) {
        console.log('----- file converted successfully! -----');
    });
}



module.exports = {
  convert: convert
}
