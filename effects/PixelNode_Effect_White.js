/**
 * PixelNode_Effect_White 
 * 
 * Rainbow Effect (TOOD: Performance)
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
function PixelNode_Effect_White(options,pixelData) {
  var self = this;
  PixelNode_Effect_White.super_.call(self, options, pixelData);
  self.className = "PixelNode_Effect_White";
  self.public_dir = __dirname;
}

// class inheritance 
util.inherits(PixelNode_Effect_White, PixelNode_Effect);

// module export
module.exports = PixelNode_Effect_White;


/* Variables
 * ==================================================================================================================== */

 PixelNode_Effect_White.prototype.n = 1;


/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Effect_White.prototype.init = function() {
	console.log("Init Effect Rainbow".grey);
}

// draw effect on target
PixelNode_Effect_White.prototype.drawTarget = function(target, output) {
	var self = this;
	
	for (var ring = 0; ring < target.length;ring++) {
		self.fillColor(target[ring], [255,255,255]);		    
	}

}


