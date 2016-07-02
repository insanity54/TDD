var tagger = require('../lib/tagger');
var path = require('path');
var fs = require('fs');
var assert = require('chai').assert;


describe('mp3 tagger', function() {
    var testmp3 = path.resolve(__dirname, 'test.mp3');
    if (!path.isAbsolute(testmp3)) throw new Error('testmp3 path not abs');

    beforeEach(function(done) {
        // create a test mp3
        var stream = fs.createReadStream(
            path.join(__dirname, 'blobs', 'test.mp3')
        ).pipe(fs.createWriteStream(
            path.join(__dirname, 'test.mp3')
        ));
        stream.on('close', function() {
            done();
        });
    });

    afterEach(function(done) {
        // delete the test mp3
        fs.unlink(path.join(__dirname, 'test.mp3'), function() {
            done();
        });
    });


    xit('should read ID3 tags from mp3', function(done) {
        tagger.read(testmp3, function(err, tags) {
            assert.isNull(err);
            done();
        });
    });

    it('should write ID3 tags to mp3', function(done) {
        var testTags = {
            artist: 'cool bro',
            title: 'bro adventures',
            year: '2020'
        };
        tagger.write(testmp3, testTags, function(err, tags) {
            assert.isNull(err);
            assert.isObject(tags);
            assert.isString(tags.artist);
            assert.equal(testTags.artist, tags.artist);
            done();

            // // read the mp3 again to see if the changes persist
            // @todo add after reading implemented
            // tagger.read(testmp3, function(err, tags) {
            //     assert.isNull(err);
            //     assert.equal(testTags.artist, tags.artist);
            //     done();
            // });

        });
    });
});
