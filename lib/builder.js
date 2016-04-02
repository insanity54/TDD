var path = require('path');
var Metalsmith = require('metalsmith');
var metafiles = require('metalsmith-metafiles');
var collections = require('metalsmith-collections');
var layouts = require('metalsmith-layouts');
var bundler = require(path.join(__dirname, 'bundler'));
var _ = require('underscore');


var defaultOpts = {}

module.exports = Builder = function builder(options) {
    this.opts = _.extend({}, defaultOpts, options);

    if (typeof this.opts.cwd === 'undefined')
	throw new Error('builder needs source directory opts.src to be defined');
    //if (typeof this.opts.dest === 'unefined')
	//throw new Error('builder needs destination dir opts.dest to be defined');

    
}




Builder.prototype.build = function build(cb) {
    var self = this;
    Metalsmith(self.opts.cwd)
	.frontmatter(false)
	// .use(metafiles({
	//     deleteMetaFiles: false,
	//     postfix: "",
	//     parsers: {json: true}
	// }))
	.use(collections({
	    episodes: '*.json',
	    metadata: {
		name: 'Episodes',
		description: 'The eps listed here...'
	    }
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

    
}


