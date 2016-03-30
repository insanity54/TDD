# TheDailyDecrypt Podcast Generator

a.k.a. TDDPG (cooler name pending)

Automatic podcast creator for [The Daily Decrypt](https://www.youtube.com/channel/UCqNCLd2r19wpWWQE6yDLOOQ)

## Project Goal

### Goal Summary

Automatically generate a podcast website containing MP3s of every Daily Decrypt show, persisting it to IPFS.

* get list of vids
* download vids
* convert vids
* generate website
* add website IPFS
* publish to IPNS


### Goal Detail

This program/server/app TDDPG runs on a computer somewhere.


#### Function 1 - Bulk Podcastification, IPFSification

TDDPG runs on a computer somewhere. When started, and twice per day, TDDPG uses the YouTube API and IPFS API to find out if there are any TDD videos which have not yet been podcastified and IPFSified. Any videos which TDDPG hasn't already processed are converted into MP3s, rendered into a simple podcast website, and stored on IPFS.


#### Function 2 - Reactional Podcastification, IPFSification

When TheDailyDecrypt uploads a new video, TDDPG is notified of this video's details via the youtube API.

TDDPG then downloads the new video, converting it into an MP3. Then it generates a static HTML site with RSS feed and iTunes link. Then it adds the HTML site to IPFS, and updates an IPNS hash to point to the latest IPFS hash of the podcast site.


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



## Installation

**Note: You do not need to install this project to use it. Installing this project is for developers who want to hack on this project, see how it works, etc.**

### Prerequisites

First you will need a youtube developer API key. Go here https://console.developers.google.com/apis/credentials and create an app. Then create a `Server` type API key. Then enable the Youtube API for this app.

Create a file `.env` which will hold your API key.

You will also need git, node.js, and npm.


### Installing

Clone the project to your computer

    $ git clone

cd into the project directory

    $ cd tdd

create a file, `.env` and paste in the Google/YouTube API key you created in the above Prerequisites section. Your `.env` file should look like this-

    YOUTUBE_API_KEY=SDJFOKLPEIJ83a8dfjf83oad8f-EUfjfafjisSf

install the node modules needed for this project

    npm install

start the program

    npm run start

Now the app will download and podcastify and IPFSify any videos that haven't been already. Also, the app will react to new TDD video uploads, podcastifying and IPFSifying them as they are published to youtube.


## TODO list

* [x] get list of vids
* [ ] download vids
* [ ] convert vids
* [ ] generate website
* [ ] add website IPFS
* [ ] publish to IPNS

* [ ] bulk podcastification, IPFSification
* [ ] reactional podcastification, IPFSification

## Contributing

hellz yes, open those issues, request those pulls!
