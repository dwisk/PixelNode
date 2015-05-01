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
	var colors = [];
	var offset = 0;

	colors = self.getRainbow(target[0].length, (self.counter+offset)/-10);
	
	for (var ring = 0; ring < target.length;ring++) {
		if (output == "rainbow") {
			self.fillArray(target[ring], colors);		    
		} else {
			self.fillColor(target[ring], [0,0,0]);		    
		}
	}

}


