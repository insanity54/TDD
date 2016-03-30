# TheDailyDecrypt Podcast Generator

Automatic podcast creator for The Daily Decrypt https://www.youtube.com/channel/UCqNCLd2r19wpWWQE6yDLOOQ

## Project Goal

### Goal Summary

Automatically generate a podcast website containing MP3s of every Daily Decrypt show, persisting it to IPFS.

* [ ] get list of vids
* [ ] download vids
* [ ] convert vids
* [ ] generate website
* [ ] add website IPFS
* [ ] publish to IPNS


### Goal Detail

Twice per day, this program runs on a computer somewhere. It uses the Youtube API to fetch a list of all Daily Decrypt videos. It then downloads every video it doesn't already have, and converts them into MP3s. Then it generates a static HTML site with RSS feed and iTunes link. Then it adds the HTML site to IPFS, and updates an IPNS hash to point to the latest IPFS hash of the podcast site.


## The Stack

* Worker
  * Node.js
    * [Request](https://npm.js/package/request) (makes calls to youtube api)
    * [Metalsmith](https://npm.js/package/metalsmith) (generates static website)
    * [ipfs-api](https://npm.js/package/ipfs-api) (interfaces worker with IPFS)
    * [Foreman](https://npm.js/package/foreman) (handles storing private yt api key, creates init.d scripts)

* Storage/distribution
  * [IPFS](https://github.com/ipfs/go-ipfs) (Next-generation of the internet. "The Permanent Web" where links don't die and everything loads faster)
    * [ipfs-kloud](https://github.com/insanity54/ipfs-kloud) (uses Ansible to manage a cluster of IPFS gateway servers)



## Contributing

hellz yes, open those issues, request those pulls!
