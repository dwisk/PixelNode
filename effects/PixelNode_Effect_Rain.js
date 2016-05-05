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
var _ = require("underscore");


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
 	speed: 2,
 	gravity: 0.8
 }
 PixelNode_Effect_Rain.prototype.intensity = []
 PixelNode_Effect_Rain.prototype.drops = {}
 PixelNode_Effect_Rain.prototype.target_cnt = {}
 PixelNode_Effect_Rain.prototype.dropPrototype = {
 	index: null,
  	position: 0,
  	timerPosition: 256
 };

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

	self.drops = [];	
	for (var ring = 0; ring < target.length;ring++) {
		self.intensity[ring] = Math.random(1)*0.1+0.9;
	}

	self.target_cnt[target_name] = 0;

	self.dropPrototype.position = target[0].length+2;
	self.dropPrototype.timerPosition = target[0].length*2+4;
}

var lastDraw = new Date();

// draw effect on target
PixelNode_Effect_Rain.prototype.drawTarget = function(target, output, target_name) {
	var self = this;
	target_name = target_name.replace(".", "_");
	self.target_cnt[target_name]++;

	for (var ring = 0; ring < target.length;ring++) {
		if (self.intensity[ring] == undefined) { self.intensity[ring] = Math.random(1)*0.1+0.9}

		ran = Math.round(Math.random()*(0.51 + 0.20 * self.intensity[ring]*self.options.gravity));
		if (ran) {
			var drop = _.clone(self.dropPrototype);
			drop.index = ring;
			self.drops.push( drop);
		}
		self.fillColor(target[ring],  [0,0,0]);

		if (self.intensity[ring] >= 0.03) {
			self.intensity[ring] -= 0.002 * self.options.speed * (Math.random(1)*0.2 + 0.8);
		}
	
	}
	for (var i = 0; i < self.drops.length; i++) {
		var drop = self.drops[i];
		if (drop.position+3 <= 0) {
			self.drops.splice(i,1);
			i--;
		} else {
			drop.timerPosition--;
			drop.position = Math.ceil(drop.timerPosition / self.options.speed) -1;

			ringoffseted = drop.index -1;
			if ( ringoffseted < 0 ) ringoffseted = ringoffseted + target.length;
			onetwo = ringoffseted / target.length < 0.5;
			
			color = [0,0,255];
			target[drop.index][drop.position] = color;
			if (drop.position > 1) target[drop.index][drop.position+1] = self.dimmColor(color, 0.75);
			if (drop.position > 2) target[drop.index][drop.position+2] = self.dimmColor(color, 0.5);
		}

	}


}


