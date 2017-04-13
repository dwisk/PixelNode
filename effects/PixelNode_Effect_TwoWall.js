/**
 * PixelNode_Effect_TwoWall
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
function PixelNode_Effect_TwoWall(options,pixelData) {
  var self = this;
  PixelNode_Effect_TwoWall.super_.call(self, options, pixelData);
  this.className = "PixelNode_Effect_TwoWall";
  self.public_dir = __dirname;
}

// class inheritance
util.inherits(PixelNode_Effect_TwoWall, PixelNode_Effect);

// module export
module.exports = PixelNode_Effect_TwoWall;


/* Variables
 * ==================================================================================================================== */

PixelNode_Effect_TwoWall.prototype.counterOffset = 0;
PixelNode_Effect_TwoWall.prototype.cfirst = false;
PixelNode_Effect.prototype.default_options = {
	scale: 1
}


/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Effect_TwoWall.prototype.init = function() {
	console.log("Init Effect TwoWall".grey);
}

PixelNode_Effect_TwoWall.prototype.reset = function() {
	var self = this;
	self.counterOffset = 0;
}

// draw effect on target
PixelNode_Effect_TwoWall.prototype.drawTarget = function(target) {
	var self = this;
	var millis = new Date().getTime();
	var ran;
	var c, c1, c2;

	// get color 1
	c1 = self.getColor(["inputs","rgb","color_left"]);

	// get color 2
	c2 = self.getColor(["inputs","rgb","color_right"], {
		dimmer: 0.5,
		offset: 90
	});

	// get color 2b
	c2b = self.getColor(["inputs","rgb","color_right"], {
		dimmer: 0.75,
		offset: 45
	});

	var speed = 100;
	position = Math.floor(((self.counter - self.counterOffset) / speed) % target[0].length);
	height = Math.floor(((self.counter - self.counterOffset) / speed) / target[0].length) * self.options.scale;
	if (height >= target.length) {
		self.counterOffset = self.counter;
		height = 0;
		self.cfirst = !self.cfirst;
	}

	if (self.counterOffset > self.counter) {
		self.reset();
	}

	// draw effect
	for (var ring = 0; ring < target.length;ring++) {
		var p = 0;
		// console.log(ring,Math.round(self.counter/10/target.length) % 12);


		for (var pixel = 0; pixel < target[ring].length; pixel++) {
			if (global.pixelNode.data.fastGet(["inputs","touch","touches",pixel])) {
				c = [0,0,0];
			} else if (ring < height || (ring < height+self.options.scale && pixel <= position)) {
				c = self.cfirst ? c1 : c2;
			} else if ((ring < height+self.options.scale && pixel <= position+1)) {
				c = c2b;
			} else {
				c = self.cfirst ? c2 : c1;
			}
			target[ring][pixel] = c;
		}
	}

}
