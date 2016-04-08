/**
 * download and save a youtube thumbnail
 */



var request = require('request');
var path = require('path');
var fs = require('fs');


var get = function get(thumbnailUrl, saveToPath, cb) {
    if (typeof cb !== 'function') throw new Error('call it correctly! third param must be a callback function');
    if (typeof saveToPath !== 'string')
	throw new Error('call it corerctly! second param must be a string (path) to the file you want to save the thumbnail')
    if (!path.isAbsolute(saveToPath))
	throw new Error('call it correctly! second param must be an absolute path to the file you want to save as. ex: /tmp/mypic.jpg')
    if (typeof thumbnailUrl !== 'string')
	throw new Error('call it correctly! first param must be a string (url) to the thumbnail you want to dl')
    
    request
	.get(thumbnailUrl)
	.on('response', function(response) {
	    if (!response.statusCode == 200)
		console.error('did not get http code 200 when downloading image. got: '+response.statusCode);
	})
        .on("end", function() {
	    return cb(null);
	})    
	.pipe(fs.createWriteStream(saveToPath));

}


module.exports = {
    get: get
}
