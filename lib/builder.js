var path = require('path');
var Metalsmith = require('metalsmith');
var metafiles = require('metalsmith-metafiles');
var collections = require('metalsmith-collections');
var metalsmith_json = require('metalsmith-json-to-files');
var layouts = require('metalsmith-layouts');
var bundler = require(path.join(__dirname, 'bundler'));
var _ = require('underscore');
var fs = require('fs');



var defaultOpts = {}

module.exports = Builder = function builder(options) {
    this.opts = _.extend({}, defaultOpts, options);

    if (typeof this.opts.cwd === 'undefined')
	throw new Error('builder needs current working directory opts.cwd to be defined');
    if (typeof this.opts.src === 'undefined')
	throw new Error('builder needs source directory opts.src to be defined');
    if (typeof this.opts.dest === 'undefined')
	throw new Error('builder needs destination directory opts.dest to be defined');
    if (typeof this.opts.jdir === 'undefined')
	throw new Error('builder needs json directory opts.jdir to be defined');    
    
    
    //if (typeof this.opts.dest === 'unefined')
	//throw new Error('builder needs destination dir opts.dest to be defined');

    
}




Builder.prototype.build = function build(cb) {
    var self = this;

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

	// write manifest to file
	fs.writeFile(path.join(self.opts.jdir, 'episodes.json'), JSON.stringify(manifest), 'utf8', function(err) {
	    if (err) throw err;

	
	    // use metalsmith to turn the manifest into html pages
	    Metalsmith(self.opts.cwd)
	        .use(metalsmith_json({
		    "source_path": "./json/"
		}))
		.use(collections({
		    episodes: {}
		}))
		.use(bundler(true))
		.use(layouts({
		    "engine": 'handlebars',
		    "directory": 'layouts',
		    "default": 'layout.hbs'
		}))
		.source('./src')
		.destination('./dist')
		.build(function(err) {
		    if (err) throw err;
		    return cb(null);
		});
	    
	});
	
    });    
}


