

var RSS = require('rss');
var moment = require('moment');
var path = require('path');
var url = require('url');
var Entities = require('html-entities').XmlEntities;
var _ = require('underscore');


/**
 * feeder
 *
 * create the podcast RSS feed
 *
 * @return {string} XML
 */
module.exports = function feeder(podcasts) {

    var self = this;
    
    if (typeof this.opts.podcastTitle === 'undefined')
        throw new Error(this.errMsg('podcast title', 'opts.podcastTitle'));
    if (typeof this.opts.podcastDesc === 'undefined')
        throw new Error(this.errMsg('podcast description', 'opts.podcastDesc'));
    if (typeof this.opts.podcastLink === 'undefined')
        throw new Error(that.errMsg('podcast link', 'opts.podcastLink'));
    if (typeof this.opts.podcastImage === 'undefined')
        throw new Error(this.errMsg('podcast image', 'opts.podcastImage'));
    if (typeof this.opts.podcastCopyright === 'undefined')
        throw new Error(this.errMsg('podcast copyright message', 'opts.podcastCopyright'));
    if (typeof this.opts.podcastAuthor === 'undefined')
        throw new Error(this.errMsg('podcast author', 'opts.podcastAuthor'));
    if (typeof this.opts.podcastAuthorEmail === 'undefined')
        throw new Error(this.errMsg('podcast author email', 'opts.podcastAuthorEmail'));
    if (typeof this.opts.podcastAuthorLink === 'undefined')
        throw new Error(this.errMsg('podcast author link', 'opts.podcastAuthorLink'));
    if (typeof this.opts.podcastIPNS === 'undefined')
	throw new Error(this.errMsg('ipns hash', 'opts.podcastIPNS'));
    if (typeof this.opts.dest === 'undefined')
	throw new Error(this.errMsg('output destination', 'opts.dest'));
    if (typeof this.opts.podcastWebsite === 'undefined')
	throw new Error(this.errMsg('podcast website', 'opts.podcastWebsite'));



    var entities = new Entities();
    
    // console.log(entities.encode('<>"\'&©®')); // &lt;&gt;&quot;&apos;&amp;©® 
    // console.log(entities.encodeNonUTF('<>"\'&©®')); // &lt;&gt;&quot;&apos;&amp;&#169;&#174; 
    // console.log(entities.encodeNonASCII('<>"\'&©®')); // <>"\'&©® 
    // console.log(entities.decode('&lt;&gt;&quot;&apos;&amp;&copy;&reg;&#8710;')); // <>"'&&copy;&reg;∆ 



    
    var feed = new RSS({
	title: self.opts.podcastTitle,
	description: self.opts.podcastDesc,
	feed_url: url.resolve(self.opts.podcastLink, 'rss.xml'),
	site_url: self.opts.podcastLink,
	image_url: self.opts.podcastImage,
	docs: 'http://example.com/rss/docs.html',
	language: 'en',
	pubDate: moment().toDate(),
	ttl: '60',
	custom_namespaces: {
	    'itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd'
	},
	custom_elements: [
	    {'itunes:subtitle': self.opts.podcastSubtitle},
	    {'itunes:author': self.opts.podcastAuthor},
	    {'itunes:summary': self.opts.podcastDesc},
	    {'itunes:owner': [
		{'itunes:name': self.opts.podcastAuthor},
		{'itunes:email': self.opts.podcastAuthorEmail}
	    ]},
	    {'itunes:image': {
		_attr: {
		    href: self.opts.podcastImage
		}
	    }},
	    {'itunes:category': [
		{_attr: {
		    text: 'Technology'
		}},
		{'itunes:category': {
		    _attr: {
			text: 'Gadgets'
		    }
		}}
	    ]},
	    {'itunes:explicit': 'yes'}
	]
    });


    
    /* loop over data and add to feed */
    for (var i=0; i<podcasts.length; i++) {

	//console.log('Podcast: %s', podcasts[i]);
	//console.log(podcasts[i]);

	// replace newlines with breaks
	// then encode tags safe for XML
	//    var t = podcasts[0].description.replace(/(?:\r\n|\r|\n)/g, '<br />');
	var description = podcasts[i].description;
	description = description.replace(/(?:\r\n|\r|\n)/g, '<br />');

	//str = str.replace(/(?:\r\n|\r|\n)/g, '<br />');
        //console.log(entities.encode('<>"\'&©®')); // &lt;&gt;&quot;&apos;&amp;©®
	var mp3Path = path.join(self.opts.dest, podcasts[i].resourceId.videoId+'.mp3');
	var mp3Url = url.resolve(self.opts.podcastWebsite, podcasts[i].resourceId.videoId+'.mp3');
	if (!path.isAbsolute) throw new Error('path to enclosed mp3 is not absolute');

	feed.item({
	    title: podcasts[i].title,
	    description: description,
	    url: podcasts[i].url, // link to the item 
	    date: moment(podcasts[i].publishedAt).toDate(), // any format that js Date can parse. 
	    enclosure: {url:mp3Url, file:mp3Path}, // optional enclosure 
	    custom_elements: [
		{'itunes:image': {
		    _attr: {
			href: url.resolve(self.opts.podcastWebsite, podcasts[i].resourceId.videoId+'.jpg')
		    }
		}}
	    ]
	});
    }
    
    return feed.xml();
}
