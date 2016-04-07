var RSS = require('rss');
var moment = require('moment');



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
    if (typeof this.opts.ipns === 'undefined')
	throw new Error(this.errMsg('ipns hash is not defined'));



    var feed = new RSS({
	title: self.opts.podcastTitle,
	description: self.opts.podcastDesc,
	feed_url: self.opts.podcastLink+'/feed.xml',
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
	    ]}
	]
    });


    
    /* loop over data and add to feed */
    for(var i in podcasts) {

	 // feed.addItem({
         //    title:          podcasts[i].title,
         //    link:           podcasts[i].url,
         //    description:    podcasts[i].description,
         //    date:           moment(podcasts[i].publishedAt).toDate(),
         //    image:          podcasts[i].thumbnails.default.url
         // });


	feed.item({
	    title:  podcasts[i].title,
	    description: podcasts[i].description,
	    url: podcasts[i].url, // link to the item 
	    date: moment(podcasts[i].publishedAt).toDate(), // any format that js Date can parse. 
	    enclosure: {url:self.opts.ipns, file:podcasts[i].resourceId.videoId+'.mp3'}, // optional enclosure 
	    custom_elements: [
		{'itunes:image': {
		    _attr: {
			href: podcasts[i].thumbnails.default.url
		    }
		}}
	    ]
	});
	
	
	return feed.xml();
    }

}
