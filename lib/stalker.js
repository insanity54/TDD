/**
 * The informant lurks in the darkness, waiting for intel from his secret squirrel.
 *
 * Informant is a pubsubhubub server that listens for updates to the watched
 * Youtube channel.
 */


//https://www.youtube.com/xml/feeds/videos.xml?channel_id=UCqNCLd2r19wpWWQE6yDLOOQ

var pubSubHubbub = require('pubsubhubbub');

var pubSubSubscriber = pubSubHubbub.createServer(options);
var topic = "https://www.youtube.com/xml/feeds/videos.xml?channel_id=UCqNCLd2r19wpWWQE6yDLOOQ";
var hub = "https://pubsubhubbub.appspot.com/";

pubSubSubscriber.on("subscribe", function(data){
    console.log(data.topic + " subscribed");
});

pubSubSubscriber.listen(port);

pubSubSubscriber.on("listen", function(){
    pubSubSubscriber.subscribe(topic, hub, function(err){
        if(err){
            console.log("Failed subscribing");
        }
    });
});
