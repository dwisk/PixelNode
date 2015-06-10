/**
 * PixelNode_Effect_Glitter 
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
PixelNode_Effect = require('../../lib/PixelNode_Effect.js');

// define the Student class
function PixelNode_Effect_Glitter(options,pixelData) {
  var self = this;
  PixelNode_Effect_Glitter.super_.call(self, options, pixelData);
  this.className = "PixelNode_Effect_Glitter";
  self.public_dir = __dirname;
}

// class inheritance 
util.inherits(PixelNode_Effect_Glitter, PixelNode_Effect);

// module export
module.exports = PixelNode_Effect_Glitter;


/* Variables
 * ==================================================================================================================== */



/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Effect_Glitter.prototype.init = function() {
	console.log("Init Effect Glitter".grey);
}

// draw effect on target
PixelNode_Effect_Glitter.prototype.drawTarget = function(target) {
	var self = this;
	var ran;
	var c, c1, c2;

	// get color 1
	c = global.pixelNode.data.get("inputs.rgb.color_left");
	if (c && (c[0] != 0 || c[1] != 0 || c[2] != 0)) {		
		c1 = new RGBColour(c[0],c[1],c[2]).getRGB();
	} else {
		c1 = new HSVColour(self.counter/50, 100, 100).getRGB();
	}

	// get color 2
	c = global.pixelNode.data.get("inputs.rgb.color_right");
	if (c && (c[0] != 0 || c[1] != 0 || c[2] != 0)) {		
		c2 = new RGBColour(c[0]*0.5,c[1]*0.5,c[2]*0.5).getRGB();
	} else {
		c2 = new HSVColour(self.counter/50+90, 100, 50).getRGB();
	}

	var intensity;
	if (global.pixelNode.data.get("inputs.intensity") != null) {
		intensity = global.pixelNode.data.get("inputs.intensity")/2.5 + 0.6;
	} else {
		intensity = 0.6;
	}

//	console.log(intensity);

	for (var ring = 0; ring < target.length;ring++) {
		
		for (var pixel = 0; pixel < target[ring].length; pixel++) {
			ran = Math.round(Math.random()*intensity/1);
			
			if (ran == 1) {
				target[ring][pixel] = [c1.r, c1.g, c1.b];
			} else {
				target[ring][pixel] = [c2.r, c2.g, c2.b];
			}
		}			    
	}

}

