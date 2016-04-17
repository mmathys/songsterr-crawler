var mongoose = require('mongoose');
var debug = require('debug')('extract')
var _ = require('lodash')

/**
 *
 * D A T A B A S E
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

/**
 *
 * E X T R A C T I O N
 *
 */

Song.find({'artist.name': 'Ajattara'}, function(err, res){
  if(res && res.length>0){
    _.each(res, function(song){
      var midiPath = "./midi/" + _.split(song.gp5, '.')[0] + ".midi"
      debug(midiPath)
      
    });
  }else{
    debug('error when retrieving shit')
  }

  process.exit(0);
})
