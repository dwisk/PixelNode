"use strict"
/**
 * PixelNode_Font
 *
 * Pixel Drawing Helpers
 *
 * --------------------------------------------------------------------------------------------------------------------
 *
 * @author Amely Kling <mail@dwi.sk>
 *
 */

/* Node Includes
 * ==================================================================================================================== */

const _ = require('underscore'),
   fs = require('fs'),
   PNG = require('pngjs').PNG;


/* Class Constructor
 * ==================================================================================================================== */

class PixelNode_Font {
  constructor (callback, options) {

  	this.options = {
      ...{
        name: "Unnamed",
        image: __dirname + "/letters.png",
        mapping: " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?"
      }, 
      ...options
    };

    this.letters = [];
    this.spacing = [];
    this.initialized = false;
  	this.name = this.options.name;
  	this.parseFont(callback);
  }


/* Internal Methods
 * ==================================================================================================================== */

  // load font png and parse into letters
  parseFont(callback) {
    console.log(("PixelNode_Font " + this.name + ":").grey, "Reading Font...", this.options.image);

    // vars
    let self = this;
    let cnt = 1;
    let spacingStarted = false;
    let spacingDone = false;

    // read PNG-file
    fs.createReadStream(this.options.image)

    // parse PNG-file
    .pipe(new PNG({
        filterType: 4
        }))

    // split into letters
    .on('parsed', function() {

      // create vertical slices as arrays of all pixels
      var slices = [];
      for (var x = 0; x < this.width; x++) {
        slices[x] = [];
        for (var y = 0; y < this.height; y++) {
          // get pixel id
          var idx = (this.width * y + x) << 2;

          // get pixel as array (white vs black)
          slices[x][y] = !(this.data[idx] > 128 || this.data[idx+1] > 128 || this.data[idx+2] > 128);
        }
      }

      // first letter is SPACE consisting of 4 pixels (height doesn't matter)
      self.letters[0] = [0,0,0,0]

      // loop through vertical slices and find letters and  spacing between them
      for (var x = 0; x < this.width; x++) {

        // checking for empty slice
        var empty = true;
        if (!self.letters[cnt]) self.letters[cnt] = [];
          for (var y = 0; y < this.height; y++) {
            if (slices[x][y]) {
              empty = false;
            }
          }

        // if empty collect spacing
        if (empty) {
          // increase number for next letter
          if (self.letters[cnt].length) cnt++;

          // remember we started collecting the spacing
          spacingStarted = true;

          // only collect if we're not already done  (just the first spacing will be collected)
          if (!spacingDone) self.spacing.push(slices[x]);

        // if not empty add slice to current letter
        } else {
          self.letters[cnt].push(slices[x]);

          // if we started spacing, set it to done
          if (spacingStarted) spacingDone = true;
        }
      }

      // output log message
      console.log(("PixelNode_Font " + self.name + ":").grey,
        "Parsed " + self.letters.length + " letters with", self.spacing.length + "px spacing");

      // set initialized to true
      self.initialized = true;

      // call callback if exists
      if (typeof callback === "function") callback();
    });
  }

  // find number for Char
  getCharNum(letter) {
    if (!this.initialized) return;

    return this.options.mapping.indexOf(letter);
  }

/* Mapping Methods
 * ==================================================================================================================== */

// map complete word
mapWord(word) {
  if (!this.initialized) return;

  // init map
  let map = [];

  // map chars
  for (var i = 0; i < word.length; i++) {
    map = map.concat(this.mapChar(word.charAt(i), true));
  }

  // return map
  return map;
}


mapChar(char, withSpacing = false) {
  if (!this.initialized) return;

  // get charNum
  let num = this.getCharNum(char);

  // init map
  let map = [];

  // warn if char is not available
  if (num == -1) {
    console.log(("PixelNode_Font " + this.name + ":").grey, ("Char '" + char + "'not found!").yellow);

  // map char (& spacing)
  } else {
    map = this.letters[num];
    if (withSpacing) map = map.concat(this.spacing);
  }

  // return map
  return map;
}


/* Logging Methods
 * ==================================================================================================================== */

  // log a map to the console
  logMap(map) {
    for (var y = 0; y < map[0].length; y++) {
      var row = "";
      for (var x = 0; x < map.length; x++) {
        row += map[x][y] ? "█": " ";
      }
      row += " ";

      console.log(row);
    }
  }

  // log a word to the console
  logWord(word) {
    if (!this.initialized) return;

    this.logMap(this.mapWord(word));
  }

  // log a char to the console
  logChar(char) {
    if (!this.initialized) return;

    this.logMap(this.mapChar(char));
  }

}

// module export
module.exports = PixelNode_Font;
