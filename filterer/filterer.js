var argv = require('yargs').argv;
var _ = require('lodash');

var columns = ["Track", "Time", "Type", "Arg1", "Arg2", "Arg3"];

var path = argv.path;

// Usage: node filterer.js --path="<path to csv>" >> whatever.midi

require("csv-to-array")({
   file: path,
   columns: columns
}, function (err, array) {
  //console.log(err || array);
  if(!err && array && array.length>0) {
    // Read Header
    var header_format = parseInt(array[0].Arg1)
    var header_nTracks = parseInt(array[0].Arg2)
    var header_division = parseInt(array[0].Arg3)

    // trim the stuff

    _.each(array, function(event){
        _.each(event, function trimIfDefined(value, field){
          if(value)
            event[field] = _.trim(value)
        })
    });

    var guitarTracks = [];

    _.each(array, function(event){
      //console.log(event)
      if(event && event.Type && event.Type === "Program_c" && event.Arg1){
        var isGuitar = parseInt(event.Arg2) <= 31 && parseInt(event.Arg2) >= 24;
        if(isGuitar) {
          guitarTracks.push(event.Track);
        }
      }
    })

    // remove duplicates
    guitarTracks = _.uniq(guitarTracks);

    //console.log(guitarTracks)

    var out = [];

    //create header
    out.push({"Track": 0, "Time": 0, "Type":"Header", "Arg1": header_format, "Arg2": guitarTracks.length, "Arg3":header_division});

    var trackNew = 1;
    _.each(guitarTracks, function(track){
      _.each(array, function(item) {
        if(item && item.Track === track){
          item.Track = trackNew
          out.push(item)
        }
      })
      trackNew++;
    })

    //create footer
    out.push({"Track": 0, "Time": 0, "Type":"End_of_file"})

    console.log(out)




  }else{
    //debug shit
  }
});
