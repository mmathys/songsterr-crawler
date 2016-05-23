var argv = require('yargs').argv;
var columns = ["Track", "Time", "Type", "Arg1", "Arg2", "Arg3"];

var path = argv.path;

// Usage: node filterer.js --path="<path to csv>" >> whatever.midi

require("csv-to-array")({
   file: path,
   columns: columns
}, function (err, array) {
  console.log(err || array);
  if(!err) {
    // Read Header
    //var header_format = array[0]["Channel"]


  }else{
    //debug shit
  }
});
