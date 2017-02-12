/**
 * PixelNode_FontManager
 *
 * Base class for managing inputs
 *
 * --------------------------------------------------------------------------------------------------------------------
 *
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Node Inclues
 * ==================================================================================================================== */

var extend = require('util')._extend;


/* Class Constructor
 * ==================================================================================================================== */

function PixelNode_FontManager(options, fonts) {
	this.options = extend(extend(this.base_options, this.default_options), options);

	var self = this;

	// configured inputs
  this.loadFonts();

	// call init
	this.init();
}

// module export
module.exports = PixelNode_FontManager;


/* Variables
 * ==================================================================================================================== */

PixelNode_FontManager.prototype.base_options = {}
PixelNode_FontManager.prototype.default_options = {}
PixelNode_FontManager.prototype.options = {}
PixelNode_FontManager.prototype.fonts = [];


/* Methods
 * ==================================================================================================================== */

PixelNode_FontManager.prototype.init = function() {
	console.log("Init PixelNode_FontManager".grey);

};

PixelNode_FontManager.prototype.loadFonts = function() {
  var self = this;
  if (self.fonts.length < global.config.fonts.length) {
    var font_module = require(global.config.fonts[self.fonts.length].module);
  	self.fonts.push(new font_module(self.loadFonts.bind(self), global.config.fonts[self.fonts.length]));
  }
}

PixelNode_FontManager.prototype.getFont = function(name) {
  for (var i = 0; i < this.fonts.length; i++) {
    if (this.fonts[i].name == name) return this.fonts[i];
  }
  console.log(("Font '"+name+"' not found!").yellow);
  return false;
}
