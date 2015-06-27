/**
 * PixelNode_Effect_Wave 
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
function PixelNode_Effect_Wave(options,pixelData) {
  var self = this;
  PixelNode_Effect_Wave.super_.call(self, options, pixelData);
  this.className = "PixelNode_Effect_Wave";
  self.public_dir = __dirname;
}

// class inheritance 
util.inherits(PixelNode_Effect_Wave, PixelNode_Effect);

// module export
module.exports = PixelNode_Effect_Wave;


/* Variables
 * ==================================================================================================================== */

 PixelNode_Effect_Wave.prototype.default_options = {
 	scale: 0.5,
 	speed: 1,
 	waveBase: 0.25,
 	waveHeight: 0.25,
 	waveTop: false
 }


/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Effect_Wave.prototype.init = function() {
	console.log("Init Effect RedBlue".grey);
}

// draw effect on target
PixelNode_Effect_Wave.prototype.drawTarget = function(target) {
	var self = this;
	var millis = new Date().getTime();
	var self = this;

	// get color 1
	var c1 = self.getColor("inputs.rgb.color_left");

	// get color 2
	var c2 = self.getColor("inputs.rgb.color_right", {
		dimmer: 0.5,
		offset: 90
	});

	for (var ring = 0; ring < target.length;ring++) {
		base = target[ring].length * self.options.waveBase;
		height = target[ring].length* self.options.waveHeight;
		var t = ring / self.options.scale * 0.5 + millis * 0.002 * self.options.speed;
		for (var pixel = 0; pixel < target[ring].length; pixel++) {
			var wave = base + height * Math.sin(t);

			if (global.pixelNode.data.get(["inputs","touch","touches",ring])) {
				c = c1;
			} else if (pixel <= wave) {
				c = self.options.waveTop ? c2: c1;
			} else {
				c = self.options.waveTop ? c1: c2;
			}

			target[ring][pixel] = c;
		}			    
	}

}


