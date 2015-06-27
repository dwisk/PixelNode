/**
 * PixelNode_Effect_Rain 
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
function PixelNode_Effect_Rain(options,pixelData) {
  var self = this;
  PixelNode_Effect_Rain.super_.call(self, options, pixelData);
  this.className = "PixelNode_Effect_Rain";
  self.public_dir = __dirname;
}

// class inheritance 
util.inherits(PixelNode_Effect_Rain, PixelNode_Effect);

// module export
module.exports = PixelNode_Effect_Rain;


/* Variables
 * ==================================================================================================================== */

 PixelNode_Effect_Rain.prototype.default_options = {
 	scale: 1,
 	speed: 0.5
 }
 PixelNode_Effect_Rain.prototype.intensity = []
 PixelNode_Effect_Rain.prototype.drops = {}
 PixelNode_Effect_Rain.prototype.target_cnt = {}

/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Effect_Rain.prototype.init = function() {
	console.log("Init Effect RedBlue".grey);

}

// reset effect – override
PixelNode_Effect_Rain.prototype.reset = function() {
	// manually init targets (otherwise just happening after initial init)
	this.initTargets();
}

// init target – override
PixelNode_Effect_Rain.prototype.initTarget = function(target, output, target_name) {
	var self = this;
	target_name = target_name.replace(".", "_");

	self.drops[target_name] = [];	
	// create drops for each ring
	for (var ring = 0; ring < target.length;ring++) {
		self.drops[target_name][ring] = [];
		// do double the length
		for (var pixel = 0; pixel < target[ring].length*4; pixel++) {
			ran = Math.round(Math.random()*(0.51 + 0.4 * self.intensity[ring]));
			self.drops[target_name][ring][pixel] = ran;
		//	console.log(pixel,self.drops[target_name][ring][pixel]);
		}

	}	

	self.target_cnt[target_name] = 0;
}


// draw effect on target
PixelNode_Effect_Rain.prototype.drawTarget = function(target, output, target_name) {
	var self = this;
	target_name = target_name.replace(".", "_");
	self.target_cnt[target_name]++;

	for (var ring = 0; ring < target.length;ring++) {
		if (self.intensity[ring] == undefined) { self.intensity[ring] = Math.random(1)*0.1+0.9}

		for (var pixel = 0; pixel < target[ring].length; pixel++) {
			//console.log(pixel,self.drops[target_name][ring][pixel]);
			red = 0;
			if (self.drops[target_name][ring][pixel]) {
				blue = 255;
			} else if (self.drops[target_name][ring][pixel-1]) {
				blue = 128;
			} else if (self.drops[target_name][ring][pixel-2]) {
				blue = 64;
			} else {
				blue = 0;
			}

			target[ring][pixel] = [red,0,blue];

		}			    
		if (self.target_cnt[target_name] % 2 == 0) {
			var segment1 = self.drops[target_name][ring].slice(1, self.drops[target_name][ring].length);
			var segment2 = self.drops[target_name][ring].slice(0,1);
			self.drops[target_name][ring] = segment1.concat(segment2);
		}

		if (self.target_cnt[target_name] % 50 == 0) {
			self.intensity[ring] -= 0.1 * self.options.speed * (Math.random(1)*0.2 + 0.8);
			this.initTargets();
		}
	
	}



}


