/**
 * PixelNode_Effect_TwoClock 
 * 
 * Clock Effect
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
function PixelNode_Effect_TwoClock(options,pixelData) {
  var self = this;
  PixelNode_Effect_TwoClock.super_.call(self, options, pixelData);
  self.className = "PixelNode_Effect_TwoClock";
  self.public_dir = __dirname;
}

// class inheritance 
util.inherits(PixelNode_Effect_TwoClock, PixelNode_Effect);

// module export
module.exports = PixelNode_Effect_TwoClock;


/* Variables
 * ==================================================================================================================== */

PixelNode_Effect_TwoClock.prototype.default_options = {
 	scale: 1,
 	offset: -1
}
PixelNode_Effect_TwoClock.prototype.colorSelect = false;
PixelNode_Effect_TwoClock.prototype.hueSelect = 0;


/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Effect_TwoClock.prototype.init = function() {
	console.log("Init Effect Rainbow".grey);
}


var lastTouches = [];

// draw effect on target
PixelNode_Effect_TwoClock.prototype.drawTarget = function(target, output) {
	var self = this;

	var c, c1, c2; 

	// get color 1
	c1 = self.getColor("inputs.rgb.color_left");

	// get color 2
	c2 = self.getColor("inputs.rgb.color_right", {
		dimmer: 0.5,
		offset: 0
	});

	// get color 2
	c3 = self.getColor("inputs.rgb.color_right", {
		dimmer: 0.5,
		offset: 90
	});

	//console.log(c1, c2);
	var time = new Date();
	var internal_scale = 60 / target[0].length;
	var hour = time.getHours() + self.options.offset;
	var minute = time.getMinutes() + self.options.offset * internal_scale;
	var second = time.getSeconds() + self.options.offset * internal_scale;

	if (hour >= 12 ) hour -= 12;
	if (minute >= 60 ) minute -= 60;
	if (second >= 60 ) second -= 60;

	if (hour < 0 ) hour += 12;
	if (minute < 0 ) minute += 60;
	if (second < 0 ) second += 60;

	for (var ring = 0; ring < target.length;ring++) {
		for (var pixel = 0; pixel < target[ring].length; pixel++) {
			if ( (minute >= ring*internal_scale && minute < (ring+1)*internal_scale && pixel >= 1*self.options.scale) 
		     || (ring == hour && pixel > 3*self.options.scale) 
				) {
				target[ring][pixel] = c2;
			} else if ( global.pixelNode.data.get(["inputs","touch","touches",ring])
			 ||	(second >= ring*internal_scale && second < (ring+1)*internal_scale ) 
				) {
				target[ring][pixel] = c1;
			} else {
				target[ring][pixel] = c3;
			}
		}			    
	}
}

