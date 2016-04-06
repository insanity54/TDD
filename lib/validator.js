/**
 * validates that downloaded mp3s are complete, lengthy, and non-corrupted
 */

var ffmpeg = require('fluent-ffmpeg');
var path = require('path');
var moment = require('moment');
var youtube = require(path.join(__dirname, 'youtube'));


/**
 * validate
 *
 * @param {string} mp3File - absolute path to the mp3 to validate
 * @param {onValidatedCallback} cb
 */
var validate = function validate(mp3File, cb) {
    if (!path.isAbsolute(mp3File))
	throw new Error('mp3File must be an absolute path');
    if (typeof cb !== 'function')
	throw new Error('second param must be a callback function.');

    // get length of mp3 file
    ffmpeg(mp3File, {timeout: 30})
    .ffprobe(function(err, data) {
	if (err) return cb(err, null);
	var mp3Duration = moment.duration(data.format.duration, 'seconds');

	// get length youtube says it should be
	youtube.getVideoContentDetails(path.basename(mp3File, '.mp3'), function(err, deets) {
	    if (err) return cb(err, false);
	    var ytDuration = moment.duration(deets.items[0].contentDetails.duration);

	    console.log('mp3 duration is %s and youtube duration is %s',
			mp3Duration,
			ytDuration);

	    // compare two durations and return false if not the same
	    // or true if they are.
	    // there is a 1 second leeway on difference in video durations
	    console.log(mp3Duration.asSeconds());
	    console.log(ytDuration.asSeconds());
	    var difference = function difference(a, b) {
		if (a==b) return 0;
		if (a>b) return a-b;
		else return b-a;
	    }
	    console.log('diff is %s',
			difference(
			    mp3Duration.asSeconds(),
			    ytDuration.asSeconds()
			));
	    if (difference(ytDuration.asSeconds(), mp3Duration.asSeconds()) > 1) return cb(null, false);
	    return cb(null, true);
	    
	});
    });
}
/**
 * @callback {onValidatedCallback}
 * @param {error} err
 * @param {boolean} isValid - true if mp3 is valid
 */


module.exports = {
    validate: validate
}


