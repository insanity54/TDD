var path = require('path');
//var bundler = require(path.join(__dirname, 'bundler'));
var Handlebars = require('handlebars');
var layouts = require(path.join(__dirname, 'layouts'));
var _ = require('underscore');
var fs = require('fs');
var feeder = require(path.join(__dirname, 'feeder'));



var defaultOpts = {};




module.exports = Builder = function builder(options) {
    this.opts = _.extend({}, defaultOpts, options);
    this.errMsg = function errMsg(friendly, optsName) {
	return 'builder needs '+friendly+' ('+optsName+') to be defined';
    }    

    if (typeof this.opts.cwd === 'undefined')
	throw new Error(this.errMsg('current working directory', 'opts.cwd'));
    if (typeof this.opts.src === 'undefined')
	throw new Error(this.errMsg('source directory', 'opts.src'));
    if (typeof this.opts.dest === 'undefined')
	throw new Error(this.errMsg('destination directory', 'opts.dest'));
    // if (typeof this.opts.jdir === 'undefined')
    // 	throw new Error(this.errMsg('json directory', 'opts.jdir'));

    // if (typeof this.opts.podcastTitle === 'undefined')
    // 	throw new Error(errMsg('podcast title', 'opts.podcastTitle'));
    // if (typeof this.opts.podcastDesc === 'undefined')
    // 	throw new Error(errMsg('podcast description', 'opts.podcastDesc'));
    // if (typeof this.opts.podcastLink === 'undefined')
    // 	throw new Error(errMsg('podcast link', 'opts.podcastLink'));
    // if (typeof this.opts.podcastImage === 'undefined')
    // 	throw new Error(errMsg('podcast image', 'opts.podcastImage'));
    // if (typeof this.opts.podcastCopyright === 'undefined')
    // 	throw new Error(errMsg('podcast copyright message', 'opts.podcastCopyright'));
    // if (typeof this.opts.podcastAuthor === 'undefined')
    // 	throw new Error(errMsg('podcast author', 'opts.podcastAuthor'));
    // if (typeof this.opts.podcastAuthorEmail === 'undefined')
    // 	throw new Error(errMsg('podcast author email', 'opts.podcastAuthorEmail'));
    // if (typeof this.opts.podcastAuthorLink === 'undefined')
    // 	throw new Error(errMsg('podcast author link', 'opts.podcastAuthorLink'));

			
			
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

	// go through each file in the src dir
	for (var i=0; i<files.length; i++) {

	    // handle metadata files
	    if (path.extname(files[i]) === '.json') {

		// ignore manifest.json which could be left over from previous runs
		if (files[i] !== 'manifest.json') {
		    
		    // grab the json and add it to manifest
		    var j = require(path.join(self.opts.src, files[i]));
		    manifest.push(j);
		}
	    }

	    
	    // handle mp3s
	    if (path.extname(files[i]) === '.mp3') {
		
		// copy to dist directory
		console.log('copying %s to %s', files[i], path.join(self.opts.dest, path.basename(files[i])));
		fs.createReadStream(files[i]).pipe(fs.createWriteStream(path.join(self.opts.dest, path.basename(files[i]))));
	    }

	    
	    // handle .jpgs
	    if (path.extname(files[i]) === '.jpg') {
		
		// copy to dist dir
		console.log('copying %s to %s', files[i], path.join(self.opts.dest, path.basename(files[i])));
		fs.createReadStream(files[i]).pipe(fs.createWriteStream(path.join(self.opts.dest, path.basename(files[i]))));
	    }
	}


	// write manifest to dist directory
	fs.writeFileSync(path.join(self.opts.dest, 'manifest.json'), JSON.stringify(manifest), 'utf8');

	// write mp3s to dist directory
	
	
	// create RSS (podcast) feed
	var rss = feeder.call(self, manifest);

	// write RSS file
	fs.writeFileSync(path.join(self.opts.dest, 'rss.xml'), rss, 'utf8');
	
	// create an html index file using the manifest and a handlebars template
	var template = Handlebars.compile(layouts.list);
	var data = manifest;
	var result = template(data);

	// write html to dist folder
	fs.writeFileSync(path.join(self.opts.dest, 'index.html'), result, 'utf8');


	// all done
	return cb(null);
    });    
}


