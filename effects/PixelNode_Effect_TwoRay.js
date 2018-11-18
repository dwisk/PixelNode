/**
 * PixelNode_Effect_TwoRay 
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
function PixelNode_Effect_TwoRay(options,pixelData) {
  var self = this;
  PixelNode_Effect_TwoRay.super_.call(self, options, pixelData);
  this.className = "PixelNode_Effect_TwoRay";
  self.public_dir = __dirname;
}

// class inheritance 
util.inherits(PixelNode_Effect_TwoRay, PixelNode_Effect);

// module export
module.exports = PixelNode_Effect_TwoRay;


/* Variables
 * ==================================================================================================================== */




/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Effect_TwoRay.prototype.init = function() {
	console.log("Init Effect Glitter".grey);
}

// draw effect on target
PixelNode_Effect_TwoRay.prototype.drawTarget = function(target, output_name) {
	var self = this;

	// get color 1
	var c1 = self.getColor(["inputs","rgb","color_left"]);

	// get color 2
	var c2 = self.getColor(["inputs","rgb","color_right"], {
		dimmer: 0.5,
		offset: 90
	});

	// draw effect
	for (var ring = 0; ring < target.length;ring++) {
		// console.log(ring,Math.round(self.counter/10/target.length) % 12);
		if(ring,Math.round(self.counter/10/target.length) % target.length == ring) {
			c = c1;
		} else if (global.pixelNode.data.fastGet(["inputs","buttons","btn_"+ring])) {
			c = c1;
		} else {
			c = c2;
		}
		
		for (var pixel = 0; pixel < target[ring].length; pixel++) {
			target[ring][pixel] = c;
		}			    
	}

}




