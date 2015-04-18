/**
 * PixelNode_Effect_Rainbow 
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
PixelNode_Effect = require('./PixelNode_Effect.js');

// define the Student class
function PixelNode_Effect_Rainbow(options,pixelData) {
  var self = this;
  PixelNode_Effect_Rainbow.super_.call(self, options, pixelData);
  self.className = "PixelNode_Effect_Rainbow";
}

// class inheritance 
util.inherits(PixelNode_Effect_Rainbow, PixelNode_Effect);

// module export
module.exports = PixelNode_Effect_Rainbow;


/* Variables
 * ==================================================================================================================== */

 PixelNode_Effect_Rainbow.prototype.n = 1;


/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Effect_Rainbow.prototype.init = function() {
	console.log("Init Effect Rainbow".grey);
}

// draw effect on target
PixelNode_Effect_Rainbow.prototype.drawTarget = function(target, output) {
	var self = this;

	for (var ring = 0; ring < target.length;ring++) {
		var offset = 0;
		//offset += 20;
		if (output == "rainbow") {
			self.fillRainbow(target[ring], self.counter+offset);		    
		} else {
			self.fillColor(target[ring], [250,0,0]);		    
		}
	}

}


