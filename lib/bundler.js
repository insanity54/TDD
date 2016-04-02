var path = require('path');
var _ = require('underscore');



var defaultOpts = {
    "collectionName": "episodes"
}


module.exports = function plugin(options) {

    var opts = _.extend({}, defaultOpts, options);
    
    
    return function(files, metalsmith, done) {
	
	metadata = metalsmith.metadata();
	//console.log(metalsmith);
	if (!metadata.collections)
	    return done(new Error('no collections configured - see metalsmith-collections'));

	collection = metadata.collections[opts.collectionName];
	//console.log(collection);

	var manifest = [];
	
	for (var i = 0; i<collection.length; i++) {
	    //console.log(collection[i]);

	    
	    if (path.extname(collection[i]) == '.json') {
		console.log('extname is json');
		//console.log(file.contents)
		//try { var j = JSON.parse(file.contents) }
		//catch(e) { throw e }
		manifest.push(collection[i]);
	    }
	}

	//console.log(manifest);
	metalsmith._metadata['bundle'] = manifest;
	
	files['manifest.json'] = {
	    contents: new Buffer(manifest, 'utf8')
	}

	return done();
    };
}
