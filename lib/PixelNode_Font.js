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

/* Node Inclues
 * ==================================================================================================================== */

var _ = require('underscore'),
   fs = require('fs'),
   PNG = require('pngjs').PNG;


/* Class Constructor
 * ==================================================================================================================== */

function PixelNode_Font(callback, options) {
	this.options = _.extend({},this.base_options, this.default_options, options);
	this.name = this.options.name;
	this.init(callback);
}

// module export
module.exports = PixelNode_Font;


/* Variables
 * ==================================================================================================================== */

PixelNode_Font.prototype.base_options = {
  image: __dirname + "/letters.png",
  mapping: " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?"
}
PixelNode_Font.prototype.default_options = {}
PixelNode_Font.prototype.options = {}
PixelNode_Font.prototype.letters = [];
PixelNode_Font.prototype.spacing = [];
PixelNode_Font.prototype.initializing = false;
PixelNode_Font.prototype.initialized = false;


/* Override Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Font.prototype.init = function(callback) {
  if (!this.initializing) {
    this.initializing = true;
    this.parseFont(callback);
  }
}


PixelNode_Font.prototype.parseFont = function(callback) {
  console.log("Reading Font...".grey, this.options.image);
  var self = this;
  var cnt = 1;
  var spacingStarted = false;
  var spacingDone = false;

  fs.createReadStream(this.options.image)
  .pipe(new PNG({
      filterType: 4
      }))
  .on('parsed', function() {
    var slices = [];
    for (var x = 0; x < this.width; x++) {
      slices[x] = [];
      for (var y = 0; y < this.height; y++) {
        var idx = (this.width * y + x) << 2;
        slices[x][y] = !(this.data[idx] > 128 || this.data[idx+1] > 128 || this.data[idx+2] > 128);
      }
    }

    self.letters[0] = [0,0,0,0]

    for (var x = 0; x < this.width; x++) {
      var empty = true;
      if (!self.letters[cnt]) self.letters[cnt] = [];
        for (var y = 0; y < this.height; y++) {
          if (slices[x][y]) {
            empty = false;
          }
        }

      if (empty) {
        if (self.letters[cnt].length) cnt++;
        spacingStarted = true;
        if (!spacingDone) self.spacing.push(slices[x]);
      } else {
        self.letters[cnt].push(slices[x]);
        if (spacingStarted) spacingDone = true;
      }
    }

    console.log("Parsed " + self.letters.length + " Letters for",self.name,"Spacing:",self.spacing.length);
    self.initialized = true;
    if (typeof callback === "function") callback();

  });
}

/* Methods
 * ==================================================================================================================== */

PixelNode_Font.prototype.mapWord = function(word) {
  if (!this.initialized) return;

   var map = this.mapChar(word.charAt(0));
   map = map.concat(this.spacing);

   for (var i = 1; i < word.length; i++) {
     map = map.concat(this.mapChar(word.charAt(i)));
     map = map.concat(this.spacing);
   }
   return map;
 }

PixelNode_Font.prototype.logWord = function(word) {
  if (!this.initialized) return;
   this.logMap(this.mapWord(word));
 }

PixelNode_Font.prototype.logChar = function(char) {
  if (!this.initialized) return;
   this.logMap(this.mapChar(char));
 }

PixelNode_Font.prototype.mapChar = function(char) {
  if (!this.initialized) return;
   var num = this.getLetterNum(char);
   if (num == -1) {
     console.error("Char '" + char + "'not found!");
     process.exit(1);
   } else {
     return this.letters[num];
   }

 }

PixelNode_Font.prototype.getLetterNum = function(letter) {
  if (!this.initialized) return;
   return this.options.mapping.indexOf(letter);
 }


PixelNode_Font.prototype.logMap = function(map) {
  if (!this.initialized) return;
   for (var y = 0; y < map[0].length; y++) {
     var row = "";
     for (var x = 0; x < map.length; x++) {
       row += map[x][y] ? "█": " ";
     }
     row += " ";
     console.log(row);
   }
 }
