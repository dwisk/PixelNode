/**
 * PixelNode_Effect_Fire 
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
function PixelNode_Effect_Fire(options,pixelData) {
  var self = this;
  PixelNode_Effect_Fire.super_.call(self, options, pixelData);
  this.className = "PixelNode_Effect_Fire";
  self.public_dir = __dirname;
}

// class inheritance 
util.inherits(PixelNode_Effect_Fire, PixelNode_Effect);

// module export
module.exports = PixelNode_Effect_Fire;


/* Variables
 * ==================================================================================================================== */

 PixelNode_Effect_Fire.prototype.default_options = {
 	scale: 1,
 	speed: 0.5
 }
 PixelNode_Effect_Fire.prototype.height = 1
 PixelNode_Effect_Fire.prototype.heights = []

/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Effect_Fire.prototype.init = function() {
	console.log("Init Effect RedBlue".grey);
}

// draw effect on target
PixelNode_Effect_Fire.prototype.drawTarget = function(target) {
	var self = this;
	var millis = new Date().getTime();

	for (var ring = 0; ring < target.length;ring++) {
		flicker = Math.random(1)*0.5 + 0.5;
		tmp_height = self.heights[ring] * flicker;

		if (self.heights[ring] == undefined) { self.heights[ring] = Math.random(1)*0.1+0.9}

		for (var pixel = 0; pixel < target[ring].length; pixel++) {
			if (target[ring].length * tmp_height > pixel) {
				red = 255 *tmp_height;
				
				

				green = 255* (pixel  / target[ring].length) *tmp_height;
			} else if (target[ring].length * tmp_height > pixel-(1*self.options.scale)) {
				red = 128 *tmp_height;
				green = 128* (pixel  / target[ring].length) *tmp_height;
			} else if (target[ring].length * tmp_height > pixel-(2*self.options.scale)) {
				red = 64 *tmp_height;
				green = 32 * (pixel  / target[ring].length) *tmp_height;
			} else {
				red = 32;
				green = 0;
			}

			//red = red * tmp_height*1.25;
			//green = green * tmp_height *0.75;
			if (green > red) green = red;



			target[ring][pixel] = [red, green, 0];

		}			    
	
		if (tmp_height >= 0.1) {
			self.heights[ring] -= 0.001 * self.options.speed * (Math.random(1)*0.2 + 0.8);
		}
	}



}


