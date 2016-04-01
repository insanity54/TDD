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


var Overlord = function Overlord(options) {
  this.opts = _.extend({}, defaultOpts, options);
}

Overlord.Prototype.watch = function watch(channel) {
  var yt = youtube.watch(channel || this.opts.channel);

  yt.on('upload', function(deets) {

  });
}

Overlord.Prototype.download = function download(channel) {

}



module.exports = Overlord;
