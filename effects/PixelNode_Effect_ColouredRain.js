/**
 * PixelNode_Effect_ColouredRain 
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
function PixelNode_Effect_ColouredRain(options,pixelData) {
  var self = this;
  PixelNode_Effect_ColouredRain.super_.call(self, options, pixelData);
  this.className = "PixelNode_Effect_ColouredRain";
  self.public_dir = __dirname;
}

// class inheritance 
util.inherits(PixelNode_Effect_ColouredRain, PixelNode_Effect);

// module export
module.exports = PixelNode_Effect_ColouredRain;


/* Variables
 * ==================================================================================================================== */

 PixelNode_Effect_ColouredRain.prototype.default_options = {
 	scale: 1,
 	speed: 0.5,
 	gravity: 0.8
 }
 PixelNode_Effect_ColouredRain.prototype.intensity = []
 PixelNode_Effect_ColouredRain.prototype.drops = {}
 PixelNode_Effect_ColouredRain.prototype.target_cnt = {}

/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Effect_ColouredRain.prototype.init = function() {
	console.log("Init Effect RedBlue".grey);

}

// reset effect – override
PixelNode_Effect_ColouredRain.prototype.reset = function() {
	// manually init targets (otherwise just happening after initial init)
	this.initTargets();
}

// init target – override
PixelNode_Effect_ColouredRain.prototype.initTarget = function(target, output, target_name) {
	var self = this;
	target_name = target_name.replace(".", "_");

	self.drops[target_name] = [];	
	for (var ring = 0; ring < target.length;ring++) {
		self.drops[target_name][ring] = [];
		self.intensity[ring] = Math.random(1)*0.1+0.9;
	}

	self.target_cnt[target_name] = 0;
}

var lastDraw = new Date();

// draw effect on target
PixelNode_Effect_ColouredRain.prototype.drawTarget = function(target, output, target_name) {
	var self = this;
	target_name = target_name.replace(".", "_");
	self.target_cnt[target_name]++;
	var dropamounts = 0;
	var before = new Date();
	var color1 = false;
	var c = [255,0,0];

	var c1 = self.getColor("inputs.rgb.color_right");
	var c2 = self.getColor("inputs.rgb.color_left");

	for (var ring = 0; ring < target.length;ring++) {
		if (self.intensity[ring] == undefined) { self.intensity[ring] = Math.random(1)*0.1+0.9}

		ran = Math.round(Math.random()*(0.5 + 0.40 * self.intensity[ring]*self.options.gravity));
		if (ran) {
			color1 = !color1;

			self.drops[target_name][ring].push([target[ring].length, color1 ? c1 : c2]);
		}


		for (var pixel = 0; pixel < target[ring].length; pixel++) {
			
			dropcolor = [0,0,0];

			for (var drop = 0; drop < self.drops[target_name][ring].length; drop++) {
				if (Math.ceil(self.drops[target_name][ring][drop][0]) == pixel) {
					dropcolor = self.drops[target_name][ring][drop][1];
				} else if (Math.ceil(self.drops[target_name][ring][drop][0])+1 == pixel) {
					dropcolor = [self.drops[target_name][ring][drop][1][0]*0.5, self.drops[target_name][ring][drop][1][1]*0.5, self.drops[target_name][ring][drop][1][2]*0.5];
				} else if (Math.ceil(self.drops[target_name][ring][drop][0])+2 == pixel) {
					dropcolor = [self.drops[target_name][ring][drop][1][0]*0.25, self.drops[target_name][ring][drop][1][1]*0.25, self.drops[target_name][ring][drop][1][2]*0.25];
				}
			}


			target[ring][pixel] = dropcolor;

		}		

		for (var drop = 0; drop < self.drops[target_name][ring].length; drop++) {
			if (self.drops[target_name][ring][drop][0] < 0) {
				self.drops[target_name][ring].splice(drop,1);
			} 
			if(self.drops[target_name][ring][drop]) {
				self.drops[target_name][ring][drop][0] = self.drops[target_name][ring][drop][0] - self.options.gravity;
			}
		}

		dropamounts += self.drops[target_name][ring].length;
	    

		if (self.intensity[ring] >= 0.03) {
			self.intensity[ring] -= 0.005 * self.options.speed * (Math.random(1)*0.2 + 0.8);
		}
	
	}

	var after = new Date();
	//console.log(Math.ceil(dropamounts / target.length), after-before, before - lastDraw);

	lastDraw = before;


}


