/**
 * PixelNode_Effect_Off
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
PixelNode_Effect = require('./PixelNode_Effect.js');

// define the Student class
function PixelNode_Effect_Off(options,pixelData) {
  var self = this;
  PixelNode_Effect_Off.super_.call(self, options, pixelData);
  self.className = "PixelNode_Effect_Off";
  self.public_dir = __dirname;
}

// class inheritance
util.inherits(PixelNode_Effect_Off, PixelNode_Effect);

// module export
module.exports = PixelNode_Effect_Off;


/* Variables
 * ==================================================================================================================== */

 PixelNode_Effect_Off.prototype.n = 1;


/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Effect_Off.prototype.init = function() {
	console.log("Init Effect Off".grey);
}

// draw effect on target
PixelNode_Effect_Off.prototype.drawTarget = function(target, output) {
	var self = this;

	for (var ring = 0; ring < target.length;ring++) {
		self.fillColor(target[ring], [0,0,0]);
	}

}
