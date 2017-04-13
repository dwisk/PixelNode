/**
 * PixelNode_FontManager
 *
 * Base class for managing fonts
 *
 * --------------------------------------------------------------------------------------------------------------------
 *
 * Example Font
 * ```
 * const PixelNode_Font = require('../../lib/PixelNode_Font');
 *
 * class PixelNode_Font_Abc extends PixelNode_Font {
 *   constructor(callback) {
 *     super(callback, {
 *       name: "04b3",
 *       image: __dirname + "/letters.png",
 *       mapping: " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?*#.;-_=&%$/@"
 *     });
 *   }
 * }
 * module export module.exports = PixelNode_Font_Abc;
 * ```
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
    var FontModule = global.pixelnodeRequireFile(global.config.fonts[self.fonts.length]);
  	self.fonts.push(new FontModule(self.loadFonts.bind(self)));
  }
}

PixelNode_FontManager.prototype.getFont = function(name) {
  for (var i = 0; i < this.fonts.length; i++) {
    if (this.fonts[i].name == name) return this.fonts[i];
  }
  console.log(("Pixelnode_FontManager:").grey,("Font '"+name+"' not found!").yellow);
  return false;
}
