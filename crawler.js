var songsterr = require('songsterr')
var debug = require('debug')('crawler')
var async = require('async')
var _ = require('lodash')
var Entities = require('html-entities').AllHtmlEntities;
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var http = require('http');
var fs = require('fs');
var request = require('request')
var cheerio = require('cheerio')
var querystring = require("querystring");


entities = new Entities();// Songsterr IDs: go from 1 up.

/**
 *
 *      * * * D A T A B A S E * * *
 *
 */

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost/songsterr';
// Use connect method to connect to the Server
mongoose.connect('mongodb://localhost/songsterr');
var Schema = mongoose.Schema;

var songSchema = new Schema({
  id: Number,
  title: String,
  artist: {
    id: Number,
    name: String
  },
  gp5: String,
  tabId: Number,
  revisionId: Number
});

var Song = mongoose.model('Song', songSchema);


//crawlerSynchronous();

crawlArtist("The Beatles");

/**
 *
 *      * * * C R A W L E R  A R T I S T * * *
 *
 */
function crawlArtist(artist) {

  //url: http://www.songsterr.com/a/ra/songs/byartists.xml?artists="<artist name>"
  //encode '"<artist name>"'.

  var arg = querystring.stringify({artists: '"'+artist+'"'});
  var url = "http://www.songsterr.com/a/ra/songs/byartists.xml?"+arg;
  console.log("url: "+url);

  request(url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var songs = $('Song');
      var songIds = [];
      songs.each(function(i, song){
        var id = $(this).attr("id");
        songIds.push(id);
      });
      console.log(songIds)

      async.eachLimit(songIds, 30, function iteratee(songId, next) {
        /**
         * Actually downloading and inserting the song
         */
         console.log("saving "+songId);
         songsterr.getTabBySongId(songId, function(err, res){
           if(res){
             var copy = JSON.parse(JSON.stringify(res.gp5))
             var a = copy.split("/")
             var gp5 = a[a.length-1];


             var song = new Song({
               id: res.songId,
               title: entities.decode(res.title),
               artist: {id:res.artist.id, name:entities.decode(res.artist.name)},
               tabId: res.tabId,
               gp5: gp5,
               revisionId: res.revisionId
             });

             song.save(function(err, song){
               if(!err){
                 if(!fs.existsSync('./gp5')){
                   fs.mkdirSync('./gp5');
                 }

                 var file = fs.createWriteStream("./gp5/"+gp5);
                 var request = http.get(res.gp5, function(response) {
                   response.pipe(file);
                 });

                 debug(songId, entities.decode(res.artist.name+" - "+res.title)+" --> gp5/"+gp5);
                 next();
               }else{
                 console.log(err);
               }
             })

           }else{
             next();
           }
         })

      }, function done() {
          console.log("done!!!")
      });

    } else {
      console.log("error!!!");
    }
  });




  //var max = res;
  //var currentId = 1;
  /*
  async.timesLimit(max+1, 30, function(currentId, next){
    if(currentId==0){next();return;}
    //debug(currentId, "starting...")
    songsterr.getTabBySongId(currentId, function(err, res){
      if(res){
        var copy = JSON.parse(JSON.stringify(res.gp5))
        var a = copy.split("/")
        var gp5 = a[a.length-1];


        var song = new Song({
          id: res.songId,
          title: entities.decode(res.title),
          artist: {id:res.artist.id, name:entities.decode(res.artist.name)},
          tabId: res.tabId,
          gp5: gp5,
          revisionId: res.revisionId
        });

        song.save(function(err, song){
          if(!err){
            if(!fs.existsSync('./gp5')){
              fs.mkdirSync('./gp5');
            }
            var file = fs.createWriteStream("./gp5/"+gp5);
            var request = http.get(res.gp5, function(response) {
              response.pipe(file);
            });
            debug(currentId, entities.decode(res.artist.name+" - "+res.title)+" --> gp5/"+gp5);
            next();
          }else{
            console.log(err);
          }
        })

      }else{
        next();
      }
    })
  }, function(err, all){
    console.log("done")
  })
  */
}

/**
 *
 *      * * * C R A W L E R  S Y N C H R O N O U S * * *
 *
 */
function crawlerSynchronous() {
  songsterr.getLatestSongId(function(err, res){
    debug('latest song id is', res)

    var max = res;
    var currentId = 1;

    async.timesLimit(max+1, 30, function(currentId, next){
      if(currentId==0){next();return;}
      //debug(currentId, "starting...")
      songsterr.getTabBySongId(currentId, function(err, res){
        if(res){
          var copy = JSON.parse(JSON.stringify(res.gp5))
          var a = copy.split("/")
          var gp5 = a[a.length-1];


          var song = new Song({
            id: res.songId,
            title: entities.decode(res.title),
            artist: {id:res.artist.id, name:entities.decode(res.artist.name)},
            tabId: res.tabId,
            gp5: gp5,
            revisionId: res.revisionId
          });

          song.save(function(err, song){
            if(!err){
              if(!fs.existsSync('./gp5')){
                fs.mkdirSync('./gp5');
              }
              var file = fs.createWriteStream("./gp5/"+gp5);
              var request = http.get(res.gp5, function(response) {
                response.pipe(file);
              });
              debug(currentId, entities.decode(res.artist.name+" - "+res.title)+" --> gp5/"+gp5);
              next();
            }else{
              console.log(err);
            }
          })

        }else{
          next();
        }
      })
    }, function(err, all){
      console.log("done")
    })

  });
}
