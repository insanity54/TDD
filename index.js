var path = require('path');
var youtube = require(path.join(__dirname, 'lib', 'youtube'));
var downloader = require(path.join(__dirname, 'lib', 'downloader'));
var iprofessor = require(path.join(__dirname, 'lib', 'ipfs-professor'));
var Queue = require(path.join(__dirname, 'lib', 'queue'));
var Overlord = require(path.join(__dirname, 'lib', 'overlord'));
var Builder = require(path.join(__dirname, 'lib', 'builder'));



// make sure the youtube api key exists in the system environment
if (typeof process.env.YOUTUBE_API_KEY === 'undefined')
    throw new Error('YOUTUBE_API_KEY is not defined in your environment, and it is required.')





// queue handles downloading things
var queue = new Queue();


var olOpts = {
    youtube: youtube,
    channel: 'UCqNCLd2r19wpWWQE6yDLOOQ',
    queue: queue,
    ipns: '' // ipns multihash that will point to the built website
}

// overlord handles control flow
var overlord = new Overlord(olOpts).begin();

// overlord.download();


// overlord.on('complete', function() {
//     // overlord has downloaded all assets needed to create the podcast
//     // time to render a web site using metalsmith


    
//     var builder = new Builder();
//     builder.build();

// });
