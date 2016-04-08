/**
 * the hoarder saves everything. EVERYTHING.
 *
 * hoarder simply takes data and a filename and puts the data in the filename
 */


var fs = require('fs');
var path = require('path');


/**
 * saves JSON to the save directory
 *
 * @param {object} data - the data to write
 * @param {string} filePath - where to save the data
 * @param {onSavedCallback} cb
 */
var save = function save(data, filePath, cb) {
    if (typeof cb !== 'function') throw new Error('hoarder.save() third param must be callback');
    if (!path.isAbsolute(filePath)) throw new Error('filePath was not absolute!');

    fs.writeFile(filePath, JSON.stringify(data), 'utf8', function(err) {
	if (err) return cb(err);
	return cb(null);
    });
}
/**
 * @callback {onSavedCallback}
 * @param {Error} err
 */



module.exports = {
    save: save
}
		  
