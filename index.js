var path = require('path');
var os = require('os');
var youtube = require(path.join(__dirname, 'lib', 'youtube'));
var downloader = require(path.join(__dirname, 'lib', 'downloader'));
var iprofessor = require(path.join(__dirname, 'lib', 'ipfs-professor'));
var Queue = require(path.join(__dirname, 'lib', 'queue'));
var Overlord = require(path.join(__dirname, 'lib', 'overlord'));
var Builder = require(path.join(__dirname, 'lib', 'builder'));



// make sure the youtube api key exists in the system environment
if (typeof process.env.YOUTUBE_API_KEY === 'undefined')
    throw new Error('YOUTUBE_API_KEY is not defined in your environment, and it is required.')





// queue handles downloading things
var queue = new Queue();


var olOpts = {
    youtube: youtube,
    channel: 'UCqNCLd2r19wpWWQE6yDLOOQ',
    queue: queue,
    ipns: 'http://127.0.0.1', // ipns multihash that will point to the built website
    cwd: path.join(os.homedir(), 'tdd', 'src'),
    src: path.join(os.homedir(), 'tdd', 'src'),
    dest: path.join(os.homedir(), 'scripts', 'tdd', 'dist'),
    podcastTitle: 'The Daily Decrypt Podcast',
    podcastDesc: "We are here to serve up the latest Cryptocurrency & P2P tech news, to keep you up to date with the latest trends and developments so you don't spend all day researching! Some hot coffee & The Daily Decrypt make a great way to get your daily crypto morning!",
    podcastLink: "http://thedailydecrypt.com/",
    podcastImage: "http://thedailydecrypt.com/wp-content/uploads/2016/03/the-daily-decrypt-logo-header-730x260.png",
    podcastCopyright: "Be free!",
    podcastAuthor: "Chris Grimmett",
    podcastAuthorEmail: "chris@grimtech.net",
    podcastAuthorLink: "http://tddpodcast.grimtech.net/",
    podcastIPNS: 'http://127.0.0.1:8080/'
}


// overlord handles running the application
var overlord = new Overlord(olOpts).begin();

