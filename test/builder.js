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
	    dest: path.join(os.homedir(), 'scripts', 'tdd', 'dist'),
	    jdir: path.join(os.homedir(), 'scripts', 'tdd', 'json'),
	    podcastTitle: 'The Daily Decrypt Podcast',
	    podcastDesc: "We are here to serve up the latest Cryptocurrency & P2P tech news, to keep you up to date with the latest trends and developments so you don't spend all day researching! Some hot coffee & The Daily Decrypt make a great way to get your daily crypto morning!",
	    podcastLink: "http://thedailydecrypt.com/",
	    podcastImage: "http://thedailydecrypt.com/wp-content/uploads/2016/03/the-daily-decrypt-logo-header-730x260.png",
	    podcastCopyright: "Be free!",
	    podcastAuthor: "Chris Grimmett",
	    podcastAuthorEmail: "chris@grimtech.net",
	    podcastAuthorLink: "http://tddpodcast.grimtech.net/"
	});
	builder.build(function(err) {
	    assert.isNull(err);
	    done();
	});
    });
});
	 
