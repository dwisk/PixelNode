/**
 * PixelNode_Effect_SpriteSpark
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
PixelNode_Effect = require('./PixelNode_Effect.js');

// define the Student class
function PixelNode_Effect_SpriteSpark(options,pixelData) {
  var self = this;
  PixelNode_Effect_SpriteSpark.super_.call(self, options, pixelData);
  self.className = "PixelNode_Effect_SpriteSpark";
  self.public_dir = __dirname;
}

// class inheritance
util.inherits(PixelNode_Effect_SpriteSpark, PixelNode_Effect);

// module export
module.exports = PixelNode_Effect_SpriteSpark;


/* Variables
 * ==================================================================================================================== */

 PixelNode_Effect_SpriteSpark.prototype.n = 1;
 PixelNode_Effect_SpriteSpark.prototype.sprites = [];
 PixelNode_Effect_SpriteSpark.prototype.spritePrototype = {
	index: null,
	color1: [0, 255, 0 ],
 	color2: [255, 0, 0 ],
 	position: 0,
 	timerPosition: 0
 };

 PixelNode_Effect_SpriteSpark.prototype.default_options = {
 	scale: 1,
 	speed: 10
 }




/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Effect_SpriteSpark.prototype.init = function() {
	console.log("Init Effect Sprite Spark".grey);
}

// draw effect on target
PixelNode_Effect_SpriteSpark.prototype.drawTarget = function(target, output) {
	var self = this;
	var c, c1, c2;

	// get color 1
	c1 = self.getColor(["inputs","rgb","color_right"], {
		offset: 90
	});
	c2 = self.getColor(["inputs","rgb","color_left"]);

	self.spritePrototype.color1 = c1;
	self.spritePrototype.color2 = c2;

	// get color 1
	cc1 = self.getColor(["inputs","rgb","color_right"], {
		offset: 90,
		dimmer: 0.25
	});
	// get color 2
	cc2 = self.getColor(["inputs","rgb","color_left"], {
		dimmer: 0.25
	});

	for (var ring = 0; ring < target.length;ring++) {
		ringoffseted = ring -1;
		if ( ringoffseted < 0 ) ringoffseted = ringoffseted + target.length;
		onetwo = ringoffseted / target.length < 0.5;

		self.fillColor(target[ring],  onetwo ? cc2 : cc1);
	}

	for (var i = 0; i < self.sprites.length; i++) {
		var sprite = self.sprites[i];
		if (sprite.position+2 > target[0].length) {
			self.sprites.splice(i,1);
			i--;
		} else {
			sprite.timerPosition++;
			sprite.position = Math.ceil(sprite.timerPosition / self.options.speed) -1;

			ringoffseted = sprite.index -1;
			if ( ringoffseted < 0 ) ringoffseted = ringoffseted + target.length;
			onetwo = ringoffseted / target.length < 0.5;

			color = onetwo ? sprite.color2 : sprite.color1;
			target[sprite.index][sprite.position] = color;
			if (sprite.position > 1) target[sprite.index][sprite.position-1] = self.dimmColor(color, 0.75);
			if (sprite.position > 2) target[sprite.index][sprite.position-2] = self.dimmColor(color, 0.5);
		}

	}
}

PixelNode_Effect_SpriteSpark.prototype.reset = function() {
	this.sprites = [];
}
