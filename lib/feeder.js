/**
 * module which creates the RSS feed for the page
 */


var Feed = require('feed');
var moment = require('moment');



module.exports = function feeder(podcasts) {

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


    var feed = new Feed({
	title:       this.opts.podcastTitle,
	description: this.opts.podcastDesc,
	link:        this.opts.podcastLink,
	image:       this.opts.podcastImage,
	copyright:   this.opts.podcastCopyright,
	updated:     new Date(),                // optional, default = today 
	
	author: {
            name:    this.opts.podcastAuthor,
            email:   this.opts.podcastAuthorEmail,
            link:    this.opts.podcastAuthorLink
	}
    });
    
    for(var i in podcasts) {
	feed.addItem({
            title:          podcasts[i].title,
            link:           podcasts[i].url,
            description:    podcasts[i].description,
            date:           moment(podcasts[i].publishedAt).toDate(),
            image:          podcasts[i].thumbnails.default.url
	});
    }

    return feed.render('rss-2.0');
}
