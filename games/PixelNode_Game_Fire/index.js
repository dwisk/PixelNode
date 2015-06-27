/**
 * PixelNode_Game_Fire 
 * 
 * Animation Game 
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

// extending Game
PixelNode_Game = require('../../lib/PixelNode_Game.js');

// define the Student class
function PixelNode_Game_Fire(options, effects) {
  var self = this;
  PixelNode_Game_Fire.super_.call(self, options, effects);
  self.className = "PixelNode_Game_Fire";
  self.public_dir = __dirname;
}

// class inheritance 
util.inherits(PixelNode_Game_Fire, PixelNode_Game);

// module export
module.exports = PixelNode_Game_Fire;


/* Variables
 * ==================================================================================================================== */

 PixelNode_Game_Fire.prototype.default_options = {
 	"targets": [
 		"domePixels.strips"
 	],
 	"addAmount": 0.125
 }

PixelNode_Game_Fire.prototype.effect = null;

var last_touches = [];

/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Game_Fire.prototype.init = function() {
	console.log("Init Game Fire".grey);
	var self = this;

	var Effect_Fire = require("../../effects/PixelNode_Effect_Fire");
	self.effect = new Effect_Fire({
		"name": "Fire",
		"module": "../effects/PixelNode_Effect_Fire",
		"outputs": [
			{
				"name": "glow",
				"targets": self.options.targets
			}
		]
	});


	if (global.config.inputMode == "server") {
	}
		self.initListener();
	

}

// draw effect – override this
PixelNode_Game_Fire.prototype.draw = function() {
	var self = this;
	self.effect.draw();


}


PixelNode_Game_Fire.prototype.initListener = function() {
	var self = this;
	global.pixelNode.data.on("changed_inputs_touch_touches", function(paths, value) {
		if (value) {
			index = paths[0];
			if (self.effect.heights[index] <= 1- self.options.addAmount) {
				self.addFire(index, self.options.addAmount);

				for (var i = 1; i <= 12/2; i++) {
					amount = self.options.addAmount * 0.8 * (6-i+1)/6;

					prev = index - i;
					if (prev < 0) prev += 12;

					next = index + i;
					if (next >= 12) next -= 12;

					self.addFire(prev, amount);
					self.addFire(next, amount);

				};
			}
		}
	});
}

PixelNode_Game_Fire.prototype.addFire = function(index, amount) {
	var self = this;
	//console.log("addFire",index,amount);
	
	self.effect.heights[index] += amount;
	if (self.effect.heights[index] > 1) self.effect.heights[index] = 1; 
}

