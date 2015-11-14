/**
 * PixelNode_Effect_SpriteGrow 
 * 
 * Rainbow Effect (TOOD: Performance)
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
function PixelNode_Effect_SpriteGrow(options,pixelData) {
  var self = this;
  PixelNode_Effect_SpriteGrow.super_.call(self, options, pixelData);
  self.className = "PixelNode_Effect_SpriteGrow";
  self.public_dir = __dirname;
}

// class inheritance 
util.inherits(PixelNode_Effect_SpriteGrow, PixelNode_Effect);

// module export
module.exports = PixelNode_Effect_SpriteGrow;


/* Variables
 * ==================================================================================================================== */

 PixelNode_Effect_SpriteGrow.prototype.n = 1;
 PixelNode_Effect_SpriteGrow.prototype.sprites = [];
 PixelNode_Effect_SpriteGrow.prototype.spritePrototype = {
	index: null,
	color1: [0, 255, 0 ],
 	color2: [255, 0, 0 ]
 };



/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Effect_SpriteGrow.prototype.init = function() {
	console.log("Init Effect Rainbow".grey);
}

// draw effect on target
PixelNode_Effect_SpriteGrow.prototype.drawTarget = function(target, output) {
	var self = this;
	var c, c1, c2; 

	// get color 1
	c1 = self.getColor("inputs.rgb.color_right", {
		offset: 90
	});
	c2 = self.getColor("inputs.rgb.color_left");
	
	self.spritePrototype.color1 = c1;
	self.spritePrototype.color2 = c2;


	// get color 1
	cc1 = self.getColor("inputs.rgb.color_right", {
		offset: 90,
		dimmer: 0.25
	});
	// get color 2
	cc2 = self.getColor("inputs.rgb.color_left", {
		dimmer: 0.25
	});

	for (var ring = 0; ring < target.length;ring++) {
		ringSprites = _.filter(self.sprites, {index: ring});
		if (ringSprites == undefined) ringSprites = [];

		ringoffseted = ring -1;
		if ( ringoffseted < 0 ) ringoffseted = ringoffseted + target.length;
		onetwo = ringoffseted / target.length < 0.5;

		for (var pixel = 0; pixel < target[ring].length; pixel++) {
			var reseter = Math.floor(ringSprites.length / target[ring].length);
			var spritePixel = pixel + reseter*target[ring].length;
			var color = onetwo ? cc2 : cc1;
			//console.log(reseter, spritePixel, ringSprites);
			if (ringSprites[spritePixel] != undefined) {
				color = onetwo ? ringSprites[spritePixel].color2 : ringSprites[spritePixel].color1;
			} else if (ringSprites[spritePixel - target[ring].length] != undefined) {
				color = onetwo ? ringSprites[spritePixel - target[ring].length].color2 : ringSprites[spritePixel - target[ring].length].color1;
			}
			target[ring][pixel] = color;
		}
	}
}

PixelNode_Effect_SpriteGrow.prototype.reset = function() {
	this.sprites = [];
}


