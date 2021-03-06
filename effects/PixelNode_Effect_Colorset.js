/**
 * PixelNode_Effect_Colorset
 *
 * Ported fadecandy example
 *
 * --------------------------------------------------------------------------------------------------------------------
 *
 * @author Amely Kling <mail@dwi.sk>
 *
 */

/* Includes
 * ==================================================================================================================== */

var util = require("util");


/* Class Constructor
 * ==================================================================================================================== */

// extending Effect
PixelNode_Effect = require('../lib/PixelNode_Effect.js');

// define the Student class
function PixelNode_Effect_Colorset(options,pixelData) {
  var self = this;
  PixelNode_Effect_Colorset.super_.call(self, options, pixelData);
  self.className = "PixelNode_Effect_Colorset";
  self.public_dir = __dirname;
}

// class inheritance
util.inherits(PixelNode_Effect_Colorset, PixelNode_Effect);

// module export
module.exports = PixelNode_Effect_Colorset;


/* Variables
 * ==================================================================================================================== */

PixelNode_Effect_Colorset.prototype.n = 1;
PixelNode_Effect.prototype.default_options = {
	scale: 1,
	speed: 100,
	colorset: [
		[255,0,0],
		[0,255,0],
		[0,0,255]
	]
}


/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Effect_Colorset.prototype.init = function() {
	console.log("Init Effect ColorSet".grey);
}

// draw effect on target
PixelNode_Effect_Colorset.prototype.drawTarget = function(target, output) {
	var self = this;
	var colors = [];

	var i = 0;

	for (var ring = 0; ring < target.length;ring++) {
		if (output == "rainbow") {
			self.fillArray(target[ring], self.options.colorset);

		} else {
			self.fillColor(target[ring], [0,0,0]);
		}
	}

}
