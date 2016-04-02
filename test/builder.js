var path = require('path');
var os = require('os');
var Builder = require(path.join(__dirname, '..', 'lib', 'builder'));
var assert = require('chai').assert;
var fs = require('fs');



describe('Builder', function() {

    this.timeout(10000);
    it('should create static site in ./dist', function(done) {
	var builder = new Builder({
	    cwd: path.join(os.homedir(), 'scripts', 'tdd'),
	    src: path.join(os.homedir(), 'scripts', 'tdd', 'src'),
	    dest: path.join(os.homedir(), 'tdd', 'dist')
	});
	builder.build(function(err) {
	    assert.isNull(err);
	    done();
	});
    });
});
	 
