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
 	speed: 0.5,
 	gravity: 0.8
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
	for (var ring = 0; ring < target.length;ring++) {
		self.drops[target_name][ring] = [];
		self.intensity[ring] = Math.random(1)*0.1+0.9;
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

		ran = Math.round(Math.random()*(0.5 + 0.40 * self.intensity[ring]*self.options.gravity));
		if (ran) {
			self.drops[target_name][ring].push(target[ring].length);
		}


		for (var pixel = 0; pixel < target[ring].length; pixel++) {
			
			blue = 0;

			for (var drop = 0; drop < self.drops[target_name][ring].length; drop++) {
				if (Math.ceil(self.drops[target_name][ring][drop]) == pixel) {
					blue = 255;
				} else if (Math.ceil(self.drops[target_name][ring][drop])+1 == pixel) {
					blue = 128;
				} else if (Math.ceil(self.drops[target_name][ring][drop])+2 == pixel) {
					blue = 64;
				}
			}


			target[ring][pixel] = [0,0,blue];

		}		

		for (var drop = 0; drop < self.drops[target_name][ring].length; drop++) {
			if (self.drops[target_name][ring][drop] < 0) {
				self.drops[target_name][ring].splice(drop,1);
			} 
			self.drops[target_name][ring][drop] = self.drops[target_name][ring][drop] - self.options.gravity;
		}
	    

		if (self.intensity[ring] >= 0.03) {
			self.intensity[ring] -= 0.005 * self.options.speed * (Math.random(1)*0.2 + 0.8);
		}
	
	}



}


