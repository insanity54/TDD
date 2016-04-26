/**
 * validates that downloaded mp3s are complete, lengthy, and non-corrupted
 */

var ffmpeg = require('fluent-ffmpeg');
var path = require('path');
var moment = require('moment');
var Youtube = require(path.join(__dirname, 'youtube'));




var Validator = function Validator() {
    
}




/**
 * validate
 *
 * @param {string} mp3File - absolute path to the mp3 to validate
 * @param {onValidatedCallback} cb
 */
Validator.prototype.validate = function validate(mp3File, cb) {
    if (!path.isAbsolute(mp3File))
	throw new Error('mp3File must be an absolute path');
    if (typeof cb !== 'function')
	throw new Error('second param must be a callback function.');


    var youtube = new Youtube();
    
    // get length of mp3 file
    ffmpeg(mp3File, {timeout: 30})
    .ffprobe(function(err, data) {
	if (err) return cb(err, null);
	var mp3Duration = moment.duration(data.format.duration, 'seconds');

	// get length youtube says it should be
	youtube.getVideoContentDetails(path.basename(mp3File, '.mp3'), function(err, deets) {
	    if (err) return cb(err, false);
	    var ytDuration = moment.duration(deets.items[0].contentDetails.duration);

	    // console.log('mp3 duration is %s and youtube duration is %s',
	    // 		mp3Duration,
	    // 		ytDuration);

	    // compare two durations and return false if not the same
	    // or true if they are.
	    // there is a 1 second leeway on difference in video durations
	    //console.log(mp3Duration.asSeconds());
	    //console.log(ytDuration.asSeconds());
	    var difference = function difference(a, b) {
		if (a==b) return 0;
		if (a>b) return a-b;
		else return b-a;
	    }
	    // console.log('diff is %s',
	    // 		difference(
	    // 		    mp3Duration.asSeconds(),
	    // 		    ytDuration.asSeconds()
	    // 		));
	    if (difference(ytDuration.asSeconds(), mp3Duration.asSeconds()) > 2) return cb(null, false);
	    return cb(null, true);
	    
	});
    });
}
/**
 * @callback {onValidatedCallback}
 * @param {error} err
 * @param {boolean} isValid - true if mp3 is valid
 */




/**
 * crawl
 *
 * crawls a directory, validating every mp3 found
 *
 * @param {onCrawledCallback} cb
 *
 */
// Validator.prototype.crawl = function crawl(cb) {
//     var self = this;
//     if (typeof self.opts.mp3Directory === 'undefined') throw new Error('self.opts.mp3 directory is required and was undefined');
//     var directory = self.opts.mp3Directory;
	
//     fs.readdir(directory, function(err, files) {
// 	if (err) throw err;
// 	console.log(files);

// 	// validate all mp3s	
// 	for (var i=0; i<files.length; i++) {
// 	    if (path.extname(files[i]) === '.mp3') {
// 		self.validate(files[i], function
		
// 	    }
// 	}


//     /**
/**
           // grab all the *.json files and compile them into one manifest.json
           
    fs.readdir(self.opts.src, function(err, files) {
        if (err) throw err;
	console.log(files);
	var manifest = [];
	// go through each file, ignoring all but .json files
        
        for (var i=0; i<files.length; i++) {
            if (path.extname(files[i]) === '.json') {

                // ignore manifest.json which could be left over from previous runs                                                            
                if (files[i] !== 'manifest.json') {

                    // grab the json and add it to manifest                                                                                    
                    var j = require(path.join(self.opts.src, files[i]));
                    manifest.push(j);
                }
            }
        }


        // write manifest to dist directory                                                                                                    
        fs.writeFileSync(path.join(self.opts.dest, 'manifest.json'), JSON.stringify(manifest), 'utf8');


	*/
//}
/**
 * @callback {onCrawledCallback}
 * @param {error} err
 */




module.exports = Validator;



