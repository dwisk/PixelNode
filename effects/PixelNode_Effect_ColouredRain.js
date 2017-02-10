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
var _ = require("underscore");


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
 	speed: 1.5,
 	gravity: 1,
 	direction: 1
}
PixelNode_Effect_ColouredRain.prototype.intensity = []
PixelNode_Effect_ColouredRain.prototype.drops = []
PixelNode_Effect_ColouredRain.prototype.color1 = false
PixelNode_Effect_ColouredRain.prototype.dropPrototype = {
  index: null,
	position: -2,
	timerPosition: -2,
	color: [0,0,0]
};


/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Effect_ColouredRain.prototype.init = function() {
	console.log("Init Effect ColouredRain".grey);

}

// reset effect – override
PixelNode_Effect_ColouredRain.prototype.reset = function() {
	// manually init targets (otherwise just happening after initial init)
	this.initTargets();
}

// init target – override
PixelNode_Effect_ColouredRain.prototype.initTarget = function(target, output, target_name) {
	var self = this;

	for (var ring = 0; ring < target.length;ring++) {
		self.intensity[ring] = Math.random(1)*0.1+0.9;
	}

	self.dropPrototype.position = target[0].length;
	self.drops[target_name] = [];

}

var lastDraw = new Date();

// draw effect on target
PixelNode_Effect_ColouredRain.prototype.drawTarget = function(target, output, target_name) {
	var self = this;
	var color1 = false;

	var c1 = self.getColor(["inputs","rgb","color_right"]);
	var c2 = self.getColor(["inputs","rgb","color_left"]);

	var target_length = target[0].length;

	for (var ring = 0; ring < target.length;ring++) {
		if (self.intensity[ring] == undefined) { self.intensity[ring] = Math.random(1)*0.1+0.9}

		ran = Math.round(Math.random()*(0.51 + 0.20 * self.intensity[ring]*self.options.gravity));
		if (ran) {
			self.color1 = !self.color1;

			var drop = _.clone(self.dropPrototype);
			drop.index = ring;
			drop.color = self.color1 ? c1 : c2;
			drop.position = self.options.direction<0 ? target_length-1 : 0;

			self.drops[target_name].push( drop);
		}
		self.fillColor(target[ring],  [0,0,0]);

		if (self.intensity[ring] >= 0.03) {
			self.intensity[ring] -= 0.002 * self.options.speed * (Math.random(1)*0.2 + 0.8);
		}

	}

	for (var i = 0; i < self.drops[target_name].length; i++) {
		var drop = self.drops[target_name][i];
		if ((self.options.direction < 0 && drop.position+3 <= 0) || (self.options.direction > 0 && drop.position-3 >= target_length)) {
			self.drops[target_name].splice(i,1);
			i--;
		} else {
			drop.timerPosition +=  self.options.direction;
			if (self.options.direction >0) {
				drop.position = Math.floor(drop.timerPosition / self.options.gravity);
			} else {
				drop.position = target_length - Math.floor(drop.timerPosition / self.options.gravity);
			}


			if (drop.position >= 0 && drop.position < target_length) target[drop.index][drop.position] = drop.color;
			if (drop.position+1*self.options.direction*-1 >= 0 && drop.position+1*self.options.direction*-1 < target_length) target[drop.index][drop.position+1*self.options.direction*-1] = self.dimmColor(drop.color, 0.5);
			if (drop.position+2*self.options.direction*-1 >= 0 && drop.position+2*self.options.direction*-1 < target_length) target[drop.index][drop.position+2*self.options.direction*-1] = self.dimmColor(drop.color, 0.33);
		}

	}

	//console.log(self.drops[target_name].length);

}
