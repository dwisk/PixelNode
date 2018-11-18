/**
 * PixelNode_Effect_TwoGlitter 
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
function PixelNode_Effect_TwoGlitter(options,pixelData) {
  var self = this;
  PixelNode_Effect_TwoGlitter.super_.call(self, options, pixelData);
  this.className = "PixelNode_Effect_TwoGlitter";
  self.public_dir = __dirname;
}

// class inheritance 
util.inherits(PixelNode_Effect_TwoGlitter, PixelNode_Effect);

// module export
module.exports = PixelNode_Effect_TwoGlitter;


/* Variables
 * ==================================================================================================================== */



/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Effect_TwoGlitter.prototype.init = function() {
	console.log("Init Effect Glitter".grey);
}

// draw effect on target
PixelNode_Effect_TwoGlitter.prototype.drawTarget = function(target) {
	var self = this;
	var ran;
	var c, c1, c2; 

	// get color 1
	c1 = self.getColor(["inputs","rgb","color_left"]);

	// get color 2
	c2 = self.getColor(["inputs","rgb","color_right"], {
		dimmer: 0.5,
		offset: 90
	});


	var intensity;
	var rawIntensity = global.pixelNode.data.fastGet(["inputs","intensity"]);
	if (rawIntensity != null) {
		intensity = rawIntensity/2.5 + 0.6;
	} else {
		intensity = 0.6;
	}

//	console.log(intensity);

	for (var ring = 0; ring < target.length;ring++) {
		
		for (var pixel = 0; pixel < target[ring].length; pixel++) {
			ran = Math.round(Math.random()*intensity/1);
			
			if (ran == 1 || global.pixelNode.data.fastGet(["inputs","touch","touches",pixel])) {
				target[ring][pixel] = c1
			} else {
				target[ring][pixel] = c2
			}
		}			    
	}

}

