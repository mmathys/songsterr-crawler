# Songsterr Tab Crawler

Node script for crawling all the tab data from songsterr in the Guitar Pro Format.

## Prerequisites

- You are running a local instance of MongoDB (`mongod`)

## How to run it

- NPM install all dependencies `npm i`
- Run it with `DEBUG=crawler node crawler.js`

## What it does

- Attempts to download the newest tab revision of a song and saves it under `gp5/`
- Stores song info in a MongoDB database called "songsterr".

## What's the song info

The following info is stored in the database *songsterr* in the local MongoDB instance,
the Guitar Pro tab files are stored in `gp5/`

- **id**: the song id, number
- **title**: the song title, string
- **artist**: the artist of the song, object
  - **artist.id**: the artists id, number
  - **artist.name**: the artists name, string
- **gp5**: the name of the Guitar Pro tab file. Can also be a *.gp4-file, string Example: `11928462.gp5`
- **tabId**: the tab id, number
- **revisionId**: the revision id, number
