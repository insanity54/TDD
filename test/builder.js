var path = require('path');
var os = require('os');
var Builder = require(path.join(__dirname, '..', 'lib', 'builder'));
var assert = require('chai').assert;
var fs = require('fs');
var url = require('url');



describe('Builder', function() {

    it('should create static site in ./dist', function(done) {
	this.timeout( (60*1000)*5 );

	var builder = new Builder({
	    cwd: path.join(os.homedir(), 'tdd', 'src'),
	    src: path.join(os.homedir(), 'tdd', 'src'),
	    dest: path.join(os.homedir(), 'scripts', 'tdd', 'dist'),
	    podcastTitle: 'The Daily Decrypt Podcast',
	    podcastDesc: "We are here to serve up the latest Cryptocurrency & P2P tech news, to keep you up to date with the latest trends and developments so you don't spend all day researching! Some hot coffee & The Daily Decrypt make a great way to get your daily crypto morning!",
	    podcastLink: url.resolve("http://127.0.0.1:8080", "rss.xml"),
	    podcastWebsite: "http://127.0.0.1:8080/",
	    podcastImage: "http://thedailydecrypt.com/wp-content/uploads/2016/03/the-daily-decrypt-logo-header-730x260.png",
	    podcastCopyright: "Be free!",
	    podcastAuthor: "Chris Grimmett",
	    podcastAuthorEmail: "chris@grimtech.net",
	    podcastAuthorLink: "http://tddpodcast.grimtech.net/",
	    podcastIPNS: 'TTTTTTTTTTTTTTTTTTTTTTTTT'

	});
	builder.build(function(err) {
	    assert.isNull(err);
	    done();
	});
    });
});
	 
