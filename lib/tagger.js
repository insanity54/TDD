//var id3 = require('id3js'); // only parses ID3
//var nodeID3 = require('node-id3'); // only writes ID3
var path = require('path');
var fs = require('fs');
var id3 = require('node-id3');



/**
 * read
 *
 * reads the ID3 tags of a mp3 file
 *
 * @param {String} file - path to an mp3 file
 * @param {onReadCallback} cb
 */
var read = function read(file, cb) {
    throw new Error('not implemented'); // node-id3 does not implement reading!
}
/**
 * @callback {onReadCallback}
 * @param {Error} err
 * @param {object} tags
 * @param {string} tags.artist
 * @param {string} tags.title
 * @param {string} tags.year
 * @param {string} tags.comment
 */







/**
 * write
 *
 * writes ID3 tags to an MP3.
 *
 * @param {String} file - the filename of the Mp3 to write to
 * @param {object} tags - the ID3 tags to write the mp3
 * @param {onWroteCallback} cb
 */
var write = function write(file, tags, cb) {
    if (!path.isAbsolute(file)) throw new Error('tagger.write() first param must be an absolute path! got instead ' + file);
    if (typeof tags === 'undefined') throw new Error('tagger.write() second param must be an object of tags');
    if (typeof cb !== 'function') throw new Error('tagger.write() third param must be a callback');

    var success = id3.write(tags, file);

    if (!success) {
      return cb(new Error('could not write tags!'), null)
    }
    return cb(null, tags);
}
/**
 * @callback {onWroteCallback}
 * @param {Error} err
 * @param {object} tags - the tags that were written
 * @param {string} tags.title
 * @param {string} tags.artist
 * @param {string} tags.year
 * @param {string} tags.comment
 */



module.exports = {
    read: read,
    write: write
}
