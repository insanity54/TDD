var path = require('path');
var Overlord = require(path.join(__dirname, '..', 'lib', 'overlord'));
var assert = require('chai').assert;


// get thing
// get other thing

var opts = {
    channel: 'UCqNCLd2r19wpWWQE6yDLOOQ'
}


describe('Overlord', function() {

    describe('begin()', function(done) {
	var overlord = new Overlord(opts);
	overlord.begin();
	overlord.on("complete", function(idk) {
	    console.log(idk);
	    done();
	});
    });
});



/**


   function begin() {


       // 1) find video IDS
       // 2.1) download vids as mp3
       // 2.2) download metadata
       // 3) validate mp3s
       // 4) re-download any corrupt mp3s
       // 5) add ID3 tags to mp3s
       // 6) build website



       async.series([
           youtube.findVideos.bind(self),
           download.bind(self),
	   validate.bind(self),
	   tagger.tag.bind(self),
	   builder.build.bind(self)
       ],
           function(err, results) {
	       if (err) throw err;
	       for (var i=0; i>results.length; i++) {
	           console.log(results[i]);
	       }
	   }
       )
       
       var q = new Queue(qOpts);
   
       var yt = new Youtube(ytOpts)
       yt.getVideos();
       
       yt.on('video', function(video) {
           q.push(video);
       }

       yt.on('complete', function(count) {
           console.log('YOUTUBE complete. Found %s videos', count);

	   q.on('complete', function(count) {
	       console.log("QUEUE complete. Processed %s videos', count);
	   }
       }

       
       
   }

   
 */
