//var id3 = require('id3js'); // only parses ID3
//var nodeID3 = require('node-id3'); // only writes ID3
var path = require('path');
var fs = require('fs');
var taglib = require('taglib');



// var config = {
//   binaryDataDirectory: "/tmp",
//   binaryDataUrlPrefix: "/attachments",
//   binaryDataMethod: tagio.BinaryDataMethod.ABSOLUTE_URL,
//   apeSave: true,
//   id3v1Save: true,
//   id3v1Encoding: tagio.Encoding.UTF8,
//   id3v2Save: true,
//   id3v2Version: 4,
//   id3v2Encoding: tagio.Encoding.UTF8,
//   id3v2UseFrameEncoding: false
// };



/**
 * read
 *
 * reads the ID3 tags of a mp3 file
 *
 * @param {String} file - path to an mp3 file
 * @param {onReadCallback} cb
 */
var read = function read(file, cb) {
    var mp3Err = new Error('tagger.read() first param must be a {String} path to a mp3');
    if (typeof cb === 'undefined') throw new Error('tagger.read() second param must be a callback');
    if (typeof file === 'undefined') throw mp3Err;
    if (!/\.mp3/.test(file)) throw mp3Err;

    //console.log(file);

    taglib.tag(file, function(err, tags, audio) {
	//console.log(tags);
        if (err) return cb(err, null);
        return cb(null, tags);
    });
    

    //var mp3 = tagio.open(file, config);
    //console.log(mp3);
    
    // id3({ file: file, type: id3.OPEN_LOCAL }, function(err, tags) {
    // 	// tags now contains your ID3 tags

    // });
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
    
    
    taglib.tag(file, function(err, t) {
	t.artist = tags.artist;
	t.title = tags.title;
	t.comment = tags.comment;
	t.save(function(err) {
	    if (err) return cb(err, null);
	    return cb(null, tags);
	});
    });
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
